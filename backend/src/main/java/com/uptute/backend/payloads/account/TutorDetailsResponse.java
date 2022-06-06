package com.uptute.backend.payloads.account;

import lombok.*;

@Data
@AllArgsConstructor
public class TutorDetailsResponse {
    private String UUID;
    private String firstName;
    private String lastName;
    private Long age;
}
