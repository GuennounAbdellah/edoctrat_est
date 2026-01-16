package com.tppartdeux.edoctorat.model.professeur;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_etablissement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Etablissement {
    @Id
    @Column(name = "idEtablissement", length = 10)
    private String idEtablissement;

    @Column(length = 255, nullable = false)
    private String nomEtablissement;
}
