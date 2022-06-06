package com.uptute.backend.services.auth;

import java.time.Instant;
import java.util.UUID;

import com.uptute.backend.entities.RefreshToken;
import com.uptute.backend.exceptions.TokenRefreshException;
import com.uptute.backend.repositories.UserRepository;
import com.uptute.backend.repositories.RefreshTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${uptute.app.jwtRefreshExpirationMs}")
    private Long expirationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository accauntRepository;

    @Override
    public String createRefreshToken(String uuid) {
        RefreshToken refreshToken = new RefreshToken();
        String token = UUID.randomUUID().toString();
        refreshToken.setAccaunt(accauntRepository.findByUUID(uuid).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(expirationMs));
        refreshToken.setToken(token);
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    @Override
    public RefreshToken getByToken(String refreshToken) throws TokenRefreshException {
        var token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new TokenRefreshException(refreshToken, "Refresh token is not in database!"));
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired.");
        }
        return token;
    }
}