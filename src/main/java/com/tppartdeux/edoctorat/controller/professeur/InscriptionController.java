package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Inscription;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.service.professeur.InscriptionService;
import com.tppartdeux.edoctorat.service.candidat.CandidatService;
import com.tppartdeux.edoctorat.service.professeur.SujetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InscriptionController {

    @Autowired
    private final InscriptionService inscriptionService;
    @Autowired
    private final SujetService sujetService;
    @Autowired
    private final CandidatService candidatService;

    // Create
    @PostMapping("/professeur/inscriptions")
    public ResponseEntity<Inscription> create(@RequestBody Inscription inscription) {
        Inscription created = inscriptionService.create(inscription);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping("/professeur/inscriptions")
    public ResponseEntity<List<Inscription>> findAll() {
        List<Inscription> inscriptions = inscriptionService.findAll();
        return ResponseEntity.ok(inscriptions);
    }

    // Read By ID
    @GetMapping("/professeur/inscriptions/{id}")
    public ResponseEntity<Inscription> findById(@PathVariable Long id) {
        return inscriptionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Candidat
    @GetMapping("/professeur/inscriptions/candidat/{candidatId}")
    public ResponseEntity<List<Inscription>> findByCandidat(@PathVariable Long candidatId) {
        List<Inscription> inscriptions = inscriptionService.findByCandidat(
                Candidat.builder().id(candidatId).build()
        );
        return ResponseEntity.ok(inscriptions);
    }

    // Read By Sujet
    @GetMapping("/professeur/inscriptions/sujet/{sujetId}")
    public ResponseEntity<List<Inscription>> findBySujet(@PathVariable Long sujetId) {
        List<Inscription> inscriptions = inscriptionService.findBySujet(
                Sujet.builder().id(sujetId).build()
        );
        return ResponseEntity.ok(inscriptions);
    }

    // Read By Valider
    @GetMapping("/professeur/inscriptions/valider/{valider}")
    public ResponseEntity<List<Inscription>> findByValider(@PathVariable Boolean valider) {
        List<Inscription> inscriptions = inscriptionService.findByValider(valider);
        return ResponseEntity.ok(inscriptions);
    }

    // Read By Candidat And Sujet
    @GetMapping("/professeur/inscriptions/candidat/{candidatId}/sujet/{sujetId}")
    public ResponseEntity<Inscription> findByCandidatAndSujet(
            @PathVariable Long candidatId, 
            @PathVariable Long sujetId) {
        return inscriptionService.findByCandidatAndSujet(
                Candidat.builder().id(candidatId).build(),
                Sujet.builder().id(sujetId).build()
        )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/professeur/inscriptions/{id}")
    public ResponseEntity<Inscription> update(@PathVariable Long id, @RequestBody Inscription inscription) {
        try {
            Inscription updated = inscriptionService.update(id, inscription);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/professeur/inscriptions/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            inscriptionService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping("/professeur/inscriptions")
    public ResponseEntity<Void> deleteAll() {
        inscriptionService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/professeur/inscriptions/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(inscriptionService.count());
    }

    // Add Inscription
    @PostMapping("/add-inscription/{sujetId}")
    public ResponseEntity<Inscription> sendSubjectChosen(@PathVariable Long sujetId, @RequestBody Sujet sujetDetails) {
        // Assuming the user is authenticated and we can get the candidat from the security context
        // This part needs to be implemented based on the security configuration
        // For now, let's assume we have a way to get the current user's candidat id.
        // Long currentCandidatId = ... ;
        // Candidat candidat = candidatService.findById(currentCandidatId).orElse(null);
        
        // Using a placeholder candidat for now
        Candidat candidat = candidatService.findById(1L).orElse(null);

        if (candidat == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Sujet sujet = sujetService.findById(sujetId).orElse(null);
        if (sujet == null) {
            return ResponseEntity.notFound().build();
        }

        Inscription inscription = new Inscription();
        inscription.setCandidat(candidat);
        inscription.setSujet(sujet);
        inscription.setDateDiposeDossier(LocalDate.now());
        inscription.setValider(false); // Default value

        Inscription createdInscription = inscriptionService.create(inscription);
        return new ResponseEntity<>(createdInscription, HttpStatus.CREATED);
    }
}
