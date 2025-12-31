package com.tppartdeux.edoctorat.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * User info response DTO matching Angular's UserInfo interface
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoResponse {
    private String nom;
    private String prenom;
    private String email;
    private String pathPhoto;
    private List<String> groups;
    private Object misc;
}
