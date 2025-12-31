package com.tppartdeux.edoctorat.dto.auth;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    // 🔐 Tokens
    private String access;
    private String refresh;

    // 👤 User info
    private String nom;
    private String prenom;
    private String email;
    private String pathPhoto;

        // 🧑‍🤝‍🧑 Roles / groups
        private List<String> groups;

        // 🔧 Optional metadata
        private Map<String, Object> misc;
}
