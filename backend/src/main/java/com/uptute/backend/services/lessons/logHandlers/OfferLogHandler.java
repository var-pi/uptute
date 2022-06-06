package com.uptute.backend.services.lessons.logHandlers;

import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELogType;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class OfferLogHandler extends AbstractLogHandler {
    @Value("${uptute.app.logsExpirationMs.offer}")
    private Long expirationTime;
    @Override
    protected ELogType getType() { return ELogType.OFFER; }
    @Override
    protected ELogType[] getSupportedParentTypes() { return new ELogType[] { ELogType.CREATED }; }
    @Override
    protected EPermision[] getCreationPermisions() { return null; }
    @Override
    protected EPermision[] getReceivingPermisions() { return new EPermision[] { EPermision.LOG_OWNER }; }
    @Override
    protected Long getExpirationTime() { return expirationTime; }
    @Override
    protected void logIsCreated(Authentication auth, LessonLog log) {}
}
