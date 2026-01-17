package com.tppartdeux.edoctorat.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Service
@RequiredArgsConstructor
public class EmailSenderService {

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${sender.email:edoctorat.est@usmba.ac.ma}")
    private String senderEmail;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Value("${spring.mail.properties.mail.smtp.auth:true}")
    private boolean smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}")
    private boolean starttlsEnable;

    @Value("${app.frontend.url:http://localhost:8080}")
    private String frontendUrl;

    /**
     * Sends email verification link to newly registered candidate
     */
    public void sendEmailVerification(String toEmail, String candidatName, String verificationToken) {
        String subject = "Confirmez votre inscription - E-Doctorat";
        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
        String body = buildVerificationEmailBody(candidatName, verificationLink);
        sendEmail(toEmail, subject, body);
    }

    /**
     * Sends welcome email after email verification
     */
    public void sendWelcomeEmail(String toEmail, String candidatName) {
        String subject = "Bienvenue sur E-Doctorat";
        String body = buildWelcomeEmailBody(candidatName);
        sendEmail(toEmail, subject, body);
    }

    /**
     * Sends password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String subject = "Réinitialisation de votre mot de passe - E-Doctorat";
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        String body = buildPasswordResetEmailBody(resetLink);
        sendEmail(toEmail, subject, body);
    }

    /**
     * Sends a generic email
     */
    public void sendEmail(String toEmail, String subject, String body) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", mailHost);
            props.put("mail.smtp.port", mailPort);
            props.put("mail.smtp.auth", smtpAuth);
            props.put("mail.smtp.starttls.enable", starttlsEnable);
            props.put("mail.smtp.starttls.required", "true");
            props.put("mail.smtp.ssl.trust", mailHost);
            // For Java 11+ compatibility with Gmail
            props.put("mail.smtp.ssl.protocols", "TLSv1.2");
            // Additional properties for better compatibility
            props.put("mail.smtp.connectiontimeout", "5000");
            props.put("mail.smtp.timeout", "5000");
            props.put("mail.smtp.writetimeout", "5000");

            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(mailUsername, mailPassword);
                }
            });

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);
            message.setContent(body, "text/html; charset=utf-8");

            Transport.send(message);
            System.out.println("Email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send email to: " + toEmail);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the HTML body for email verification
     */
    private String buildVerificationEmailBody(String candidatName, String verificationLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 20px auto; background-color: white; }
                    .header { background-color: #4CAF50; color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 15px 30px; background-color: #4CAF50; 
                             color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; 
                             font-weight: bold; }
                    .button:hover { background-color: #45a049; }
                    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Confirmez votre inscription</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour %s,</h2>
                        <p>Merci de vous être inscrit sur la plateforme E-Doctorat !</p>
                        <p>Pour activer votre compte et compléter votre inscription, veuillez cliquer sur le bouton ci-dessous :</p>
                        <p style="text-align: center;">
                            <a href="%s" class="button">Confirmer mon email</a>
                        </p>
                        <div class="warning">
                            <strong>⚠️ Important :</strong> Ce lien est valide pendant 24 heures.
                        </div>
                        <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                        <p style="word-break: break-all; color: #4CAF50;">%s</p>
                        <p>Si vous n'avez pas créé de compte sur E-Doctorat, ignorez simplement cet email.</p>
                        <p>Cordialement,<br>L'équipe E-Doctorat</p>
                    </div>
                    <div class="footer">
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        <p>&copy; 2024 E-Doctorat - Tous droits réservés</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(candidatName, verificationLink, verificationLink);
    }

    /**
     * Builds the HTML body for welcome email after verification
     */
    private String buildWelcomeEmailBody(String candidatName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 20px auto; background-color: white; }
                    .header { background-color: #4CAF50; color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 15px 30px; background-color: #4CAF50; 
                             color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; 
                             font-weight: bold; }
                    .features { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .features ul { margin: 10px 0; padding-left: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Email vérifié avec succès !</h1>
                    </div>
                    <div class="content">
                        <h2>Félicitations %s,</h2>
                        <p>Votre compte E-Doctorat est maintenant activé !</p>
                        <div class="features">
                            <h3>Vous pouvez désormais :</h3>
                            <ul>
                                <li>Accéder à votre espace candidat</li>
                                <li>Gérer vos candidatures</li>
                                <li>Consulter les offres de doctorat</li>
                                <li>Suivre l'état de vos dossiers</li>
                            </ul>
                        </div>
                        <p style="text-align: center;">
                            <a href="%s/login" class="button">Se connecter</a>
                        </p>
                        <p>Pour toute question ou assistance, n'hésitez pas à nous contacter.</p>
                        <p>Bonne chance dans vos démarches !</p>
                        <p>Cordialement,<br>L'équipe E-Doctorat</p>
                    </div>
                    <div class="footer">
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        <p>&copy; 2024 E-Doctorat - Tous droits réservés</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(candidatName, frontendUrl);
    }

    /**
     * Builds the HTML body for password reset email
     */
    private String buildPasswordResetEmailBody(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
                    .container { max-width: 600px; margin: 20px auto; background-color: white; }
                    .header { background-color: #FF9800; color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; }
                    .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; background-color: #f9f9f9; }
                    .button { display: inline-block; padding: 15px 30px; background-color: #FF9800; 
                             color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; 
                             font-weight: bold; }
                    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔒 Réinitialisation de mot de passe</h1>
                    </div>
                    <div class="content">
                        <h2>Bonjour,</h2>
                        <p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
                        <p>Pour créer un nouveau mot de passe, cliquez sur le bouton ci-dessous :</p>
                        <p style="text-align: center;">
                            <a href="%s" class="button">Réinitialiser mon mot de passe</a>
                        </p>
                        <div class="warning">
                            <strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure.
                        </div>
                        <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                        <p style="word-break: break-all; color: #FF9800;">%s</p>
                        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.</p>
                        <p>Cordialement,<br>L'équipe E-Doctorat</p>
                    </div>
                    <div class="footer">
                        <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                        <p>&copy; 2024 E-Doctorat - Tous droits réservés</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);
    }
}