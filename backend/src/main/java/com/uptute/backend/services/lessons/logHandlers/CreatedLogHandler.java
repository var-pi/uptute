package com.uptute.backend.services.lessons.logHandlers;

import java.util.NoSuchElementException;

import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELogType;
import com.uptute.backend.exceptions.AutoExpiredException;
import com.uptute.backend.exceptions.LogAlreadyExists;
import com.uptute.backend.exceptions.LogIsClosedException;
import com.uptute.backend.exceptions.UnsupportedParentLogType;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class CreatedLogHandler extends AbstractLogHandler {
    @Value("${uptute.app.logsExpirationMs.created}")
    private Long expirationTime;
    @Override
    protected ELogType getType() { return ELogType.CREATED; }
    @Override
    protected ELogType[] getSupportedParentTypes() { return null; }
    @Override
    protected EPermision[] getCreationPermisions() { return null; }
    @Override
    protected EPermision[] getReceivingPermisions() { return new EPermision[] { EPermision.LOG_OWNER }; }
    @Override
    protected Long getExpirationTime() { return expirationTime; }
    @Override
    protected void logIsCreated(Authentication auth, LessonLog log) {
        logRepository.findByTypeAndCreatedByAndActive(ELogType.CREATED, log.getCreatedBy(), true).stream().forEach(l -> {
            try {
                logWrapper.createLog(l.getId(), ELogType.CLOSED, auth, "AVOIDING_DUBLICATES");
            } catch (NoSuchElementException | LogIsClosedException | LogAlreadyExists | UnsupportedParentLogType
                    | AutoExpiredException e) {
                e.printStackTrace();
            }
        });
    }
}