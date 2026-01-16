package com.tppartdeux.edoctorat.model.professeur;

import com.tppartdeux.edoctorat.model.candidat.Candidat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_examiner")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Examiner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String decision;

    @Column(nullable = false)
    private Float noteDossier;

    @Column(nullable = false)
    private Integer noteEntretien;

    @Column(nullable = false)
    private Boolean publier;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_commission_fk", nullable = false)
    private Commission commission;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_sujet_fk", nullable = false)
    private Sujet sujet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_candidat_fk", nullable = false)
    private Candidat candidat;

    @Column(nullable = false)
    private Boolean valider;
}
