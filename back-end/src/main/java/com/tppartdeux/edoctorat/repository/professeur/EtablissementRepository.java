package com.tppartdeux.edoctorat.repository.professeur;

import com.tppartdeux.edoctorat.model.professeur.Etablissement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, String> {
    Optional<Etablissement> findByNomEtablissement(String nomEtablissement);
}
