package com.uptute.backend.repositories;

import java.util.List;

import com.uptute.backend.entities.LessonLog;
import com.uptute.backend.enums.lesson.ELogType;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonLogRepository extends JpaRepository<LessonLog, Long> {
    List<LessonLog> findByTypeAndCreatedByAndActive(ELogType type, String createdBy, Boolean active);
}
