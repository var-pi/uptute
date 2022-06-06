package com.uptute.backend.services.lessons.logHandlers;

import java.util.Arrays;
import java.util.Date;

import com.uptute.backend.domain.UserDetailsImpl;
import com.uptute.backend.entities.Lesson;
import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELogType;
import com.uptute.backend.exceptions.AutoExpiredException;
import com.uptute.backend.exceptions.LogAlreadyExists;
import com.uptute.backend.exceptions.LogIsClosedException;
import com.uptute.backend.exceptions.UnsupportedParentLogType;
import com.uptute.backend.repositories.LessonLogRepository;
import com.uptute.backend.repositories.LessonRepository;
import com.uptute.backend.services.lessons.LogWrapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

public abstract class AbstractLogHandler {

    @Autowired
    protected LessonLogRepository logRepository;
    @Autowired
    protected LessonRepository lessonRepository;
    @Autowired
    protected LogWrapper logWrapper;

    public LessonLog create(Long parentLogId, String details, Authentication auth)
            throws UnsupportedParentLogType, LogAlreadyExists, LogIsClosedException, AutoExpiredException {
        var userDet = (UserDetailsImpl) ((auth == null) ? null : auth.getPrincipal());
        var userUUID = userDet == null ? "" : userDet.getUUID();
        var log = new LessonLog(getType(), userUUID, details);
        Lesson lesson = null;
        if (parentLogId != null) {
            var parentLog = logRepository.findById(parentLogId).get();
            lesson = parentLog.getLesson();
            validateAuthentication(parentLog, auth, getCreationPermisions());
            validateForSupportedParentType(parentLog, getSupportedParentTypes());
            validateForDuplicates(parentLog, log);
            addToParentLog(parentLog, log);
        } else {
            lesson = lessonRepository.save(new Lesson(userUUID));
        }
        addToLesson(lesson, log);
        logIsCreated(auth, log);
        logWrapper.validateLogForExpiration(log.getParentLog());
        return logRepository.save(log);
    }

    public LessonLog get(Long id, Authentication auth)
            throws LogIsClosedException, UnsupportedParentLogType, AutoExpiredException {
        var log = logRepository.findById(id).get();
        if (!log.getActive())
            throw new LogIsClosedException(log);
        validateForSupportedParentType(log, getSupportedParentTypes());
        validateAuthentication(log, auth, getReceivingPermisions());
        logWrapper.validateLogForExpiration(log);
        return log;
    }

    public void valideteLogForExpiration(LessonLog log) throws AutoExpiredException {
        if (!log.getActive())
            return;
        logWrapper.validateLogForExpiration(log.getParentLog());
        if ((new Date().getTime() - log.getCreatedAt().getTime()) > getExpirationTime()) {
            try {
                logWrapper.createLog(log.getId(), ELogType.CLOSED, null, "AUTO_EXPIRED");
            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
            throw new AutoExpiredException();
        }
    }

    protected enum EPermision {
        LESSON_OWNER,
        LOG_OWNER,
        PARENT_LOG_OWNER,
    }

    protected abstract ELogType getType();

    protected abstract ELogType[] getSupportedParentTypes();

    protected abstract EPermision[] getCreationPermisions();

    protected abstract EPermision[] getReceivingPermisions();

    protected abstract Long getExpirationTime();

    protected abstract void logIsCreated(Authentication auth, LessonLog log);

    protected static void disableLog(LessonLog log) {
        log.setActive(false);
        log.getChildLogs().forEach(c -> disableLog(c));
    }

    private static void validateAuthentication(LessonLog log, Authentication auth, EPermision[] permisions) {
        if (auth == null || permisions == null)
            return;
        var athorities = auth.getAuthorities().stream();
        if (athorities.anyMatch(a -> a.getAuthority().equals("MODERATOR") || a.getAuthority().equals("ADMIN")))
            return;
        for (EPermision permision : permisions) {
            switch (permision) {
                case LESSON_OWNER:
                    if (log.getLesson().getStudentUUID().equals(auth.getName()))
                        return;
                case LOG_OWNER:
                    if (log.getCreatedBy().equals(auth.getName()))
                        return;
                case PARENT_LOG_OWNER:
                    if (log.getParentLog().getCreatedBy().equals(auth.getName()))
                        return;
                default:
                    throw new UnsupportedOperationException();
            }
        }
        throw new BadCredentialsException("User has not access to this command!");
    }

    private static void validateForSupportedParentType(LessonLog parentLog, ELogType[] supportedTypes)
            throws UnsupportedParentLogType {
        if (parentLog == null)
            return;
        if (!Arrays.stream(supportedTypes).anyMatch(parentLog.getType()::equals))
            throw new UnsupportedParentLogType(parentLog);
    }

    private static void validateForDuplicates(LessonLog parentLog, LessonLog log) throws LogAlreadyExists {
        if (parentLog != null)
            for (var l : parentLog.getChildLogs())
                if (l.getType().equals(log.getType()) && l.getCreatedBy().equals(log.getCreatedBy()))
                    throw new LogAlreadyExists(log);
    }

    private static void addToParentLog(LessonLog parentLog, LessonLog log) throws LogIsClosedException {
        if (!parentLog.getActive())
            throw new LogIsClosedException(parentLog);
        log.setParentLog(parentLog);
        parentLog.getChildLogs().add(log);
    }

    private static void addToLesson(Lesson lesson, LessonLog log) {
        lesson.getLogs().add(log);
        log.setLesson(lesson);
    }
}