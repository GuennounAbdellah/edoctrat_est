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

    // Candidat login - returns JWT tokens
    public Optional<TokenResponse> loginCandidat(String email, String password) {
        System.out.println("!!!!!!!Inside loginCandidat with email: " + email + " and password: " + password);
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

        boolean isCandidat = user.getUserGroups().stream()
            .filter(userGroup -> userGroup.getGroup() != null)
            .map(userGroup -> userGroup.getGroup().getName())
            .anyMatch(name -> "candidat".equalsIgnoreCase(name));

        if (!isCandidat) {
            System.err.println("!!!!!!!User is not part of the candidat group: " + user.getUserGroups());
            return Optional.empty();
        }   
        
        String accessToken = jwtTokenService.generateAccessToken(
                user.getUsername(),
                user.getUserGroups().stream()
                        .filter(userGroup -> userGroup.getGroup() != null)
                        .map(userGroup -> userGroup.getGroup().getName())
                        .toList()
        );
        String refreshToken = jwtTokenService.generateRefreshToken(user.getEmail());
        
        return Optional.of(TokenResponse.builder()
                .access(accessToken)
                .refresh(refreshToken)
                .build());
    }

    public Optional<LoginResponse> loginScolarite(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return Optional.empty();
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Optional.empty();
        }
        
        // Null-safe check for userGroups
        if (user.getUserGroups() == null || user.getUserGroups().isEmpty()) {
            return Optional.empty();
        }
        
        boolean isScolarite = user.getUserGroups().stream()
                .filter(userGroup -> userGroup.getGroup() != null)
                .anyMatch(userGroup -> userGroup.getGroup().getName().equalsIgnoreCase("scolarite"));
        if (!isScolarite) {
            return Optional.empty();
        }
        
        String accessToken = jwtTokenService.generateAccessToken(
                user.getUsername(),
                user.getUserGroups().stream()
                        .filter(userGroup -> userGroup.getGroup() != null)
                        .map(userGroup -> userGroup.getGroup().getName())
                        .toList()
        );
        String refreshToken = jwtTokenService.generateRefreshToken(user.getUsername());
        
        LoginResponse response = new LoginResponse(
            accessToken,
            refreshToken,
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            null,
            user.getUserGroups().stream()
                .filter(userGroup -> userGroup.getGroup() != null)
                .map(userGroup -> userGroup.getGroup().getName())
                .toList(),
            null
        );
        return Optional.of(response);
    }
    
    public Optional<TokenResponse> loginProfesseur(String email, String password) {

        System.out.println("!!!!!!!Inside loginProfesseur with email: " + email + " and password: " + password);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return Optional.empty();
        }
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Optional.empty();
        }
        
        /*boolean isProfesseur = user.getGroups().stream()
                .anyMatch(group -> group.getName().equalsIgnoreCase("professeur"));
        if (!isProfesseur) {
            return Optional.empty();
        }*/
        
        Professeur professeur = professeurRepository.findByUser(user).orElse(null);
        if (professeur == null) {
            return Optional.empty();
            
        }
        
        String accessToken = jwtTokenService.generateAccessToken(
                user.getUsername(),
                user.getUserGroups().stream()
                        .map(userGroup -> userGroup.getGroup().getName())
                        .toList()
        );
        String refreshToken = jwtTokenService.generateRefreshToken(user.getUsername());

        return Optional.of(TokenResponse.builder()
                .access(accessToken)
                .refresh(refreshToken)
                .build());
    }
   
    public Optional<TokenResponse> loginDirecteurCed(String email, String password) {
        System.out.println("!!!!!!!Inside loginDirecteurCed with email: " + email + " and password: " + password);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.err.println("!!!!!!!User not found with email: " + email);
            return Optional.empty();
        }
        
        System.out.println("!!!!!!!User found with id: " + user.getId());
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.err.println("!!!!!!!Invalid password for email: " + email);
            return Optional.empty();
        }
        
        // Null-safe check for userGroups
        if (user.getUserGroups() == null || user.getUserGroups().isEmpty()) {
            System.err.println("!!!!!!!User has no groups assigned: " + email);
            return Optional.empty();
        }
        
        System.out.println("!!!!!!!UserGroups size: " + user.getUserGroups().size());
        for (UserGroups ug : user.getUserGroups()) {
            System.out.println("!!!!!!!UserGroup id: " + ug.getId() + ", group: " + (ug.getGroup() != null ? ug.getGroup().getName() : "null"));
        }
        
        // Check if user is in directeur_ced group
        boolean isDirecteurCed = user.getUserGroups().stream()
                    .filter(userGroup -> userGroup.getGroup() != null)
                    .map(userGroup -> userGroup.getGroup().getName())
                    .anyMatch(name -> "directeur_ced".equalsIgnoreCase(name));
        
        if (!isDirecteurCed) {
            System.err.println("!!!!!!!User is not part of the directeur_ced group");
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
        
        System.out.println("!!!!!!!Login successful for directeur_ced: " + email);
        
        TokenResponse response = new TokenResponse(
                accessToken,
                refreshToken
        );
        return Optional.of(response);
    }

    public Optional<TokenResponse> loginDirecteurPole(String email, String password) {
        System.out.println("!!!!!!!Inside loginDirecteurPole with email: " + email + " and password: " + password);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.err.println("!!!!!!!User not found with email: " + email);
            return Optional.empty();
        }
        
        System.out.println("!!!!!!!User found with id: " + user.getId());
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.err.println("!!!!!!!Invalid password for email: " + email);
            return Optional.empty();
        }
        
        // Null-safe check for userGroups
        if (user.getUserGroups() == null || user.getUserGroups().isEmpty()) {
            System.err.println("!!!!!!!User has no groups assigned: " + email);
            return Optional.empty();
        }
        
        System.out.println("!!!!!!!UserGroups size: " + user.getUserGroups().size());
        for (UserGroups ug : user.getUserGroups()) {
            System.out.println("!!!!!!!UserGroup id: " + ug.getId() + ", group: " + (ug.getGroup() != null ? ug.getGroup().getName() : "null"));
        }
        
        // Check if user is in directeur_pole group
        boolean isDirecteurPole = user.getUserGroups().stream()
                    .filter(userGroup -> userGroup.getGroup() != null)
                    .map(userGroup -> userGroup.getGroup().getName())
                    .anyMatch(name -> "directeur_pole".equalsIgnoreCase(name));
        
        if (!isDirecteurPole) {
            System.err.println("!!!!!!!User is not part of the directeur_pole group");
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
        
        System.out.println("!!!!!!!Login successful for directeur_pole: " + email);
        
        TokenResponse response = new TokenResponse(
                accessToken,
                refreshToken
        );
        return Optional.of(response);
    }

    public Optional<TokenResponse> loginDirecteurLabo(String email, String password) {
        System.out.println("!!!!!!!Inside loginDirecteurLabo with email: " + email + " and password: " + password);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.err.println("!!!!!!!User not found with email: " + email);
            return Optional.empty();
        }
        
        System.out.println("!!!!!!!User found with id: " + user.getId());
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.err.println("!!!!!!!Invalid password for email: " + email);
            return Optional.empty();
        }
        
        // Null-safe check for userGroups
        if (user.getUserGroups() == null || user.getUserGroups().isEmpty()) {
            System.err.println("!!!!!!!User has no groups assigned: " + email);
            return Optional.empty();
        }
        
        System.out.println("!!!!!!!UserGroups size: " + user.getUserGroups().size());
        for (UserGroups ug : user.getUserGroups()) {
            System.out.println("!!!!!!!UserGroup id: " + ug.getId() + ", group: " + (ug.getGroup() != null ? ug.getGroup().getName() : "null"));
        }
        
        // Check if user is in directeur_labo group
        boolean isDirecteurLabo = user.getUserGroups().stream()
                    .filter(userGroup -> userGroup.getGroup() != null)
                    .map(userGroup -> userGroup.getGroup().getName())
                    .anyMatch(name -> "directeur_labo".equalsIgnoreCase(name));
        
        if (!isDirecteurLabo) {
            System.err.println("!!!!!!!User is not part of the directeur_labo group");
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
        
        System.out.println("!!!!!!!Login successful for directeur_labo: " + email);
        
        TokenResponse response = new TokenResponse(
                accessToken,
                refreshToken
        );
        return Optional.of(response);
    }

    // Verify professor via Google token (simplified - in production use Google API)
    public Optional<AuthProfResponse> verifyProfessor(String googleIdToken) {
        // In production, verify the Google ID token with Google's API
        // For now, we'll simulate by looking up by email extracted from token
        // This is a placeholder implementation
        try {
            // Simulated: In real implementation, decode Google token to get email
            String email = extractEmailFromToken(googleIdToken);
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return Optional.empty();
            }
            
            boolean isProfesseur = user.getUserGroups().stream()
                    .anyMatch(userGroup -> userGroup.getGroup().getName().equalsIgnoreCase("professeur"));
            if (!isProfesseur) {
                return Optional.empty();
            }
            
            Professeur professeur = professeurRepository.findByUser(user).orElse(null);
            
            String accessToken = jwtTokenService.generateAccessToken(
                    user.getUsername(), 
                    user.getUserGroups().stream()
                            .map(userGroup -> userGroup.getGroup().getName())
                            .toList()
            );
            String refreshToken = jwtTokenService.generateRefreshToken(user.getUsername());
            
            return Optional.of(AuthProfResponse.builder()
                    .email(user.getEmail())
                    .nom(user.getLastName())
                    .prenom(user.getFirstName())
                    .pathPhoto(professeur != null ? professeur.getPathPhoto() : null)
                    .groups(user.getUserGroups().stream().map(g -> g.getGroup().getName()).toList())
                    .access(accessToken)
                    .refresh(refreshToken)
                    .grade(professeur != null ? professeur.getGrade() : null)
                    .nombreProposer(professeur != null ? professeur.getNombreProposer() : 0)
                    .nombreEncadrer(professeur != null ? professeur.getNombreEncadrer() : 0)
                    .build());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    private String extractEmailFromToken(String token) {
        // Placeholder: In production, decode JWT or verify with Google
        // For testing, you could pass email directly
        return token; // Simplified for development
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
            String username = jwtTokenService.getUsernameFromToken(refreshToken);
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return Optional.empty();
            }
            
            String newAccessToken = jwtTokenService.generateAccessToken(
                    user.getUsername(),
                    user.getUserGroups().stream()
                            .map(userGroup -> userGroup.getGroup().getName())
                            .toList()
            );
            return Optional.of(newAccessToken);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    // Send confirmation email for pre-registration
    public void sendConfirmationEmail(String email, String nom, String prenom, String origin) {
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        // In production, generate token and send email
        // For now, just log the action
        System.out.println("Confirmation email would be sent to: " + email + " with origin: " + origin);
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
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(prenom)
                .lastName(nom)
                .isActive(true)
                .isStaff(false)
                .isSuperuser(false)
                .dateJoined(LocalDateTime.now())
                .build();
        
        userRepository.save(user);
        
        // Assign candidat group to the user
        Group candidatGroup = groupRepository.findByName("candidat")
                .orElseThrow(() -> new RuntimeException("Candidat group not found"));
        UserGroups userGroup = UserGroups.builder()
                .user(user)
                .group(candidatGroup)
                .build();
        userGroupRepository.save(userGroup);
        
        // Additional candidat-specific setup would go here
    }

    // Request password reset
    public void requestPasswordReset(String email, String redirectUrl) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            // Don't reveal if email exists
            return;
        }
        // In production, generate reset token, save it, and send email
        System.out.println("Password reset email would be sent to: " + email);
    }

    // Perform password reset
    public void performPasswordReset(String newPassword, String token) {
        // In production, validate token and update password
        // Placeholder implementation
        throw new RuntimeException("Invalid or expired token");
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

    public void createDirecteurPoleUser(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            System.out.println("Directeur Pole user already exists with email: " + email);
            return;
        }
        
        User user = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName("DirecteurPole")
                .lastName("Test")
                .isActive(true)
                .isStaff(true)
                .isSuperuser(false)
                .dateJoined(LocalDateTime.now())
                .build();
        userRepository.save(user);
        
        // Assign directeur_pole group to the user
        Group directeurPoleGroup = groupRepository.findByName("directeur_pole")
                .orElseGet(() -> {
                    Group newGroup = Group.builder().name("directeur_pole").build();
                    return groupRepository.save(newGroup);
                });
        
        UserGroups userGroup = UserGroups.builder()
                .user(user)
                .group(directeurPoleGroup)
                .build();
        userGroupRepository.save(userGroup);
        
        System.out.println("Directeur Pole user created with email: " + email);
    }

    public void createDirecteurLaboUser(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            System.out.println("Directeur Labo user already exists with email: " + email);
            return;
        }
        
        User user = User.builder()
                .username(email)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName("DirecteurLabo")
                .lastName("Test")
                .isActive(true)
                .isStaff(true)
                .isSuperuser(false)
                .dateJoined(LocalDateTime.now())
                .build();
        userRepository.save(user);
        
        // Assign directeur_labo group to the user
        Group directeurLaboGroup = groupRepository.findByName("directeur_labo")
                .orElseGet(() -> {
                    Group newGroup = Group.builder().name("directeur_labo").build();
                    return groupRepository.save(newGroup);
                });
        
        UserGroups userGroup = UserGroups.builder()
                .user(user)
                .group(directeurLaboGroup)
                .build();
        userGroupRepository.save(userGroup);
        
        System.out.println("Directeur Labo user created with email: " + email);
    }
}