package com.tppartdeux.edoctorat.service.auth;

import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.repository.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String identifier)
            throws UsernameNotFoundException {

        User user = userRepo.findByUsername(identifier);
        
        // If not found by username, try to find by email
        if (user == null) {
            user = userRepo.findByEmail(identifier);
        }
        
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username/email: " + identifier);
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getUserGroups().stream()
                        .map(userGroup -> "ROLE_" + userGroup.getGroup().getName().toUpperCase())
                        .toArray(String[]::new))
                .build();
    }
}
