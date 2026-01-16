package com.tppartdeux.edoctorat.repository.candidat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Diplome;

import java.util.List;

@Repository
public interface DiplomeRepository extends JpaRepository<Diplome, Long> {
    List<Diplome> findByCandidat(Candidat candidat);
    List<Diplome> findByType(String type);
    List<Diplome> findByPays(String pays);
}
