package com.uptute.backend.entities;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uptute.backend.enums.lesson.ELogType;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;

import lombok.*;


@Entity
@Getter
@RequiredArgsConstructor
@NoArgsConstructor
@Table(name = "logs")
public class LessonLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    private ELogType type;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Lesson lesson;

    @Setter
    @JsonIgnore
    private Boolean active = true;

    @OneToMany(mappedBy = "parentLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<LessonLog> childLogs = new HashSet<>();

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private LessonLog parentLog;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @NonNull
    private String createdBy;

    @NonNull
    @Setter
    private String details;


    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}