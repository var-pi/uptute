package com.uptute.backend.services.lessons;

import java.util.NoSuchElementException;

import com.uptute.backend.exceptions.LogIsClosedException;
import com.uptute.backend.exceptions.UnsupportedParentLogType;
import com.uptute.backend.enums.lesson.ELogType;
import com.uptute.backend.exceptions.AutoExpiredException;
import com.uptute.backend.exceptions.LogAlreadyExists;
import com.uptute.backend.payloads.lessons.GetLessonLogsResponse;
import com.uptute.backend.payloads.lessons.OpenLessonsResponse;
import com.uptute.backend.payloads.lessons.OserveLogResponse;

import org.springframework.security.core.Authentication;

import com.uptute.backend.payloads.lessons.CreateLogResponse;

public interface LessonService {
    CreateLogResponse createLog(Long parentLogId, ELogType type, Authentication auth, Object details)
            throws NoSuchElementException, LogIsClosedException, LogAlreadyExists, UnsupportedParentLogType, AutoExpiredException;

    OserveLogResponse observeLog(Long logId, ELogType type, Authentication auth) throws NoSuchElementException, LogIsClosedException, AutoExpiredException, LogAlreadyExists, UnsupportedParentLogType;

    OpenLessonsResponse getOpenLessons(Authentication auth);

    GetLessonLogsResponse getLessonLogs(Long logId) throws NoSuchElementException, LogIsClosedException;
}
