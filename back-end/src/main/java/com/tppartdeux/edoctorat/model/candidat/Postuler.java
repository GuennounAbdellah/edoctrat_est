package com.tppartdeux.edoctorat.model.candidat;

import com.tppartdeux.edoctorat.model.professeur.Sujet;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidat_postuler")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Postuler {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String pathFile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_candidat_fk", nullable = false)
    private Candidat candidat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_sujet_fk", nullable = false)
    private Sujet sujet;
}
