package com.tppartdeux.edoctorat.security;

import java.security.Key;
import java.util.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String secrekey;

    @Value("${jwt.expiration.access-token}")
    private long accessTokenExperationTime;
    
    @Value("${jwt.expiration.refresh-token}")
    private long refreshTokenExpirationTime;
    

    private Key key;

    public long getRefreshExperationTime(){
        return refreshTokenExpirationTime;
    }
    public long getAccessExperationTime(){
        return accessTokenExperationTime;
    }
    @PostConstruct
    public void init(){
        this.key= Keys.hmacShaKeyFor(secrekey.getBytes());
    }
    public String generateAccessToken(String username, List<String> roles){
        Date now = new Date();
        return Jwts.builder()
                .setIssuedAt(now)
                .claim("username", username)
                .claim("token_type", "access")
                .claim("roles", roles)
                .signWith((key),SignatureAlgorithm.HS256)
                .setExpiration(new Date(now.getTime()+getAccessExperationTime()))
                .compact();

    }
    public String generateRefreshToken(String username){
        Date now = new Date();
        return Jwts.builder()
                .setIssuedAt(now)
                .claim("username", username)
                .claim("token_type", "refresh")
                .signWith((key),SignatureAlgorithm.HS256)
                .setExpiration(new Date(now.getTime()+getRefreshExperationTime()))
                .compact();

    }
    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("username",String.class);
    }
    
    // Alias for extractUsername to match usage in UserService
    public String getUsernameFromToken(String token) {
        return extractUsername(token);
    }
    
    public boolean validateToken(String token){
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
    public String resolveToken(HttpServletRequest req){
        String bearer = req.getHeader("Authorization");
        if(bearer!=null && bearer.startsWith("Bearer "))
            return bearer.substring(7);

        return null;
    }
}
