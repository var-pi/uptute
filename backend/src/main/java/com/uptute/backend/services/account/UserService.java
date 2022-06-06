package com.uptute.backend.services.account;

import java.util.NoSuchElementException;

import com.uptute.backend.entities.User;
import com.uptute.backend.exceptions.UserHasNotRoleException;
import com.uptute.backend.payloads.account.StudentDetailsResponse;
import com.uptute.backend.payloads.account.TutorDetailsResponse;

import org.springframework.security.core.Authentication;

public interface UserService {
    User getUserDetails(Authentication auth);

    StudentDetailsResponse getStudentDetails(String UUID) throws NoSuchElementException, UserHasNotRoleException;

    TutorDetailsResponse getTutorDetails(String UUID) throws NoSuchElementException, UserHasNotRoleException;

}