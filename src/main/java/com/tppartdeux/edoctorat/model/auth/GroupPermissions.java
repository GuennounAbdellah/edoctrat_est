package com.tppartdeux.edoctorat.model.auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth_group_permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class GroupPermissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "group_id", referencedColumnName = "id", nullable = false)
    @ToString.Exclude
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "permission_id", referencedColumnName = "id", nullable = false)
    private Permission permission;
}