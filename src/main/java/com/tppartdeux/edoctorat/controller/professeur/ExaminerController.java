package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.Examiner;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Sujet;
import com.tppartdeux.edoctorat.service.professeur.ExaminerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/examiners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExaminerController {

    @Autowired
    private final ExaminerService examinerService;

    // Create
    @PostMapping
    public ResponseEntity<Examiner> create(@RequestBody Examiner examiner) {
        Examiner created = examinerService.create(examiner);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Examiner>> findAll() {
        List<Examiner> examiners = examinerService.findAll();
        return ResponseEntity.ok(examiners);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Examiner> findById(@PathVariable Long id) {
        return examinerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Commission
    @GetMapping("/commission/{commissionId}")
    public ResponseEntity<List<Examiner>> findByCommission(@PathVariable Long commissionId) {
        List<Examiner> examiners = examinerService.findByCommission(
                Commission.builder().id(commissionId).build()
        );
        return ResponseEntity.ok(examiners);
    }

    // Read By Sujet
    @GetMapping("/sujet/{sujetId}")
    public ResponseEntity<List<Examiner>> findBySujet(@PathVariable Long sujetId) {
        List<Examiner> examiners = examinerService.findBySujet(
                Sujet.builder().id(sujetId).build()
        );
        return ResponseEntity.ok(examiners);
    }

    // Read By Candidat
    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<List<Examiner>> findByCandidat(@PathVariable Long candidatId) {
        List<Examiner> examiners = examinerService.findByCandidat(
                Candidat.builder().id(candidatId).build()
        );
        return ResponseEntity.ok(examiners);
    }

    // Read By Publier
    @GetMapping("/publier/{publier}")
    public ResponseEntity<List<Examiner>> findByPublier(@PathVariable Boolean publier) {
        List<Examiner> examiners = examinerService.findByPublier(publier);
        return ResponseEntity.ok(examiners);
    }

    // Read By Valider
    @GetMapping("/valider/{valider}")
    public ResponseEntity<List<Examiner>> findByValider(@PathVariable Boolean valider) {
        List<Examiner> examiners = examinerService.findByValider(valider);
        return ResponseEntity.ok(examiners);
    }

    // Read By Candidat And Sujet
    @GetMapping("/candidat/{candidatId}/sujet/{sujetId}")
    public ResponseEntity<Examiner> findByCandidatAndSujet(
            @PathVariable Long candidatId, 
            @PathVariable Long sujetId) {
        return examinerService.findByCandidatAndSujet(
                Candidat.builder().id(candidatId).build(),
                Sujet.builder().id(sujetId).build()
        )
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Examiner> update(@PathVariable Long id, @RequestBody Examiner examiner) {
        try {
            Examiner updated = examinerService.update(id, examiner);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            examinerService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        examinerService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(examinerService.count());
    }
}
