package com.uptute.backend.services.lessons;

import java.util.NoSuchElementException;

import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELogType;
import com.uptute.backend.exceptions.AutoExpiredException;
import com.uptute.backend.exceptions.LogAlreadyExists;
import com.uptute.backend.exceptions.LogIsClosedException;
import com.uptute.backend.exceptions.UnsupportedParentLogType;

import org.springframework.security.core.Authentication;

public interface LogWrapper {
    LessonLog createLog(Long parentLogId, ELogType type, Authentication auth, String details)
            throws NoSuchElementException, LogIsClosedException, LogAlreadyExists, UnsupportedParentLogType, AutoExpiredException;

    LessonLog getLog(Long id, ELogType type, Authentication auth) throws NoSuchElementException, AutoExpiredException, LogIsClosedException, LogAlreadyExists, UnsupportedParentLogType;

    void validateLogForExpiration(LessonLog log) throws AutoExpiredException;
}
