package com.uptute.backend.payloads.lessons;

import lombok.Data;
import lombok.NonNull;

@Data
public class LessonDetailsResponse {
    @NonNull
    private Long lessonId;
    @NonNull
    private Long logId;
    @NonNull
    private String studentUUID;
    @NonNull
    private String details;
}
