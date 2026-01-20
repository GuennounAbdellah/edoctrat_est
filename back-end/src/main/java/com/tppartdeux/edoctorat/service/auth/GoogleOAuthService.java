package com.tppartdeux.edoctorat.service.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.tppartdeux.edoctorat.dto.auth.AuthProfResponse;
import com.tppartdeux.edoctorat.dto.auth.TokenResponse;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.auth.UserGroups;
import com.tppartdeux.edoctorat.model.auth.Group;
import com.tppartdeux.edoctorat.repository.auth.UserRepository;
import com.tppartdeux.edoctorat.repository.auth.GroupRepository;
import com.tppartdeux.edoctorat.repository.auth.UserGroupRepository;
import com.tppartdeux.edoctorat.security.JwtTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {
    
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final JwtTokenService jwtTokenService;
    
    @Value("${google.client-id}")
    private String clientId;
    
    public Optional<AuthProfResponse> authenticateWithGoogle(String idTokenString) {
        try {
            // Verify the ID token
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(List.of(clientId))
                    .build();
            
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                System.err.println("Invalid Google ID token");
                return Optional.empty();
            }
            
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            
            // Find user by email
            User user = userRepository.findByEmail(email);
            if (user == null) {
                // Auto-create professor account for first-time Google OAuth users
                System.out.println("User not found with email: " + email + ". Creating new professor account via Google OAuth.");
                user = createProfessorUser(email, firstName, lastName);
                if (user == null) {
                    System.err.println("Failed to create professor user for email: " + email);
                    return Optional.empty();
                }
                System.out.println("Successfully created professor account for: " + email);
            }
            
            // Check if user belongs to professor/director groups (not candidat)
            boolean isAuthorized = user.getUserGroups().stream()
                    .anyMatch(userGroup -> userGroup.getGroup() != null && 
                         !"candidat".equalsIgnoreCase(userGroup.getGroup().getName()));
            
            if (!isAuthorized) {
                System.err.println("Google OAuth is restricted to professors and directors. User: " + email + " Groups: " + 
                    user.getUserGroups().stream()
                        .filter(ug -> ug.getGroup() != null)
                        .map(ug -> ug.getGroup().getName())
                        .toList());
                return Optional.empty();
            }
            
            // Generate JWT tokens
            List<String> roles = user.getUserGroups().stream()
                    .filter(userGroup -> userGroup.getGroup() != null)
                    .map(userGroup -> userGroup.getGroup().getName())
                    .toList();
            
            String accessToken = jwtTokenService.generateAccessToken(email, roles);
            String refreshToken = jwtTokenService.generateRefreshToken(email);
            
            // Determine primary role
            String primaryRole = roles.isEmpty() ? "professeur" : roles.get(0);
            
            // Build response
            TokenResponse tokenResponse = TokenResponse.builder()
                    .access(accessToken)
                    .refresh(refreshToken)
                    .role(primaryRole)
                    .groups(roles)
                    .email(email)
                    .build();
            
            AuthProfResponse response = AuthProfResponse.builder()
                    .email(email)
                    .prenom(firstName)
                    .nom(lastName)
                    .access(tokenResponse.getAccess())
                    .refresh(tokenResponse.getRefresh())
                    .role(tokenResponse.getRole())
                    .groups(tokenResponse.getGroups())
                    .build();
            
            return Optional.of(response);
            
        } catch (IOException | GeneralSecurityException e) {
            System.err.println("Error verifying Google ID token: " + e.getMessage());
            return Optional.empty();
        }
    }
    
    /**
     * Creates a new professor user account with Google OAuth data
     * This is called when a professor signs in with Google for the first time
     */
    private User createProfessorUser(String email, String firstName, String lastName) {
        try {
            // Check if user already exists (double-check)
            if (userRepository.existsByEmail(email)) {
                System.err.println("User already exists with email: " + email);
                return userRepository.findByEmail(email);
            }
            
            // Create new user
            User user = User.builder()
                    .username(email)
                    .email(email)
                    .firstName(firstName != null ? firstName : "")
                    .lastName(lastName != null ? lastName : "")
                    .password("{noop}" + generateTemporaryPassword()) // Temporary password
                    .isActive(true)  // Active since they authenticated via Google
                    .isStaff(true)
                    .isSuperuser(false)
                    .dateJoined(java.time.LocalDateTime.now())
                    .build();
            
            userRepository.save(user);
            
            // Assign professeur group - create if it doesn't exist
            Group professeurGroup = groupRepository.findByName("professeur")
                    .orElseGet(() -> {
                        System.out.println("Creating professeur group as it doesn't exist");
                        Group newGroup = Group.builder().name("professeur").build();
                        return groupRepository.save(newGroup);
                    });
            
            UserGroups userGroup = UserGroups.builder()
                    .user(user)
                    .group(professeurGroup)
                    .build();
            userGroupRepository.save(userGroup);
            
            System.out.println("Professor user created successfully - Email: " + email + ", Name: " + firstName + " " + lastName);
            return user;
            
        } catch (Exception e) {
            System.err.println("Error creating professor user: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Generates a temporary password for newly created users
     * In a real application, you might want to:
     * 1. Force password change on first login
     * 2. Or send a password reset email
     */
    private String generateTemporaryPassword() {
        // Generate a random temporary password
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
