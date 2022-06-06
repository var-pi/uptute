package com.uptute.backend.payloads.lessons;

import javax.validation.constraints.NotBlank;
// import javax.validation.constraints.NotNull;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {
    @NotBlank(message = "{validation.subject.required}")
    private String subject;
    private String details;
    private String topic;
    // @NotNull(message = "At least one languge is mandatory")
    // private String[] languages;
}
