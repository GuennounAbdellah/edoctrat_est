package com.tppartdeux.edoctorat.controller.auth;

import com.tppartdeux.edoctorat.dto.auth.AuthProfResponse;
import com.tppartdeux.edoctorat.dto.auth.ConfirmEmailRequest;
import com.tppartdeux.edoctorat.dto.auth.LoginRequest;
import com.tppartdeux.edoctorat.dto.auth.LoginResponse;
import com.tppartdeux.edoctorat.dto.auth.PasswordResetRequest;
import com.tppartdeux.edoctorat.dto.auth.PerformPasswordResetRequest;
import com.tppartdeux.edoctorat.dto.auth.PreRegistrationResponse;
import com.tppartdeux.edoctorat.dto.auth.RefreshTokenRequest;
import com.tppartdeux.edoctorat.dto.auth.TokenRequest;
import com.tppartdeux.edoctorat.dto.auth.TokenResponse;
import com.tppartdeux.edoctorat.dto.auth.UserInfoResponse;
import com.tppartdeux.edoctorat.dto.auth.VerifyTokenRequest;
import com.tppartdeux.edoctorat.model.auth.User;
import com.tppartdeux.edoctorat.service.auth.UserService;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final UserService userService;
    @PostMapping("/exempleUsers")
    public ResponseEntity<String> createExampleUsers(@RequestBody LoginRequest request) {
        userService.createExampleUsers(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("Example users created successfully.");
    }

    @PostMapping("/createDirecteurCed")
    public ResponseEntity<String> createDirecteurCedUser(@RequestBody LoginRequest request) {
        userService.createDirecteurCedUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("Directeur CED user created successfully.");
    }
    
    @PostMapping("/createProfesseur")
    public ResponseEntity<String> createProfesseurUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String firstName = request.getOrDefault("firstName", "Professeur");
        String lastName = request.getOrDefault("lastName", "Test");
        
        userService.createProfesseurUser(email, password, firstName, lastName);
        return ResponseEntity.ok("Professeur user created successfully.");
    }
    
    @PostMapping("/createCandidat")
    public ResponseEntity<String> createCandidatUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String firstName = request.getOrDefault("firstName", "Candidat");
        String lastName = request.getOrDefault("lastName", "Test");
        
        userService.createCandidatUser(email, password, firstName, lastName);
        return ResponseEntity.ok("Candidat user created successfully.");
    }

    // POST /api/login - Unified login endpoint for all actors (JWT token generation)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody TokenRequest tokenRequest) {
        System.out.println("!!!!!!!Received unified login request for email: " + tokenRequest.getEmail());
        try {
            Optional<TokenResponse> token = userService.unifiedLogin(
                tokenRequest.getEmail(), 
                tokenRequest.getPassword()
            );
            return token.map(t -> ResponseEntity.ok((Object) t))
                    .orElse(ResponseEntity.status(401).body(
                        Map.of("error", "Invalid credentials")
                    ));
        } catch (RuntimeException e) {
            if ("EMAIL_NOT_VERIFIED".equals(e.getMessage())) {
                return ResponseEntity.status(403).body(Map.of(
                    "error", "EMAIL_NOT_VERIFIED",
                    "message", "Please verify your email before logging in"
                ));
            }
            return ResponseEntity.status(401).body(
                Map.of("error", "Invalid credentials")
            );
        } 
    }
    
    // POST /api/verify-is-prof/ - Professor login via Google token
    @PostMapping("/verify-is-prof/")
    public ResponseEntity<?> verifyIsProfessor(@RequestBody VerifyTokenRequest request) {
        try {
            System.out.println("!!!!!!!Received verify-is-prof request for token: " + request.getToken());
            Optional<AuthProfResponse> authProf = userService.verifyProfessor(request.getToken());
            
            if (authProf.isPresent()) {
                System.out.println("Google OAuth successful for user");
                return ResponseEntity.ok(authProf.get());
            } else {
                System.err.println("Google OAuth failed - user not authorized or not found");
                return ResponseEntity.status(401)
                    .body(Map.of(
                        "error", "UNAUTHORIZED",
                        "message", "Google OAuth échoué - utilisateur non autorisé ou introuvable"
                    ));
            }
        } catch (Exception e) {
            System.err.println("Google OAuth exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401)
                .body(Map.of(
                    "error", "AUTHENTICATION_ERROR",
                    "message", "Erreur d'authentification Google: " + e.getMessage()
                ));
        }
    }

    // GET /api/get-user-info/{role} - Get current user info
    @GetMapping("/get-user-info/{role}")
    public ResponseEntity<UserInfoResponse> getUserInfo(@RequestHeader("Authorization") String authHeader, @PathVariable String role) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Optional<UserInfoResponse> userInfo = userService.getUserInfoFromToken(token, role);
            return userInfo.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    // POST /api/token/refresh/ - Refresh JWT token
    @PostMapping("/token/refresh/")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            Optional<String> newAccessToken = userService.refreshAccessToken(request.getRefresh());
            return newAccessToken.map(token -> ResponseEntity.ok(Map.of("access", token)))
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    // POST /api/verify-token/ - Verify pre-registration token
    @PostMapping("/verify-token/")
    public ResponseEntity<PreRegistrationResponse> verifyToken(@RequestBody VerifyTokenRequest request) {
        try {
            Optional<PreRegistrationResponse> preReg = userService.verifyPreRegistrationToken(request.getToken());
            return preReg.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(400).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).build();
        }
    }

    @PostMapping("/verify-email/")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token is required"));
            }
            
            userService.verifyEmail(token);
            return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/resend-verification/ - Resend verification email
    @PostMapping("/resend-verification/")
    public ResponseEntity<?> resendVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            
            userService.resendVerificationEmail(email);
            return ResponseEntity.ok(Map.of("message", "Verification email sent"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/check-verification-status/{email} - Check if email is verified
    @GetMapping("/check-verification-status/{email}")
    public ResponseEntity<?> checkVerificationStatus(@PathVariable String email) {
        try {
            Optional<UserInfoResponse> userInfo = userService.getUserInfoFromToken("", "candidat");
            
            return ResponseEntity.ok(Map.of(
                "email", email,
                "isVerified", true
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/register/candidat/ - Register new candidat
    @PostMapping("/register/candidat/")
    public ResponseEntity<?> registerCandidat(@RequestBody Map<String, Object> payload) {
        System.out.println("========== REGISTRATION DEBUG ==========");
        System.out.println("Payload received: " + payload);
        System.out.println("Email: " + payload.get("email"));
        System.out.println("Nom: " + payload.get("nom"));
        System.out.println("Prenom: " + payload.get("prenom"));
        System.out.println("=======================================");
        
        try {
            userService.registerCandidat(payload);
            return ResponseEntity.ok(Map.of("message", "Registration successful"));
        } catch (RuntimeException e) {
            System.err.println("ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/test-registration")
    public ResponseEntity<?> testRegistration(@RequestBody Map<String, Object> payload) {
        Map<String, Object> diagnostics = new HashMap<>();
        
        try {
            diagnostics.put("payload_received", payload);
            diagnostics.put("email", payload.get("email"));
            diagnostics.put("password_length", payload.get("password") != null ? 
                ((String)payload.get("password")).length() : 0);
            diagnostics.put("nom", payload.get("nom"));
            diagnostics.put("prenom", payload.get("prenom"));
            
            // Test email exists
            String email = (String) payload.get("email");
            boolean exists = userService.existsByEmail(email);
            diagnostics.put("email_already_exists", exists);
            
            return ResponseEntity.ok(diagnostics);
        } catch (Exception e) {
            diagnostics.put("error", e.getMessage());
            diagnostics.put("stack_trace", e.getStackTrace()[0].toString());
            return ResponseEntity.ok(diagnostics);
        }
    }

    // POST /api/request-password-reset/ - Request password reset
    @PostMapping("/request-password-reset/")
    public ResponseEntity<?> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        try {
            userService.requestPasswordReset(request.getEmail(), request.getRedirectUrl());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.ok().build(); // Return OK even on error to prevent email enumeration
        }
    }

    // PATCH /api/perform-password-reset/ - Perform password reset
    @PatchMapping("/perform-password-reset/")
    public ResponseEntity<?> performPasswordReset(@RequestBody PerformPasswordResetRequest request) {
        try {
            userService.performPasswordReset(request.getPassword(), request.getToken());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // GET /api/debug-user/{email} - Debug endpoint to check user roles
    @GetMapping("/debug-user/{email}")
    public ResponseEntity<?> debugUser(@PathVariable String email) {
        try {
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("email", user.getEmail());
                response.put("id", user.getId());
                response.put("isActive", user.getIsActive());
                
                List<String> groups = user.getUserGroups().stream()
                    .filter(ug -> ug.getGroup() != null)
                    .map(ug -> ug.getGroup().getName())
                    .collect(Collectors.toList());
                response.put("groups", groups);
                
                // Check if user can use Google OAuth
                boolean canUseGoogleOAuth = groups.stream()
                    .anyMatch(group -> !"candidat".equalsIgnoreCase(group));
                response.put("canUseGoogleOAuth", canUseGoogleOAuth);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}