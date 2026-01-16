package com.tppartdeux.edoctorat.dto.auth;

import lombok.Data;

@Data
public class TokenRequest {
    private String email;
    private String password;
}
