package com.uptute.backend.exceptions;

import com.uptute.backend.enums.ERole;

public class AccountAlreadyHasRoleException extends Exception {
    public AccountAlreadyHasRoleException(String UUID, ERole role) {
        super("User " + UUID + " already has role " + role + "!!!");
    }
}
