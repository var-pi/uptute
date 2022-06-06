package com.uptute.backend.payloads.lessons;

import java.util.List;

import lombok.*;

@Data
public class OpenLessonsResponse {
    @NonNull
    private List<LessonDetailsResponse> lessons;
}