package com.tppartdeux.edoctorat.model.professeur;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "professeur_formationdoctorale")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class FormationDoctorale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String pathImage;

    @Column(length = 255)
    private String initiale;

    @Column(length = 255, nullable = false)
    private String titre;

    @Lob
    private String axeDeRecherche;  

    private LocalDate dateAccreditation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_ced_fk", nullable = false)
    private Ced ced;

    @Column(length = 10, nullable = false)
    private String etablissementId;
}
