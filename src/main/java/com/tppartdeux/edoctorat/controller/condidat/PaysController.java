package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.model.candidat.Pays;
import com.tppartdeux.edoctorat.service.candidat.PaysService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidat/pays")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaysController {

    @Autowired
    private final PaysService paysService;

    //CRUD Functions
    // Create
    @PostMapping
    public ResponseEntity<Pays> create(@RequestBody Pays pays) {
        Pays created = paysService.create(pays);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Pays>> findAll() {
        List<Pays> paysList = paysService.findAll();
        return ResponseEntity.ok(paysList);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Pays> findById(@PathVariable Long id) {
        return paysService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Nom
    @GetMapping("/nom/{nom}")
    public ResponseEntity<Pays> findByNom(@PathVariable String nom) {
        return paysService.findByNom(nom)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Pays> update(@PathVariable Long id, @RequestBody Pays pays) {
        try {
            Pays updated = paysService.update(id, pays);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            paysService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        paysService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(paysService.count());
    }
}
