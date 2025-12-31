package com.tppartdeux.edoctorat.service.auth;

import com.tppartdeux.edoctorat.model.auth.UserGroups;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.auth.Group;
import com.tppartdeux.edoctorat.repository.auth.UserGroupRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserGroupsService {
    

    @Autowired
    private final UserGroupRepository userGroupRepository;

    //CRUD Functions
    // Create
    public UserGroups create(UserGroups userGroups) {
        return userGroupRepository.save(userGroups);
    }

    // Read
    public List<UserGroups> findAll() {
        return userGroupRepository.findAll();
    }

    public Optional<UserGroups> findById(Long id) {
        return userGroupRepository.findById(id);
    }

    public List<UserGroups> findByUser(User user) {
        return userGroupRepository.findByUser(user);
    }

    public List<UserGroups> findByGroup(Group group) {
        return userGroupRepository.findByGroup(group);
    }

    // Update
    public UserGroups update(Long id, UserGroups userGroupsDetails) {
        UserGroups userGroups = userGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserGroups not found with id: " + id));
        
        userGroups.setUser(userGroupsDetails.getUser());
        userGroups.setGroup(userGroupsDetails.getGroup());
        
        return userGroupRepository.save(userGroups);
    }

    // Delete
    public void delete(Long id) {
        if (!userGroupRepository.existsById(id)) {
            throw new RuntimeException("UserGroups not found with id: " + id);
        }
        userGroupRepository.deleteById(id);
    }


    public void deleteAll() {
        userGroupRepository.deleteAll();
    }

    public long count() {
        return userGroupRepository.count();
    }
}
