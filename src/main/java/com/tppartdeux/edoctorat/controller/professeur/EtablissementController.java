package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.Etablissement;
import com.tppartdeux.edoctorat.service.professeur.EtablissementService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/etablissements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EtablissementController {

    @Autowired
    private final EtablissementService etablissementService;

    // Create
    @PostMapping
    public ResponseEntity<Etablissement> create(@RequestBody Etablissement etablissement) {
        Etablissement created = etablissementService.create(etablissement);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Etablissement>> findAll() {
        List<Etablissement> etablissements = etablissementService.findAll();
        return ResponseEntity.ok(etablissements);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Etablissement> findById(@PathVariable String id) {
        return etablissementService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Nom
    @GetMapping("/nom/{nomEtablissement}")
    public ResponseEntity<Etablissement> findByNomEtablissement(@PathVariable String nomEtablissement) {
        return etablissementService.findByNomEtablissement(nomEtablissement)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Etablissement> update(@PathVariable String id, @RequestBody Etablissement etablissement) {
        try {
            Etablissement updated = etablissementService.update(id, etablissement);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            etablissementService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        etablissementService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(etablissementService.count());
    }
}
