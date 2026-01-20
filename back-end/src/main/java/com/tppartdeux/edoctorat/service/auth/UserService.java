package com.tppartdeux.edoctorat.service.auth;

import com.tppartdeux.edoctorat.dto.auth.*;
import com.tppartdeux.edoctorat.model.auth.Group;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.model.auth.UserGroups;
import com.tppartdeux.edoctorat.model.candidat.Candidat;
import com.tppartdeux.edoctorat.model.professeur.Ced;
import com.tppartdeux.edoctorat.model.professeur.Professeur;
import com.tppartdeux.edoctorat.repository.auth.GroupRepository;
import com.tppartdeux.edoctorat.repository.auth.UserGroupRepository;
import com.tppartdeux.edoctorat.repository.auth.UserRepository;
import com.tppartdeux.edoctorat.repository.candidat.CandidatRepository;
import com.tppartdeux.edoctorat.repository.professeur.CedRepository;
import com.tppartdeux.edoctorat.repository.professeur.ProfesseurRepository;
import com.tppartdeux.edoctorat.security.JwtTokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    CedRepository cedRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenService jwtTokenService;
    @Autowired
    private CandidatRepository candidatRepository;
    @Autowired
    private ProfesseurRepository professeurRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    
    @Autowired
    private GoogleOAuthService googleOAuthService;

    /**
     * Vérifie et authentifie un professeur/directeur via Google OAuth
     * Seuls les professeurs, directeurs CED, directeurs labo et directeurs pole peuvent utiliser OAuth
     * Les candidats DOIVENT utiliser email/password
     */
    public Optional<AuthProfResponse> verifyProfessor(String googleIdToken) {
        try {
            System.out.println("!!!!!!!Verifying Google OAuth token");
            
            // Vérifier et décoder le token Google
            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = 
                googleOAuthService.verifyGoogleToken(googleIdToken);
            
            // Extraire l'email du token
            String email = googleOAuthService.getEmailFromPayload(payload);
            System.out.println("!!!!!!!Email from Google token: " + email);
            
            // Vérifier que l'email est vérifié par Google
            if (!googleOAuthService.isEmailVerified(payload)) {
                System.err.println("!!!!!!!Email not verified by Google: " + email);
                throw new RuntimeException("Email not verified by Google");
            }
            
            // SÉCURITÉ: Vérifier que l'utilisateur n'est PAS un candidat
            // Les candidats ne peuvent PAS utiliser OAuth Google
            User user = userRepository.findByEmail(email);
            if (user == null) {
                System.err.println("!!!!!!!User not found with email: " + email);
                return Optional.empty();
            }
            
            // Vérifier les groupes de l'utilisateur
            boolean isCandidat = user.getUserGroups().stream()
                    .anyMatch(userGroup -> userGroup.getGroup().getName().equalsIgnoreCase("candidat"));
            
            if (isCandidat) {
                System.err.println("!!!!!!!SECURITY: Candidat attempted OAuth login - BLOCKED: " + email);
                throw new RuntimeException("Candidats cannot use Google OAuth. Please use email/password login.");
            }
            
            // Vérifier que l'utilisateur est un professeur ou directeur
            boolean isProfesseurOrDirecteur = user.getUserGroups().stream()
                    .anyMatch(userGroup -> {
                        String groupName = userGroup.getGroup().getName().toLowerCase();
                        return groupName.equals("professeur") || 
                            groupName.equals("directeur_ced") ||
                            groupName.equals("directeur_labo") ||
                            groupName.equals("directeur_pole");
                    });
            
            if (!isProfesseurOrDirecteur) {
                System.err.println("!!!!!!!User is not a professor or director: " + email);
                return Optional.empty();
            }
            
            // Récupérer les informations du professeur
            Professeur professeur = professeurRepository.findByUser(user).orElse(null);
            
            // Générer les tokens JWT
            String accessToken = jwtTokenService.generateAccessToken(
                    user.getEmail(), 
                    user.getUserGroups().stream()
                            .map(userGroup -> userGroup.getGroup().getName())
                            .toList()
            );
            String refreshToken = jwtTokenService.generateRefreshToken(user.getEmail());
            
            // Préparer la liste des groupes
            java.util.List<String> userGroups = user.getUserGroups().stream()
                    .map(g -> g.getGroup().getName())
                    .toList();
            
            // Déterminer le rôle principal
            String primaryRole = userGroups.isEmpty() ? "professeur" : userGroups.get(0);
            
            System.out.println("!!!!!!!Google OAuth login successful for: " + email + ", role: " + primaryRole);
            
            // Construire la réponse
            return Optional.of(AuthProfResponse.builder()
                .email(user.getEmail())
                .nom(user.getLastName())
                .prenom(user.getFirstName())
                .pathPhoto(professeur != null ? professeur.getPathPhoto() : null)
                .groups(userGroups)
                .role(primaryRole)
                .access(accessToken)
                .refresh(refreshToken)
                .grade(professeur != null ? professeur.getGrade() : null)
                .nombreProposer(professeur != null ? professeur.getNombreProposer() : 0)
                .nombreEncadrer(professeur != null ? professeur.getNombreEncadrer() : 0)
                .build());
                
        } catch (Exception e) {
            System.err.println("!!!!!!!Google OAuth verification failed: " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }

    // Unified login for all actor types
    public Optional<TokenResponse> unifiedLogin(String email, String password) {
        System.out.println("!!!!!!!Inside unifiedLogin with email: " + email + " and password: " + password);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.err.println("!!!!!!!User not found with email: " + email);
            return Optional.empty();
        }
            
        System.out.println("!!!!!!!User found with id: " + user.getId());
        System.out.println("!!!!!!!UserGroups size: " + (user.getUserGroups() != null ? user.getUserGroups().size() : "null"));
        if (user.getUserGroups() != null) {
            for (UserGroups ug : user.getUserGroups()) {
                System.out.println("!!!!!!!UserGroup id: " + ug.getId() + ", group: " + (ug.getGroup() != null ? ug.getGroup().getName() : "null"));
            }
        }
            
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.err.println("!!!!!!!Invalid password for email: " + email);
            return Optional.empty();
        }
            
        // Null-safe check for userGroups
        if (user.getUserGroups() == null || user.getUserGroups().isEmpty()) {
            System.err.println("!!!!!!!User has no groups assigned: " + email);
            return Optional.empty();
        }
            
        String accessToken = jwtTokenService.generateAccessToken(
                user.getEmail(),
                user.getUserGroups().stream()
                        .filter(userGroup -> userGroup.getGroup() != null)
                        .map(userGroup -> userGroup.getGroup().getName())
                        .toList()
        );
        String refreshToken = jwtTokenService.generateRefreshToken(user.getEmail());
            
        // Get user groups for role information
        java.util.List<String> userGroups = user.getUserGroups().stream()
                .filter(userGroup -> userGroup.getGroup() != null)
                .map(userGroup -> userGroup.getGroup().getName())
                .toList();
            
        // Determine primary role (first group or default to candidat)
        String primaryRole = userGroups.isEmpty() ? "candidat" : userGroups.get(0);
            
        System.out.println("!!!!!!!Unified login successful for user: " + email + ", roles: " + userGroups);
            
        TokenResponse response = TokenResponse.builder()
                .access(accessToken)
                .refresh(refreshToken)
                .role(primaryRole)
                .groups(userGroups)
                .email(user.getEmail())
                .build();
        return Optional.of(response);
    }


    // Get user info from JWT token
    public Optional<UserInfoResponse> getUserInfoFromToken(String accessToken, String role) {
        try {
            String identifier = jwtTokenService.getUsernameFromToken(accessToken);
            System.out.println("!!!!!!!getUserInfoFromToken - identifier from token: " + identifier + ", role: " + role);
            
            // Try to find user by username first, then by email
            User user = userRepository.findByUsername(identifier);
            if (user == null) {
                user = userRepository.findByEmail(identifier);
            }
            
            if (user == null) {
                System.err.println("!!!!!!!getUserInfoFromToken - User not found for identifier: " + identifier);
                return Optional.empty();
            }
            
            System.out.println("!!!!!!!getUserInfoFromToken - User found: " + user.getEmail());
            
            switch (role.toLowerCase()) {
                case "candidat":
                    Candidat candidat = candidatRepository.findByUser(user).orElse(null);
                    if (candidat != null) { 
                        return Optional.of(UserInfoResponse.builder()
                            .nom(user.getLastName())
                            .prenom(user.getFirstName())
                            .email(user.getEmail())
                            .pathPhoto(candidat.getPathPhoto())
                            .groups(user.getUserGroups().stream()
                                    .filter(ug -> ug.getGroup() != null)
                                    .map(userGroup -> userGroup.getGroup().getName())
                                    .toList())
                            .misc(null)
                            .build());
                    }
                    // If no candidat entity, still return basic user info
                    return Optional.of(UserInfoResponse.builder()
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .pathPhoto(null)
                        .groups(user.getUserGroups().stream()
                                .filter(ug -> ug.getGroup() != null)
                                .map(userGroup -> userGroup.getGroup().getName())
                                .toList())
                        .misc(null)
                        .build());
                        
                case "ced":
                case "directeur_ced":
                    // For CED, try to find associated Ced entity via Professeur
                    Professeur profForCed = professeurRepository.findByUser(user).orElse(null);
                    String cedPathPhoto = null;
                    if (profForCed != null) {
                        List<Ced> ceds = cedRepository.findByDirecteur(profForCed);
                        if (ceds != null && !ceds.isEmpty()) {
                            cedPathPhoto = ceds.get(0).getPathImage();
                        }
                    }
                    return Optional.of(UserInfoResponse.builder()
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .pathPhoto(cedPathPhoto)
                        .groups(user.getUserGroups().stream()
                                .filter(ug -> ug.getGroup() != null)
                                .map(userGroup -> userGroup.getGroup().getName())
                                .toList())
                        .misc(null)
                        .build());
                        
                case "directeur_pole":
                    // For directeur_pole, return user info similar to directeur_ced
                    Professeur profForPole = professeurRepository.findByUser(user).orElse(null);
                    return Optional.of(UserInfoResponse.builder()
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .pathPhoto(profForPole != null ? profForPole.getPathPhoto() : null)
                        .groups(user.getUserGroups().stream()
                                .filter(ug -> ug.getGroup() != null)
                                .map(userGroup -> userGroup.getGroup().getName())
                                .toList())
                        .misc(null)
                        .build());

                case "directeur_labo":
                    // For directeur_labo, return user info similar to other directors
                    Professeur profForLabo = professeurRepository.findByUser(user).orElse(null);
                    return Optional.of(UserInfoResponse.builder()
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .pathPhoto(profForLabo != null ? profForLabo.getPathPhoto() : null)
                        .groups(user.getUserGroups().stream()
                                .filter(ug -> ug.getGroup() != null)
                                .map(userGroup -> userGroup.getGroup().getName())
                                .toList())
                        .misc(null)
                        .build());
                        
                case "professeur":
                    Professeur professeur = professeurRepository.findByUser(user).orElse(null);
                    return Optional.of(UserInfoResponse.builder()
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .pathPhoto(professeur != null ? professeur.getPathPhoto() : null)
                        .groups(user.getUserGroups().stream()
                                .filter(ug -> ug.getGroup() != null)
                                .map(userGroup -> userGroup.getGroup().getName())
                                .toList())
                        .misc(null)
                        .build());
                        
                default:
                    // Return basic user info for any other role
                    return Optional.of(UserInfoResponse.builder()
                        .nom(user.getLastName())
                        .prenom(user.getFirstName())
                        .email(user.getEmail())
                        .pathPhoto(null)
                        .groups(user.getUserGroups().stream()
                                .filter(ug -> ug.getGroup() != null)
                                .map(userGroup -> userGroup.getGroup().getName())
                                .toList())
                        .misc(null)
                        .build());
            }
        } catch (Exception e) {
            System.err.println("!!!!!!!getUserInfoFromToken - Exception: " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }

    // Refresh access token
    public Optional<String> refreshAccessToken(String refreshToken) {
        try {
            if (!jwtTokenService.validateToken(refreshToken)) {
                return Optional.empty();
            }
            String identifier = jwtTokenService.getUsernameFromToken(refreshToken);
            
            // Try to find user by username first, then by email
            User user = userRepository.findByUsername(identifier);
            if (user == null) {
                user = userRepository.findByEmail(identifier);
            }
            
            if (user == null) {
                return Optional.empty();
            }
            
            String newAccessToken = jwtTokenService.generateAccessToken(
                    user.getEmail(), // Use email as identifier
                    user.getUserGroups().stream()
                            .map(userGroup -> userGroup.getGroup().getName())
                            .toList()
            );
            return Optional.of(newAccessToken);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Verify pre-registration token
    public Optional<PreRegistrationResponse> verifyPreRegistrationToken(String token) {
        // In production, validate the token from database/cache
        // Placeholder implementation
        try {
            // Simulated token validation
            return Optional.of(PreRegistrationResponse.builder()
            .nom("Test")
            .prenom("User")
            .email("test@example.com")
            .build());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    // Register new candidat
    public void registerCandidat(Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");
        String nom = (String) payload.get("nom");
        String prenom = (String) payload.get("prenom");
        
        System.out.println("!!!!!!!registerCandidat - Starting registration for email: " + email);
        
        // Check if email already exists using the explicit COUNT query
        if (userRepository.existsByEmail(email)) {
            System.err.println("!!!!!!!registerCandidat - User already exists with email: " + email);
            throw new RuntimeException("Email already registered");
        }
        
        System.out.println("!!!!!!!registerCandidat - Email is available, proceeding with registration");
        
        // Create user but set as inactive until email is verified
        User user = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(prenom)
                .lastName(nom)
                .isActive(false)  // Inactive until email verified
                .isStaff(false)
                .isSuperuser(false)
                .dateJoined(LocalDateTime.now())
                .build();
        
        userRepository.save(user);
        
        // Assign candidat group - create if it doesn't exist
        Group candidatGroup = groupRepository.findByName("candidat")
                .orElseGet(() -> {
                    System.out.println("!!!!!!!registerCandidat - Creating candidat group as it doesn't exist");
                    Group newGroup = Group.builder().name("candidat").build();
                    return groupRepository.save(newGroup);
                });
        UserGroups userGroup = UserGroups.builder()
                .user(user)
                .group(candidatGroup)
                .build();
        userGroupRepository.save(userGroup);
        
        // Generate verification token (JWT with 24h expiry)
        String verificationToken = jwtTokenService.generateEmailVerificationToken(email);
        
        // Send verification email
        try {
            String fullName = prenom + " " + nom;
            emailSenderService.sendEmailVerification(email, fullName, verificationToken);
            System.out.println("✅ Verification email sent to: " + email);
        } catch (Exception e) {
            System.err.println("⚠️ Failed to send verification email to: " + email);
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
            // Don't delete the user - they can request a new verification email
            // The user is created but inactive, they can use resend-verification endpoint
            System.err.println("⚠️ User created but email verification failed. User ID: " + user.getId());
            System.err.println("⚠️ User can use /api/resend-verification/ endpoint to receive the email");
            // Throw exception to inform the caller, but user remains in database
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    // Verify email using JWT token
    public void verifyEmail(String token) {
        try {
            // Validate token
            if (!jwtTokenService.validateToken(token)) {
                throw new RuntimeException("Invalid or expired verification token");
            }
            
            // Extract email from token
            String email = jwtTokenService.getEmailFromVerificationToken(token);
            
            // Find user
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            // Check if already verified
            if (user.getIsActive()) {
                throw new RuntimeException("Email already verified");
            }
            
            // Activate user account
            user.setIsActive(true);
            userRepository.save(user);
            
            // Send welcome email
            try {
                String fullName = user.getFirstName() + " " + user.getLastName();
                emailSenderService.sendWelcomeEmail(user.getEmail(), fullName);
            } catch (Exception e) {
                System.err.println("Failed to send welcome email to: " + user.getEmail());
                e.printStackTrace();
                // Don't throw error - verification was successful
            }
            
            System.out.println("Email verified successfully for: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Email verification failed: " + e.getMessage());
            throw new RuntimeException("Email verification failed: " + e.getMessage());
        }
    }

    // Resend verification email
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        if (user.getIsActive()) {
            throw new RuntimeException("Email already verified");
        }
        
        // Generate new verification token
        String verificationToken = jwtTokenService.generateEmailVerificationToken(email);
        
        // Send verification email
        try {
            String fullName = user.getFirstName() + " " + user.getLastName();
            emailSenderService.sendEmailVerification(email, fullName, verificationToken);
            System.out.println("Verification email resent to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to resend verification email to: " + email);
            e.printStackTrace();
            throw new RuntimeException("Failed to send verification email");
        }
    }

    // Update password reset to use JWT tokens
    public void requestPasswordReset(String email, String redirectUrl) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Don't reveal if email exists for security
            return;
        }
        
        // Generate password reset token (JWT with 1h expiry)
        String resetToken = jwtTokenService.generatePasswordResetToken(email);
        
        // Send reset email
        try {
            emailSenderService.sendPasswordResetEmail(email, resetToken);
            System.out.println("Password reset email sent to: " + email);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to: " + email);
            e.printStackTrace();
        }
    }

    // Perform password reset
    public void performPasswordReset(String newPassword, String token) {
        try {
            // Validate token
            if (!jwtTokenService.validateToken(token)) {
                throw new RuntimeException("Invalid or expired reset token");
            }
            
            // Extract email from token
            String email = jwtTokenService.getEmailFromPasswordResetToken(token);
            
            // Find user
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            // Update password
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            System.out.println("Password reset successfully for: " + email);
        } catch (Exception e) {
            System.err.println("Password reset failed: " + e.getMessage());
            throw new RuntimeException("Password reset failed: " + e.getMessage());
        }
    }

    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        try{
            User user = userRepository.findByUsername(username);
            return Optional.of(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();

    }

/*
    //CRUD Functions
    // Create
    public User create(User user) {
        return userRepository.save(user);
    }

    // Read
    public List<User> findAll() {
        return userRepository.findAll();
    }


    public Optional<User> findByEmail(String email) {
        try {
            return Optional.of(userRepository.findByEmail(email));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Update
    public User update(Integer id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setIsActive(userDetails.getIsActive());
        user.setIsStaff(userDetails.getIsStaff());
        user.setIsSuperuser(userDetails.getIsSuperuser());
        user.setLastLogin(userDetails.getLastLogin());
        
        return userRepository.save(user);
    }

    // Delete
    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public void deleteAll() {
        userRepository.deleteAll();
    }

    public long count() {
        return userRepository.count();
    }


    
    
    */
    public void createExampleUsers(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            System.out.println("Example user already exists with email: " + email);
            return;
        }
        User user = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName("NameExample")
                .lastName("LastNameExample")
                .isActive(true)
                .isStaff(true)
                .isSuperuser(false)
                .dateJoined(LocalDateTime.now())
                .build();
        userRepository.save(user);
        System.out.println("Example user created with email: " + email);
    }

    public void createDirecteurCedUser(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            System.out.println("Directeur CED user already exists with email: " + email);
            return;
        }
        
        User user = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName("DirecteurCED")
                .lastName("Test")
                .isActive(true)
                .isStaff(true)
                .isSuperuser(false)
                .dateJoined(LocalDateTime.now())
                .build();
        userRepository.save(user);
        
        // Assign directeur_ced group to the user
        Group directeurCedGroup = groupRepository.findByName("directeur_ced")
                .orElseGet(() -> {
                    Group newGroup = Group.builder().name("directeur_ced").build();
                    return groupRepository.save(newGroup);
                });
        
        UserGroups userGroup = UserGroups.builder()
                .user(user)
                .group(directeurCedGroup)
                .build();
        userGroupRepository.save(userGroup);
        
        System.out.println("Directeur CED user created with email: " + email);
    }
}