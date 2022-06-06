package com.uptute.backend.services.account;

import com.uptute.backend.exceptions.AccountAlreadyHasRoleException;
import com.uptute.backend.domain.StudentDetails;
import com.uptute.backend.domain.TutorDetails;
import com.uptute.backend.domain.UserDetails;
import com.uptute.backend.payloads.auth.ShortJwtResponse;

import org.springframework.security.core.Authentication;

public interface UserUpgradeService {
        ShortJwtResponse upgradeToUser(Authentication auth, UserDetails request)
                        throws AccountAlreadyHasRoleException;

        ShortJwtResponse upgradeToStudent(Authentication auth, StudentDetails request)
                        throws AccountAlreadyHasRoleException;

        ShortJwtResponse upgradeToTutor(Authentication auth, TutorDetails request)
                        throws AccountAlreadyHasRoleException;
}
