package com.uptute.backend.services.auth;

import com.uptute.backend.entities.RefreshToken;
import com.uptute.backend.exceptions.TokenRefreshException;

public interface RefreshTokenService {
    String createRefreshToken(String uuid);

    RefreshToken getByToken(String refreshToken) throws TokenRefreshException;
}
