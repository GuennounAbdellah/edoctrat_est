package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.model.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {
    Optional<Professeur> findByCin(String cin);
    Optional<Professeur> findByUser(User user);
    List<Professeur> findByEtablissementId(String etablissementId);
    List<Professeur> findByGrade(String grade);
    boolean existsByCin(String cin);
}
