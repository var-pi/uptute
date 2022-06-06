package com.uptute.backend.services.account;

import java.util.function.Function;

import javax.validation.Validator;

import com.uptute.backend.entities.User;
import com.uptute.backend.exceptions.InvalidParamException;
import com.uptute.backend.domain.StudentDetails;
import com.uptute.backend.domain.TutorDetails;
import com.uptute.backend.domain.UserDetails;
import com.uptute.backend.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UserUpdateServiceImpl implements UserUpdateService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validator validator;

    @Override
    public UserDetails updateUserDetails(Authentication auth, UserDetails request)
            throws InvalidParamException {
        return updateDetails(request, auth, User::getUserDetails);
    }

    @Override
    public StudentDetails updateStudentDetails(Authentication auth, StudentDetails request)
            throws InvalidParamException {
        return updateDetails(request, auth, User::getStudentDetails);
    }

    @Override
    public TutorDetails updateTutorDetails(Authentication auth, TutorDetails request)
            throws InvalidParamException {
        return updateDetails(request, auth, User::getTutorDetails);
    }

    private <T> T updateDetails(T request, Authentication auth, Function<User, T> getDetails)
            throws InvalidParamException {
        validateRequest(request);
        var user = userRepository.findByUUID(auth.getName()).get();
        setDetails(getDetails.apply(user), request);
        userRepository.save(user);
        return request;
    }

    private void validateRequest(Object request) throws InvalidParamException {
        for (var v : validator.validate(request)) {
            if (v.getInvalidValue() != null)
                throw new InvalidParamException(v.getMessage());
        }
    }

    private <T> void setDetails(T details, T request) {
        try {
            for (var field : details.getClass().getDeclaredFields()) {
                field.setAccessible(true);
                field.set(details, (field.get(request) != null) ? field.get(request) : field.get(details));
            }
            request = details;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}