package com.tppartdeux.edoctorat.model.professeur;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_commission_professeurs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionProfesseurs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_commission_fk", nullable = false)
    private Commission commission;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "professeur_professeur_fk", nullable = false)
    private Professeur professeur;
}
