package com.tppartdeux.edoctorat.model.professeur;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_sujet")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Sujet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255, nullable = false)
    private String titre;

    @Lob
    private String description;

    @Column(nullable = false)
    private Boolean publier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coDirecteur_fk")
    private Professeur coDirecteur;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_formationdoctorale_fk", nullable = false)
    private FormationDoctorale formationDoctorale;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_professeur_fk", nullable = false)
    private Professeur professeur;
}
