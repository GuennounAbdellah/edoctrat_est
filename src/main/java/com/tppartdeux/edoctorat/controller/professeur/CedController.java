package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.service.professeur.CedService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/ceds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CedController {

    @Autowired
    private final CedService cedService;

    // Create
    @PostMapping
    public ResponseEntity<Ced> create(@RequestBody Ced ced) {
        Ced created = cedService.create(ced);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Ced>> findAll() {
        List<Ced> ceds = cedService.findAll();
        return ResponseEntity.ok(ceds);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Ced> findById(@PathVariable Long id) {
        return cedService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Titre
    @GetMapping("/titre/{titre}")
    public ResponseEntity<Ced> findByTitre(@PathVariable String titre) {
        return cedService.findByTitre(titre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Initiale
    @GetMapping("/initiale/{initiale}")
    public ResponseEntity<Ced> findByInitiale(@PathVariable String initiale) {
        return cedService.findByInitiale(initiale)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Directeur
    @GetMapping("/directeur/{directeurId}")
    public ResponseEntity<List<Ced>> findByDirecteur(@PathVariable Long directeurId) {
        List<Ced> ceds = cedService.findByDirecteur(
                Professeur.builder().id(directeurId).build()
        );
        return ResponseEntity.ok(ceds);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Ced> update(@PathVariable Long id, @RequestBody Ced ced) {
        try {
            Ced updated = cedService.update(id, ced);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            cedService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        cedService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(cedService.count());
    }
}
