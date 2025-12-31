package com.tppartdeux.edoctorat.repository.auth;

import com.tppartdeux.edoctorat.model.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userGroups ug LEFT JOIN FETCH ug.group WHERE u.username = :username")
    User findByUsername(@Param("username") String username);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userGroups ug LEFT JOIN FETCH ug.group WHERE u.email = :email")
    User findByEmail(@Param("email") String email);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
