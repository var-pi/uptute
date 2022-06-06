package com.uptute.backend.payloads.lessons;

import java.util.List;

import com.uptute.backend.entities.LessonLog;

import lombok.*;

@Data
@AllArgsConstructor
public class OserveLogResponse {
    private String createdBy;
    private Long lessonId;
    private Long logId;
    private List<LessonLog> childLogs;
}
