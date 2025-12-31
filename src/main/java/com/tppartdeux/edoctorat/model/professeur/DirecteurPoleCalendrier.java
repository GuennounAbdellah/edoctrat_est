package com.tppartdeux.edoctorat.model.professeur;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "directeur_pole_calendrier")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirecteurPoleCalendrier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 500, nullable = false)
    private String action;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Column(length = 50, nullable = false)
    private String pour;
}
