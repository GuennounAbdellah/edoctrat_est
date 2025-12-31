package com.tppartdeux.edoctorat.repository.candidat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.candidat.Candidat;

@Repository
public interface CandidatRepository extends JpaRepository <Candidat, Long> {

    Optional<Candidat> findByCin(String cin);

    Optional<Candidat> findByCne(String cne);

    Optional<Candidat> findByUser(User user);

    List<Candidat> findByEtatDossier(Integer etatDossier);

    boolean existsByCin(String cin);

    boolean existsByCne(String cne);
    
}
