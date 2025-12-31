package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.FormationDoctorale;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.service.professeur.FormationDoctoraleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/formations")
@RequiredArgsConstructor
public class FormationDoctoraleController {

    @Autowired
    private final FormationDoctoraleService formationDoctoraleService;

    // Create
    @PostMapping
    public ResponseEntity<FormationDoctorale> create(@RequestBody FormationDoctorale formationDoctorale) {
        FormationDoctorale created = formationDoctoraleService.create(formationDoctorale);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<FormationDoctorale>> findAll() {
        List<FormationDoctorale> formations = formationDoctoraleService.findAll();
        return ResponseEntity.ok(formations);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<FormationDoctorale> findById(@PathVariable Long id) {
        return formationDoctoraleService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Titre
    @GetMapping("/titre/{titre}")
    public ResponseEntity<FormationDoctorale> findByTitre(@PathVariable String titre) {
        return formationDoctoraleService.findByTitre(titre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Initiale
    @GetMapping("/initiale/{initiale}")
    public ResponseEntity<FormationDoctorale> findByInitiale(@PathVariable String initiale) {
        return formationDoctoraleService.findByInitiale(initiale)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By CED
    @GetMapping("/ced/{cedId}")
    public ResponseEntity<List<FormationDoctorale>> findByCed(@PathVariable Long cedId) {
        List<FormationDoctorale> formations = formationDoctoraleService.findByCed(
                Ced.builder().id(cedId).build()
        );
        return ResponseEntity.ok(formations);
    }

    // Read By Etablissement
    @GetMapping("/etablissement/{etablissementId}")
    public ResponseEntity<List<FormationDoctorale>> findByEtablissementId(@PathVariable String etablissementId) {
        List<FormationDoctorale> formations = formationDoctoraleService.findByEtablissementId(etablissementId);
        return ResponseEntity.ok(formations);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<FormationDoctorale> update(@PathVariable Long id, @RequestBody FormationDoctorale formationDoctorale) {
        try {
            FormationDoctorale updated = formationDoctoraleService.update(id, formationDoctorale);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            formationDoctoraleService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        formationDoctoraleService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(formationDoctoraleService.count());
    }
}
