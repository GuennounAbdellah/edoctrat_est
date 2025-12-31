package com.tppartdeux.edoctorat.model.professeur;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_ced")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ced {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String description;

    @Column(length = 100)
    private String pathImage;

    //abbreviation
    @Column(length = 255)
    private String initiale;

    @Column(length = 255, nullable = false)
    private String titre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professeur_professeur_fk")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "labo", "user"})
    private Professeur directeur;
}
