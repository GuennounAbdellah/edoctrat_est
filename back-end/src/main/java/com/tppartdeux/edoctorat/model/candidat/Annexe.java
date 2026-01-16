package com.tppartdeux.edoctorat.model.candidat;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidat_annexe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Annexe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String typeAnnexe;

    @Column(length = 255, nullable = false)
    private String titre;

    @Column(length = 100, nullable = false)
    private String pathFile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_diplome_fk", nullable = false)
    private Diplome diplome;
}
