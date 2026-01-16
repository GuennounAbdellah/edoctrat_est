package com.tppartdeux.edoctorat.model.auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth_permission")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 100, nullable = false)
    private String codename;

    // For now, removing the content type reference to avoid circular dependency issues
    // We'll implement a simplified permission system
}