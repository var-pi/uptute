package com.uptute.backend.payloads.account;

import lombok.*;

@Data
@AllArgsConstructor
public class StudentDetailsResponse {
    private String UUID;
    private String firstName;
    private String lastName;
    private int grade;
}
