package com.tppartdeux.edoctorat.model.auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "django_content_type")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100, nullable = false)
    private String appLabel;

    @Column(length = 100, nullable = false)
    private String model;
}