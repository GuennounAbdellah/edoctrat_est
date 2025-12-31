package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.CommissionProfesseurs;
import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.service.professeur.CommissionProfesseursService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeur/commission-professeurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommissionProfesseursController {

    @Autowired
    private final CommissionProfesseursService commissionProfesseursService;

    // Create
    @PostMapping
    public ResponseEntity<CommissionProfesseurs> create(@RequestBody CommissionProfesseurs commissionProfesseurs) {
        CommissionProfesseurs created = commissionProfesseursService.create(commissionProfesseurs);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<CommissionProfesseurs>> findAll() {
        List<CommissionProfesseurs> commissionProfesseurs = commissionProfesseursService.findAll();
        return ResponseEntity.ok(commissionProfesseurs);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<CommissionProfesseurs> findById(@PathVariable Long id) {
        return commissionProfesseursService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Commission
    @GetMapping("/commission/{commissionId}")
    public ResponseEntity<List<CommissionProfesseurs>> findByCommission(@PathVariable Long commissionId) {
        List<CommissionProfesseurs> commissionProfesseurs = commissionProfesseursService.findByCommission(
                Commission.builder().id(commissionId).build()
        );
        return ResponseEntity.ok(commissionProfesseurs);
    }

    // Read By Professeur
    @GetMapping("/professeur/{professeurId}")
    public ResponseEntity<List<CommissionProfesseurs>> findByProfesseur(@PathVariable Long professeurId) {
        List<CommissionProfesseurs> commissionProfesseurs = commissionProfesseursService.findByProfesseur(
                Professeur.builder().id(professeurId).build()
        );
        return ResponseEntity.ok(commissionProfesseurs);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<CommissionProfesseurs> update(@PathVariable Long id, @RequestBody CommissionProfesseurs commissionProfesseurs) {
        try {
            CommissionProfesseurs updated = commissionProfesseursService.update(id, commissionProfesseurs);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            commissionProfesseursService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(commissionProfesseursService.count());
    }
}
