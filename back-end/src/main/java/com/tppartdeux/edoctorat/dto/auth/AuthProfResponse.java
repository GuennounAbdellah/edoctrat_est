package com.tppartdeux.edoctorat.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Auth response for professor login matching Angular's AuthProf interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthProfResponse {
    private String email;
    private String nom;
    private String prenom;
    private String pathPhoto;
    private List<String> groups;
    private String refresh;
    private String access;
    private String grade;
    private Integer nombreProposer;
    private Integer nombreEncadrer;
}
