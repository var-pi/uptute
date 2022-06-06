package com.uptute.backend.domain;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetails {
    @NotBlank(message = "{validation.firstName.required}")
    @Size(min = 3, message = "{validation.firstName.size.too_short}")
    @Size(max = 20, message = "{validation.firstName.size.too_long}")
    private String firstName;
    @NotBlank(message = "{validation.last_name.required}")
    @Size(min = 3, message = "{validation.last_name.size.too_short}")
    @Size(max = 20, message = "{validation.last_name.size.too_long}")
    private String lastName;
    @NotNull(message = "{validation.birthday.required}")
    @Past(message = "{validation.birthday.invalid}")
    private Date birthday; //yyyy-MM-dd  
}