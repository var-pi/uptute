package com.uptute.backend.domain;

import javax.validation.constraints.NotBlank;

import org.hibernate.validator.constraints.URL;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutorDetails {
    @NotBlank(message = "{validation.conference_link.required}")
    @URL(message = "{validation.conference_link.invalid}")
    private String conferenceLink;
}
