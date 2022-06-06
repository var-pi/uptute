package com.uptute.backend.payloads.auth;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignupRequest {
    @NotBlank(message = "{validation.email.required}")
    @Email(message = "{validation.email.invalid}")
    private String email;
    @NotBlank(message = "{validation.password.required}")
    @Size(min = 6, message = "{validation.password.size.too_short}")
    @Size(max = 40, message = "{validation.password.size.too_long}")
    private String password;
}
