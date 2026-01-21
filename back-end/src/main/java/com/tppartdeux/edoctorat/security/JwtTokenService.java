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
import io.jsonwebtoken.Claims;

@Service
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String secrekey;

    @Value("${jwt.expiration.access-token}")
    private long accessTokenExperationTime;
    
    @Value("${jwt.expiration.refresh-token}")
    private long refreshTokenExpirationTime;
    
    private Key key;

    // Constants for email verification and password reset
    private static final long EMAIL_VERIFICATION_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours
    private static final long PASSWORD_RESET_EXPIRATION = 60 * 60 * 1000; // 1 hour

    public long getRefreshExperationTime(){
        return refreshTokenExpirationTime;
    }
    
    public long getAccessExperationTime(){
        return accessTokenExperationTime;
    }
    
    @PostConstruct
    public void init(){
        // Ensure the key is at least 256 bits for HS256
        byte[] keyBytes = secrekey.getBytes();
        if (keyBytes.length < 32) { // 32 bytes = 256 bits
            // Pad the key if it's too short
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            for (int i = keyBytes.length; i < 32; i++) {
                paddedKey[i] = 0; // pad with zeros
            }
            this.key = Keys.hmacShaKeyFor(paddedKey);
        } else {
            this.key = Keys.hmacShaKeyFor(keyBytes);
        }
    }

    /**
     * Generate access token for authentication
     */
    public String generateAccessToken(String username, List<String> roles){
        Date now = new Date();
        return Jwts.builder()
                .setIssuedAt(now)
                .claim("username", username)
                .claim("roles", roles)
                .claim("token_type", "access")
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(new Date(now.getTime() + getAccessExperationTime()))
                .compact();
    }
    
    /**
     * Generate refresh token
     */
    public String generateRefreshToken(String username){
        Date now = new Date();
        return Jwts.builder()
                .setIssuedAt(now)
                .claim("username", username)
                .claim("token_type", "refresh")
                .signWith(key, SignatureAlgorithm.HS256)
                .setExpiration(new Date(now.getTime() + getRefreshExperationTime()))
                .compact();
    }
    
    /**
     * Generate email verification token (valid for 24 hours)
     */
    public String generateEmailVerificationToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "email_verification");
        claims.put("email", email);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EMAIL_VERIFICATION_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Generate password reset token (valid for 1 hour)
     */
    public String generatePasswordResetToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "password_reset");
        claims.put("email", email);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + PASSWORD_RESET_EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
    
    /**
     * Extract email from email verification token
     */
    public String getEmailFromVerificationToken(String token) {
        Claims claims = extractAllClaims(token);
        String tokenType = (String) claims.get("type");
        
        if (!"email_verification".equals(tokenType)) {
            throw new RuntimeException("Invalid token type");
        }
        
        return claims.getSubject();
    }
    
    /**
     * Extract email from password reset token
     */
    public String getEmailFromPasswordResetToken(String token) {
        Claims claims = extractAllClaims(token);
        String tokenType = (String) claims.get("type");
        
        if (!"password_reset".equals(tokenType)) {
            throw new RuntimeException("Invalid token type");
        }
        
        return claims.getSubject();
    }
    
    /**
     * Extract username from token
     */
    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("username", String.class);
    }
    
    /**
     * Alias for extractUsername to match usage in UserService
     */
    public String getUsernameFromToken(String token) {
        return extractUsername(token);
    }
    
    /**
     * Validate token (checks expiration and signature)
     */
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Extract all claims from token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Check if token is expired
     */
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
    
    /**
     * Resolve token from HTTP request
     */
    public String resolveToken(HttpServletRequest req){
        String bearer = req.getHeader("Authorization");
        if(bearer != null && bearer.startsWith("Bearer "))
            return bearer.substring(7);
        return null;
    }
}