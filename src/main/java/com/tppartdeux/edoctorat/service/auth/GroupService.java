package com.tppartdeux.edoctorat.service.auth;

import com.tppartdeux.edoctorat.model.auth.Group;
import com.tppartdeux.edoctorat.repository.auth.GroupRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupService {
    
    @Autowired
    private final GroupRepository groupRepository;

    //CRUD Functions
    // Create
    public Group create(Group group) {
        return groupRepository.save(group);
    }

    // Read
    public List<Group> findAll() {
        return groupRepository.findAll();
    }

    public Optional<Group> findById(Integer id) {
        return groupRepository.findById(id);
    }

    public Optional<Group> findByName(String name) {
        return groupRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return groupRepository.existsByName(name);
    }

    // Update
    public Group update(Integer id, Group groupDetails) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + id));
        
        group.setName(groupDetails.getName());
        
        return groupRepository.save(group);
    }




    // Delete
    public void delete(Integer id) {
        if (!groupRepository.existsById(id)) {
            throw new RuntimeException("Group not found with id: " + id);
        }
        groupRepository.deleteById(id);
    }

    public void deleteAll() {
        groupRepository.deleteAll();
    }

    public long count() {
        return groupRepository.count();
    }
}
