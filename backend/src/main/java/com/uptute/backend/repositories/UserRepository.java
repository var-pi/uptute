package com.uptute.backend.repositories;

import java.util.Optional;

import com.uptute.backend.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUUID(String uuid);

    Optional<User> findByEmail(String uuid);

    Boolean existsByEmail(String email);
}
