package com.tppartdeux.edoctorat.service.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleOAuthService {

    @Value("${google.client-id}")
    private String googleClientId;

    /**
     * Vérifie et décode le token Google ID
     * @param idTokenString Token Google ID reçu du frontend
     * @return GoogleIdToken.Payload contenant les informations de l'utilisateur
     * @throws Exception si le token est invalide
     */
    public GoogleIdToken.Payload verifyGoogleToken(String idTokenString) throws Exception {
        // Créer le vérificateur de token
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), 
                new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

        // Vérifier le token
        GoogleIdToken idToken = verifier.verify(idTokenString);
        
        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            
            // Vérifier que le token n'est pas expiré
            long currentTimeMillis = System.currentTimeMillis();
            long expirationTimeMillis = payload.getExpirationTimeSeconds() * 1000;
            
            if (currentTimeMillis > expirationTimeMillis) {
                throw new Exception("Token has expired");
            }
            
            return payload;
        } else {
            throw new Exception("Invalid ID token");
        }
    }

    /**
     * Extrait l'email du payload Google
     * @param payload GoogleIdToken.Payload
     * @return Email de l'utilisateur
     */
    public String getEmailFromPayload(GoogleIdToken.Payload payload) {
        return payload.getEmail();
    }

    /**
     * Vérifie si l'email est vérifié par Google
     * @param payload GoogleIdToken.Payload
     * @return true si l'email est vérifié
     */
    public boolean isEmailVerified(GoogleIdToken.Payload payload) {
        return payload.getEmailVerified();
    }

    /**
     * Extrait le nom complet de l'utilisateur
     * @param payload GoogleIdToken.Payload
     * @return Nom complet
     */
    public String getNameFromPayload(GoogleIdToken.Payload payload) {
        return (String) payload.get("name");
    }

    /**
     * Extrait le prénom de l'utilisateur
     * @param payload GoogleIdToken.Payload
     * @return Prénom
     */
    public String getGivenNameFromPayload(GoogleIdToken.Payload payload) {
        return (String) payload.get("given_name");
    }

    /**
     * Extrait le nom de famille de l'utilisateur
     * @param payload GoogleIdToken.Payload
     * @return Nom de famille
     */
    public String getFamilyNameFromPayload(GoogleIdToken.Payload payload) {
        return (String) payload.get("family_name");
    }

    /**
     * Extrait l'URL de la photo de profil
     * @param payload GoogleIdToken.Payload
     * @return URL de la photo
     */
    public String getPictureUrlFromPayload(GoogleIdToken.Payload payload) {
        return (String) payload.get("picture");
    }

    /**
     * Extrait le domaine de l'email
     * @param email Email de l'utilisateur
     * @return Domaine de l'email
     */
    public String getEmailDomain(String email) {
        if (email != null && email.contains("@")) {
            return email.substring(email.indexOf("@") + 1);
        }
        return null;
    }

    /**
     * Vérifie si l'email appartient au domaine de l'université
     * @param email Email à vérifier
     * @return true si l'email est du domaine usmba.ac.ma
     */
    public boolean isUniversityEmail(String email) {
        String domain = getEmailDomain(email);
        return domain != null && domain.equalsIgnoreCase("usmba.ac.ma");
    }
}