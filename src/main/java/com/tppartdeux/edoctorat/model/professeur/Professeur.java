package com.tppartdeux.edoctorat.model.professeur;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tppartdeux.edoctorat.model.auth.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professeur_professeur")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Professeur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30)
    private String cin;

    @Column(length = 30)
    private String telProfesseur;

    @Column(length = 200)
    private String pathPhoto;

    @Column(length = 10)
    private String grade;

    @Column(length = 50)
    private String numSOM;

    @Column(nullable = false)
    private Integer nombreEncadrer;

    @Column(nullable = false)
    private Integer nombreProposer;

    @Column(length = 10, nullable = false)
    private String etablissementId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professeur_laboratoire_fk")
    @JsonIgnore
    private Laboratoire labo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auth_user_fk", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;
}
