package com.tppartdeux.edoctorat.model.professeur;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

import com.tppartdeux.edoctorat.model.candidat.Candidat;

@Entity
@Table(name = "professeur_inscription")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateDiposeDossier;

    @Column(length = 255)
    private String remarque;

    @Column(nullable = false)
    private Boolean valider;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_candidat_fk", nullable = false)
    private Candidat candidat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_sujet_fk", nullable = false)
    private Sujet sujet;
}
