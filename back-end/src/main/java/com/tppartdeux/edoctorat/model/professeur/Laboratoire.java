package com.tppartdeux.edoctorat.model.professeur;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_laboratoire")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Laboratoire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255, nullable = false)
    private String nomLaboratoire;

    @Lob
    private String description;

    @Column(length = 100)
    private String pathImage;

    @Column(length = 255)
    private String initial;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_ced_fk", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "directeur"})
    private Ced ced;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_professeur_fk", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "labo", "user"})
    private Professeur directeur;

    @Column(length = 10, nullable = false)
    private String etablissementId;
}
