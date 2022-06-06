package com.uptute.backend.services.account;

import com.uptute.backend.exceptions.AccountAlreadyHasRoleException;
import com.uptute.backend.domain.StudentDetails;
import com.uptute.backend.domain.TutorDetails;
import com.uptute.backend.domain.UserDetails;
import com.uptute.backend.entities.User;
import com.uptute.backend.enums.ERole;
import com.uptute.backend.payloads.auth.ShortJwtResponse;
import com.uptute.backend.repositories.RoleRepository;
import com.uptute.backend.repositories.UserRepository;
import com.uptute.backend.services.auth.AuthService;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UserUpgradeServiceImpl implements UserUpgradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuthService authService;

    @Override
    public ShortJwtResponse upgradeToUser(Authentication auth,
            UserDetails request) throws AccountAlreadyHasRoleException {
        var user = getUser(auth);
        upgrade(user, ERole.ROLE_USER);
        var det = new UserDetails(request.getFirstName(), request.getLastName(), request.getBirthday());
        user.setUserDetails(det);
        return authService.authUser(userRepository.save(user));
    }

    @Override
    public ShortJwtResponse upgradeToStudent(Authentication auth,
            StudentDetails request) throws AccountAlreadyHasRoleException {
        var user = getUser(auth);
        upgrade(user, ERole.ROLE_STUDENT);
        var det = new StudentDetails(request.getGrade());
        user.setStudentDetails(det);
        userRepository.save(user);
        return authService.authUser(userRepository.save(user));
    }

    @Override
    public ShortJwtResponse upgradeToTutor(Authentication auth,
            TutorDetails request) throws AccountAlreadyHasRoleException {
        var user = getUser(auth);
        upgrade(user, ERole.ROLE_TUTOR);
        var det = new TutorDetails(request.getConferenceLink());
        user.setTutorDetails(det);
        userRepository.save(user);
        return authService.authUser(userRepository.save(user));
    }

    private void upgrade(User user, ERole newRole)
            throws AccountAlreadyHasRoleException {
        if (hasRole(user, newRole))
            throw new AccountAlreadyHasRoleException(user.getUUID(), newRole);
        user.getRoles().add(roleRepository.findByName(newRole)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found")));
    }

    private User getUser(Authentication auth) {
        return userRepository.findByUUID(auth.getName()).get();
    }

    private Boolean hasRole(User user, ERole role) {
        return user.getRoles().stream().anyMatch(r -> r.getName().equals(role));
    }
}