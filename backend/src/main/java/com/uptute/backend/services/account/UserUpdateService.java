package com.uptute.backend.services.account;

import com.uptute.backend.domain.StudentDetails;
import com.uptute.backend.domain.TutorDetails;
import com.uptute.backend.domain.UserDetails;
import com.uptute.backend.exceptions.InvalidParamException;


import org.springframework.security.core.Authentication;

public interface UserUpdateService {
    UserDetails updateUserDetails(Authentication auth, UserDetails request) throws InvalidParamException;

    StudentDetails updateStudentDetails(Authentication auth, StudentDetails request) throws InvalidParamException;

    TutorDetails updateTutorDetails(Authentication auth, TutorDetails request) throws InvalidParamException;

}
