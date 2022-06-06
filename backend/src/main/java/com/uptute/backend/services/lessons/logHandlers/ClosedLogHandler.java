package com.uptute.backend.services.lessons.logHandlers;

import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELessonStatus;
import com.uptute.backend.enums.lesson.ELogType;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class ClosedLogHandler extends AbstractLogHandler {
    @Override
    protected ELogType getType() { return ELogType.CLOSED; }
    @Override
    protected ELogType[] getSupportedParentTypes() { return ELogType.values(); }
    @Override
    protected EPermision[] getCreationPermisions() { return new EPermision[] { EPermision.LESSON_OWNER, EPermision.LOG_OWNER }; }
    @Override
    protected EPermision[] getReceivingPermisions() { return null; }
    @Override
    protected Long getExpirationTime() { return Long.MAX_VALUE; }
    @Override
    protected void logIsCreated(Authentication auth, LessonLog log) { 
        var parentLog = log.getParentLog();
        disableLog(parentLog);
        if(parentLog.getType().equals(ELogType.CREATED))
            parentLog.getLesson().setStatus(ELessonStatus.CLOSED);
    }
}
