package com.uptute.backend.controllers;

import java.util.NoSuchElementException;

import javax.validation.Valid;

import com.uptute.backend.domain.StudentDetails;
import com.uptute.backend.domain.TutorDetails;
import com.uptute.backend.domain.UserDetails;
import com.uptute.backend.exceptions.AccountAlreadyHasRoleException;
import com.uptute.backend.exceptions.InvalidParamException;
import com.uptute.backend.exceptions.UserHasNotRoleException;
import com.uptute.backend.services.account.UserService;
import com.uptute.backend.services.account.UserUpdateService;
import com.uptute.backend.services.account.UserUpgradeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserUpgradeService upgradeService;

    @Autowired
    private UserUpdateService updateService;

    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(Authentication auth) {
        return ResponseEntity.ok(userService.getUserDetails(auth));
    }

    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/me/user")
    public ResponseEntity<?> updateUserDetails(Authentication auth,
            @RequestBody UserDetails request) {
        try {
            return ResponseEntity.ok(updateService.updateUserDetails(auth, request));
        } catch (InvalidParamException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/me/user")
    public ResponseEntity<?> upgradeToUser(Authentication auth, @RequestBody @Valid UserDetails request) {
        try {
            return ResponseEntity.ok(upgradeService.upgradeToUser(auth, request));
        } catch (AccountAlreadyHasRoleException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/me/student")
    public ResponseEntity<?> upgradeToStudent(Authentication auth, @RequestBody @Valid StudentDetails request) {
        try {
            return ResponseEntity.ok(upgradeService.upgradeToStudent(auth, request));
        } catch (AccountAlreadyHasRoleException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/me/tutor")
    public ResponseEntity<?> upgradeToTutor(Authentication auth, @RequestBody @Valid TutorDetails request) {
        try {
            return ResponseEntity.ok(upgradeService.upgradeToTutor(auth, request));
        } catch (AccountAlreadyHasRoleException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('TUTOR')")
    @GetMapping("/{UUID}/student")
    public ResponseEntity<?> getStudentDetails(@PathVariable String UUID) {
        try {
            return ResponseEntity.ok(userService.getStudentDetails(UUID));
        } catch (NoSuchElementException | UserHasNotRoleException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{UUID}/tutor")
    public ResponseEntity<?> getTutorDetails(@PathVariable String UUID) {
        try {
            return ResponseEntity.ok(userService.getTutorDetails(UUID));
        } catch (NoSuchElementException | UserHasNotRoleException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}