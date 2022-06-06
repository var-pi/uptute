package com.uptute.backend.domain;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDetails {
    @NotNull(message = "{validation.grade.required}")
    @Min(value = 3, message = "{validation.last_name.size.too_short}")
    @Max(value = 20, message = "{validation.last_name.size.too_long}")
    private int grade;
}
