package com.tppartdeux.edoctorat.model.auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth_user_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserGroups {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "auth_user_fk", referencedColumnName = "id", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "auth_group_fk", referencedColumnName = "id", nullable = false)
    private Group group;
}
