package com.tppartdeux.edoctorat.controller.professeur;

import com.tppartdeux.edoctorat.model.professeur.Commission;
import com.tppartdeux.edoctorat.model.professeur.Laboratoire;
import com.tppartdeux.edoctorat.service.professeur.CommissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/professeur/commissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommissionController {

    @Autowired
    private final CommissionService commissionService;

    // Create
    @PostMapping
    public ResponseEntity<Commission> create(@RequestBody Commission commission) {
        Commission created = commissionService.create(commission);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping
    public ResponseEntity<List<Commission>> findAll() {
        List<Commission> commissions = commissionService.findAll();
        return ResponseEntity.ok(commissions);
    }

    // Read By ID
    @GetMapping("/{id}")
    public ResponseEntity<Commission> findById(@PathVariable Long id) {
        return commissionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Laboratoire
    @GetMapping("/labo/{laboId}")
    public ResponseEntity<List<Commission>> findByLabo(@PathVariable Long laboId) {
        List<Commission> commissions = commissionService.findByLabo(
                Laboratoire.builder().id(laboId).build()
        );
        return ResponseEntity.ok(commissions);
    }

    // Read By Date Commission
    @GetMapping("/date/{dateCommission}")
    public ResponseEntity<List<Commission>> findByDateCommission(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateCommission) {
        List<Commission> commissions = commissionService.findByDateCommission(dateCommission);
        return ResponseEntity.ok(commissions);
    }

    // Read By Date Range
    @GetMapping("/date-range")
    public ResponseEntity<List<Commission>> findByDateCommissionBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Commission> commissions = commissionService.findByDateCommissionBetween(startDate, endDate);
        return ResponseEntity.ok(commissions);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Commission> update(@PathVariable Long id, @RequestBody Commission commission) {
        try {
            Commission updated = commissionService.update(id, commission);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            commissionService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        commissionService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(commissionService.count());
    }
}
