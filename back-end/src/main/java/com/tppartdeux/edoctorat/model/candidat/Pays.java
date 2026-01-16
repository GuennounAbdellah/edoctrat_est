package com.tppartdeux.edoctorat.model.candidat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidat_pays")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pays {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255, nullable = false)
    private String nom;
}
