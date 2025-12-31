package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.service.candidat.DiplomeService;
import com.tppartdeux.edoctorat.model.candidat.Diplome;
import com.tppartdeux.edoctorat.service.candidat.CandidatService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidat/diplomes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DiplomeController {

    @Autowired
    private final DiplomeService diplomeService;
    @Autowired
    private final CandidatService candidatService;

    //CRUD Functions
    // Create
    @PostMapping
    public ResponseEntity<Diplome> create(@RequestBody Diplome diplome) {
        Diplome created = diplomeService.create(diplome);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Diplome>> findAll() {
        List<Diplome> diplomes = diplomeService.findAll();
        return ResponseEntity.ok(diplomes);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Diplome> findById(@PathVariable Long id) {
        return diplomeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Candidat
    @GetMapping("/candidat/{candidatId}")
    public ResponseEntity<List<Diplome>> findByCandidat(@PathVariable Long candidatId) {
        return candidatService.findById(candidatId)
                .map(candidat -> ResponseEntity.ok(diplomeService.findByCandidat(candidat)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Diplome>> findByType(@PathVariable String type) {
        List<Diplome> diplomes = diplomeService.findByType(type);
        return ResponseEntity.ok(diplomes);
    }

    // Read By Pays
    @GetMapping("/pays/{pays}")
    public ResponseEntity<List<Diplome>> findByPays(@PathVariable String pays) {
        List<Diplome> diplomes = diplomeService.findByPays(pays);
        return ResponseEntity.ok(diplomes);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Diplome> update(@PathVariable Long id, @RequestBody Diplome diplome) {
        try {
            Diplome updated = diplomeService.update(id, diplome);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            diplomeService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        diplomeService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(diplomeService.count());
    }
}
