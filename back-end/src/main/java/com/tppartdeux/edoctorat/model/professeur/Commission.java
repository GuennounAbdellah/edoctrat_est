package com.tppartdeux.edoctorat.model.professeur;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "professeur_commission")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dateCommission", nullable = false)
    private LocalDate dateCommission;

    @Column(length = 255, nullable = false)
    private String lieu;

    @Column(nullable = false)
    private LocalTime heure;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_laboratoire_fk", nullable = false)
    private Laboratoire labo;
}
