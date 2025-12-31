package com.tppartdeux.edoctorat.repository.auth;

import com.tppartdeux.edoctorat.model.auth.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    Optional<Group> findByName(String name);
    boolean existsByName(String name);
}
