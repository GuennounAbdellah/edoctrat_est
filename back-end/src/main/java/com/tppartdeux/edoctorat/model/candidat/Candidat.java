package com.tppartdeux.edoctorat.model.candidat;

import com.tppartdeux.edoctorat.model.auth.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "candidat_candidat")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false)
    private String cne;

    @Column(length = 30, nullable = false)
    private String cin;

    @Column(length = 255)
    private String nomCandidatAr;

    @Column(length = 255)
    private String prenomCandidatAr;

    @Lob
    private String adresse;

    @Lob
    private String adresseAr;

    @Column(length = 20)
    private String sexe;

    @Column(length = 255, nullable = false)
    private String villeDeNaissance;

    @Column(length = 255)
    private String villeDeNaissanceAr;

    @Column(length = 255, nullable = false)
    private String ville;

    @Column(nullable = false)
    private LocalDate dateDeNaissance;

    @Column(length = 30)
    private String typeDeHandiCape;

    @Column(length = 255)
    private String academie;

    @Column(length = 30)
    private String telCandidat;

    @Column(length = 100)
    private String pathCv;

    @Column(length = 100)
    private String pathPhoto;

    private Integer etatDossier;

    @Column(length = 50)
    private String situationFamiliale;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidat_pays_fk", nullable = false)
    private Pays pays;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auth_user_fk", nullable = false)
    private User user;

    @Column(nullable = false)
    private Boolean fonctionaire;
}
