package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.model.professeur.FormationDoctorale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SujetRepository extends JpaRepository<Sujet, Long> {
    List<Sujet> findByProfesseur(Professeur professeur);
    List<Sujet> findByFormationDoctorale(FormationDoctorale formationDoctorale);
    List<Sujet> findByPublier(Boolean publier);
    List<Sujet> findByCoDirecteur(Professeur coDirecteur);
}
