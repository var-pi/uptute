package com.uptute.backend.entities;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import com.uptute.backend.converters.UserDetailsConverter;
import com.uptute.backend.converters.TutorDetailsConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uptute.backend.converters.StudentDetailsConverter;
import com.uptute.backend.domain.UserDetails;
import com.uptute.backend.domain.TutorDetails;
import com.uptute.backend.domain.StudentDetails;

import org.hibernate.annotations.GenericGenerator;

import lombok.*;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = "email") })
public class User {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String UUID;
    @NonNull
    @Size(max = 50)
    @Email
    private String email;
    @NonNull
    @JsonIgnore
    @Size(max = 120)
    private String password;
    // --------------------------------------------------------
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_uuid"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
    // --------------------------------------------------------
    @Convert(converter = UserDetailsConverter.class)
    private UserDetails userDetails;
    @Convert(converter = StudentDetailsConverter.class)
    private StudentDetails studentDetails;
    @Convert(converter = TutorDetailsConverter.class)
    private TutorDetails tutorDetails;
}