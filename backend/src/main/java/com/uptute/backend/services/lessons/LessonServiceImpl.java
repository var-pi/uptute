package com.uptute.backend.services.lessons;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uptute.backend.entities.Lesson;
import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELessonStatus;
import com.uptute.backend.enums.lesson.ELogType;
import com.uptute.backend.exceptions.AutoExpiredException;
import com.uptute.backend.exceptions.LogAlreadyExists;
import com.uptute.backend.exceptions.LogIsClosedException;
import com.uptute.backend.exceptions.UnsupportedParentLogType;
import com.uptute.backend.payloads.lessons.LessonDetailsResponse;
import com.uptute.backend.payloads.lessons.GetLessonLogsResponse;
import com.uptute.backend.payloads.lessons.OpenLessonsResponse;
import com.uptute.backend.payloads.lessons.OserveLogResponse;
import com.uptute.backend.repositories.LessonRepository;
import com.uptute.backend.payloads.lessons.CreateLogResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class LessonServiceImpl implements LessonService {

    public final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LogWrapper logWrapper;
    // -----------------------------------------------------------------------

    @Override
    public CreateLogResponse createLog(Long parentLogId, ELogType type, Authentication auth, Object details)
            throws NoSuchElementException, LogIsClosedException, LogAlreadyExists, UnsupportedParentLogType,
            AutoExpiredException {
        var log = logWrapper.createLog(parentLogId, type, auth, convertToJSON(details));
        return new CreateLogResponse(log.getLesson().getId(), log.getId());
    }

    @Override
    public OserveLogResponse observeLog(Long logId, ELogType type, Authentication auth) throws NoSuchElementException,
            LogIsClosedException, AutoExpiredException, LogAlreadyExists, UnsupportedParentLogType {
        var log = logWrapper.getLog(logId, type, auth);
        var childLogs = log.getChildLogs()
                .stream()
                .filter(c -> c.getActive() && c.getType().equals(type))
                .collect(Collectors.toList());
        return new OserveLogResponse(log.getCreatedBy(), log.getLesson().getId(), log.getId(), childLogs);
    }
    // -----------------------------------------------------------------------

    @Override
    public GetLessonLogsResponse getLessonLogs(Long lessonId) throws NoSuchElementException, LogIsClosedException {
        var lesson = lessonRepository.findById(lessonId).get();
        var logs = new ArrayList<LessonLog>(lesson.getLogs());
        return GetLessonLogsResponse.builder().lessonId(lesson.getId()).logs(logs).build();
    }

    @Override
    public OpenLessonsResponse getOpenLessons(Authentication auth) {
        var lessons = lessonRepository.findByStatus(ELessonStatus.OPEN);
        if (lessons == null)
            return null;
        var lessonDets = lessons.stream()
                .filter(l -> validateLesson(l, auth))
                .map(l -> getLessonDetailsResponse(l))
                .collect(Collectors.toList());
        return new OpenLessonsResponse(lessonDets);
    }

    // ---------------------------------------------------------------------------

    private Boolean validateLesson(Lesson lesson, Authentication auth) {
        try {
            logWrapper.validateLogForExpiration(lesson.getLogs().iterator().next());
        } catch (AutoExpiredException e) {
            return false;
        } catch (NoSuchElementException e) {
            lesson.setStatus(ELessonStatus.CLOSED);
            lessonRepository.save(lesson);
            return false;
        }
        for (var log : lesson.getLogs()) {
            if (log.getCreatedBy().equals(auth.getName())) {
                return false;
            }
        }
        return true;
    }

    private LessonDetailsResponse getLessonDetailsResponse(Lesson lesson) {
        var log = lesson.getLogs().iterator().next();
        return new LessonDetailsResponse(lesson.getId(), log.getId(), log.getCreatedBy(), log.getDetails());
    }

    private String convertToJSON(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            return "";
        }
    }
}