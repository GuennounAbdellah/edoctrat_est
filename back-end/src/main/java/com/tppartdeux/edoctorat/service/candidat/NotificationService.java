package com.tppartdeux.edoctorat.service.candidat;

import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.candidat.Notification;
import com.tppartdeux.edoctorat.repository.candidat.NotificationRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    @Autowired
    private final NotificationRepository notificationRepository;

    //CRUD Functions
    // Create
    public Notification create(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Read
    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> findByCandidat(Candidat candidat) {
        return notificationRepository.findByCandidat(candidat);
    }

    public List<Notification> findByType(String type) {
        return notificationRepository.findByType(type);
    }

    // Update
    public Notification update(Long id, Notification notificationDetails) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        
        notification.setType(notificationDetails.getType());
        notification.setCandidat(notificationDetails.getCandidat());
        notification.setCommission(notificationDetails.getCommission());
        notification.setSujet(notificationDetails.getSujet());
        
        return notificationRepository.save(notification);
    }

    // Delete
    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
    }

    public void deleteAll() {
        notificationRepository.deleteAll();
    }

    public long count() {
        return notificationRepository.count();
    }
}
