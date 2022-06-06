package com.uptute.backend.services.auth;

import java.util.NoSuchElementException;

import com.uptute.backend.entities.User;
import com.uptute.backend.exceptions.EmailIsAlreadyTakenException;
import com.uptute.backend.exceptions.TokenRefreshException;
import com.uptute.backend.payloads.auth.JwtResponse;
import com.uptute.backend.payloads.auth.ShortJwtResponse;
import com.uptute.backend.payloads.auth.SigninRequest;
import com.uptute.backend.payloads.auth.SignupRequest;

import org.springframework.security.core.AuthenticationException;

public interface AuthService {

    JwtResponse signup(SignupRequest request) throws EmailIsAlreadyTakenException;

    JwtResponse signin(SigninRequest request) throws NoSuchElementException, AuthenticationException;
    
    JwtResponse refreshToken(String refreshToken) throws TokenRefreshException;

    ShortJwtResponse authUser(User user);
}
