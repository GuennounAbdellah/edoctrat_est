package com.tppartdeux.edoctorat.controller.condidat;

import com.tppartdeux.edoctorat.dto.ResultDTO;
import com.tppartdeux.edoctorat.service.candidat.NotificationService;
import com.tppartdeux.edoctorat.model.candidat.Notification;
import com.tppartdeux.edoctorat.service.candidat.CandidatService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private final NotificationService notificationService;
    @Autowired
    private final CandidatService candidatService;

    @GetMapping("/get-candidat-notifications")
    public ResponseEntity<ResultDTO<Notification>> getCandidatNotifications() {
        List<Notification> notifications = notificationService.findAll();
        return ResponseEntity.ok(ResultDTO.of(notifications));
    }

    //CRUD Functions
    // Create
    @PostMapping("/candidat/notifications")
    public ResponseEntity<Notification> create(@RequestBody Notification notification) {
        Notification created = notificationService.create(notification);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Read All
    @GetMapping("/candidat/notifications")
    public ResponseEntity<List<Notification>> findAll() {
        List<Notification> notifications = notificationService.findAll();
        return ResponseEntity.ok(notifications);
    }

    // Read By ID
    @GetMapping("/candidat/notifications/{id}")
    public ResponseEntity<Notification> findById(@PathVariable Long id) {
        return notificationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Candidat
    @GetMapping("/candidat/notifications/candidat/{candidatId}")
    public ResponseEntity<List<Notification>> findByCandidat(@PathVariable Long candidatId) {
        return candidatService.findById(candidatId)
                .map(candidat -> ResponseEntity.ok(notificationService.findByCandidat(candidat)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Read By Type
    @GetMapping("/candidat/notifications/type/{type}")
    public ResponseEntity<List<Notification>> findByType(@PathVariable String type) {
        List<Notification> notifications = notificationService.findByType(type);
        return ResponseEntity.ok(notifications);
    }

    // Update
    @PutMapping("/candidat/notifications/{id}")
    public ResponseEntity<Notification> update(@PathVariable Long id, @RequestBody Notification notification) {
        try {
            Notification updated = notificationService.update(id, notification);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/candidat/notifications/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            notificationService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete All
    @DeleteMapping("/candidat/notifications")
    public ResponseEntity<Void> deleteAll() {
        notificationService.deleteAll();
        return ResponseEntity.noContent().build();
    }

    // Count
    @GetMapping("/candidat/notifications/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(notificationService.count());
    }
}
