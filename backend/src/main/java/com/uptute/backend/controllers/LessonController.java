package com.uptute.backend.controllers;

import java.util.NoSuchElementException;

import javax.validation.Valid;

import com.uptute.backend.exceptions.LogIsClosedException;
import com.uptute.backend.exceptions.UnsupportedParentLogType;
import com.uptute.backend.enums.lesson.ELogType;
import com.uptute.backend.exceptions.AutoExpiredException;
import com.uptute.backend.exceptions.LogAlreadyExists;
import com.uptute.backend.payloads.lessons.CreateLessonRequest;
import com.uptute.backend.services.lessons.LessonService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // ------------------------------------------LOG-CREATION------------------------------------------

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createLesson(@Valid @RequestBody CreateLessonRequest request, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.createLog(null, ELogType.CREATED, auth, request));
        } catch (NoSuchElementException | LogIsClosedException | LogAlreadyExists | UnsupportedParentLogType | AutoExpiredException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logs/{logId}/close")
    @PreAuthorize("hasAnyRole('STUDENT','TUTOR','MODERATOR','ADMIN')")
    public ResponseEntity<?> cancelLog(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.createLog(logId, ELogType.CLOSED, auth, null));
        } catch (NoSuchElementException | LogIsClosedException | LogAlreadyExists | UnsupportedParentLogType | AutoExpiredException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logs/{logId}/offer")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<?> createOffer(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.createLog(logId, ELogType.OFFER, auth, null));
        } catch (NoSuchElementException | LogIsClosedException | LogAlreadyExists | UnsupportedParentLogType | AutoExpiredException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logs/{logId}/accept")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> acceptOffer(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.createLog(logId, ELogType.ACCEPTED, auth, null));
        } catch (NoSuchElementException | LogIsClosedException | LogAlreadyExists | UnsupportedParentLogType | AutoExpiredException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logs/{logId}/init")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<?> initiateConference(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.createLog(logId, ELogType.INIT, auth, null));
        } catch (NoSuchElementException | LogIsClosedException | LogAlreadyExists | UnsupportedParentLogType | AutoExpiredException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ------------------------------------------LOG-OBSERVATION------------------------------------------

    @GetMapping("/logs/{logId}/offer")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> checkForOffers(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.observeLog(logId, ELogType.OFFER, auth));
        } catch (LogIsClosedException | AutoExpiredException | LogAlreadyExists | UnsupportedParentLogType e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/logs/{logId}/accepted")
    @PreAuthorize("hasRole('TUTOR')")
    public ResponseEntity<?> checkForAccepted(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.observeLog(logId, ELogType.ACCEPTED, auth));
        } catch (LogIsClosedException | AutoExpiredException | LogAlreadyExists | UnsupportedParentLogType e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/logs/{logId}/init")
    @PreAuthorize("hasAnyRole('STUDENT','TUTOR')")
    public ResponseEntity<?> checkForInit(@PathVariable Long logId, Authentication auth) {
        try {
            return ResponseEntity.ok(lessonService.observeLog(logId, ELogType.INIT, auth));
        } catch (LogIsClosedException | AutoExpiredException | LogAlreadyExists | UnsupportedParentLogType e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ------------------------------------------------------------------------------------------

    @GetMapping("/open")
    @PreAuthorize("hasAnyRole('TUTOR','MODERATOR','ADMIN')")
    public ResponseEntity<?> getOpenLessons(Authentication auth) {
        return ResponseEntity.ok(lessonService.getOpenLessons(auth));
    }

    // ------------------------------------------------------------------------------------------

    @GetMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('MODERATOR','ADMIN')")
    public ResponseEntity<?> getLessonLogs(@PathVariable Long lessonId) {
        try {
            return ResponseEntity.ok(lessonService.getLessonLogs(lessonId));
        } catch (NoSuchElementException | LogIsClosedException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
