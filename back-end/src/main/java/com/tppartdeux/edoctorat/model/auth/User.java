package com.tppartdeux.edoctorat.model.auth;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "auth_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(length = 128, nullable = false)
    private String password;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "is_superuser", nullable = false)
    private Boolean isSuperuser;

    @Column(length = 150, nullable = false)
    private String username;

    @Column(length = 150)
    private String firstName;

    @Column(length = 150)
    private String lastName;

    @Column(length = 254)
    private String email;

    @Column(name = "is_staff", nullable = false)
    private Boolean isStaff;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "date_joined", nullable = false)
    private LocalDateTime dateJoined;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    @ToString.Exclude
    private Set<UserGroups> userGroups = new HashSet<>();

}
