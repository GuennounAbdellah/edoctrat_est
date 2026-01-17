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
import com.tppartdeux.edoctorat.service.auth.UserService;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.Optional;
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

    // POST /api/token/ - Candidat login (JWT token generation)
    @PostMapping("/token/")
    public ResponseEntity<?> loginCandidat(@RequestBody TokenRequest tokenRequest) {
        System.out.println("!!!!!!!Received login request for email: " + tokenRequest.getEmail());
        try {
            Optional<TokenResponse> token = userService.loginCandidat(
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

        // POST /api/login_scolarite - Scolarite login
    @PostMapping("/login_scolarite")
    public ResponseEntity<LoginResponse> loginScolarite(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<LoginResponse> token = userService.loginScolarite(loginRequest.getUsername(), loginRequest.getPassword());
            return token.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
    // POST /api/login_professeur - Professor login
    @PostMapping("/login_professeur")
    public ResponseEntity<TokenResponse> loginProfesseur(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("!!!!!!!Received login request for email: " + loginRequest.getEmail()+", password: " + loginRequest.getPassword());
            Optional<TokenResponse> token = userService.loginProfesseur(loginRequest.getEmail(), loginRequest.getPassword());
            return token.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
    @PostMapping("/login_directeur_ced")
    public ResponseEntity<TokenResponse> loginDirecteurCed(@RequestBody LoginRequest entity) {
        try {
            Optional<TokenResponse> response = userService.loginDirecteurCed(entity.getEmail(), entity.getPassword());
            return response.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
        
    }

    @PostMapping("/login_directeur_pole")
    public ResponseEntity<TokenResponse> loginDirecteurPole(@RequestBody LoginRequest entity) {
        try {
            Optional<TokenResponse> response = userService.loginDirecteurPole(entity.getEmail(), entity.getPassword());
            return response.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/login_directeur_labo")
    public ResponseEntity<TokenResponse> loginDirecteurLabo(@RequestBody LoginRequest entity) {
        try {
            Optional<TokenResponse> response = userService.loginDirecteurLabo(entity.getEmail(), entity.getPassword());
            return response.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
    
    // POST /api/verify-is-prof/ - Professor login via Google token
    @PostMapping("/verify-is-prof/")
    public ResponseEntity<AuthProfResponse> verifyIsProfessor(@RequestBody VerifyTokenRequest request) {
        try {
            Optional<AuthProfResponse> authProf = userService.verifyProfessor(request.getToken());
            return authProf.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
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
        try {
            userService.registerCandidat(payload);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
}