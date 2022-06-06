package com.uptute.backend.exceptions;

import com.uptute.backend.enums.ERole;

public class UserHasNotRoleException extends Exception {
    public UserHasNotRoleException(String UUID, ERole role) {
        super("User " + UUID + " has not role " + role + "!!!");
    }
}
