package com.tppartdeux.edoctorat.model.auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth_group")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 150, nullable = false)
    private String name;

}
