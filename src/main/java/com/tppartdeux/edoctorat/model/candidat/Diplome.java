package com.tppartdeux.edoctorat.model.candidat;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "candidat_diplome")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diplome {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255, nullable = false)
    private String intitule;

    @Column(length = 500)
    private String type;

    @Column(name = "dateCommission", nullable = false)
    private LocalDate dateCommission;

    @Column(length = 50, nullable = false)
    private String mention;

    @Column(length = 255, nullable = false)
    private String pays;

    @Column(length = 255, nullable = false)
    private String etablissement;

    @Column(length = 255)
    private String specialite;

    @Column(length = 255, nullable = false)
    private String ville;

    @Column(length = 255, nullable = false)
    private String province;

    private Double moyenGenerale;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_candidat_fk", nullable = false)
    private Candidat candidat;
}
