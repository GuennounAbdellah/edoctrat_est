package com.tppartdeux.edoctorat.service.auth;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SendGridEmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sender.email:edoctorat.est@gmail.com}")
    private String senderEmail;

    @Value("${sender.name:E-Doctorat}")
    private String senderName;

    @Value("${app.frontend.url:http://localhost:5173}")
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
     * Sends email using SendGrid API
     */
    private void sendEmail(String toEmail, String subject, String htmlBody) {
        try {
            System.out.println("📧 Sending email via SendGrid to: " + toEmail);
            
            Email from = new Email(senderEmail, senderName);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlBody);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("✅ Email sent successfully to: " + toEmail);
                System.out.println("SendGrid Status Code: " + response.getStatusCode());
            } else {
                System.err.println("⚠️ SendGrid returned status: " + response.getStatusCode());
                System.err.println("Response Body: " + response.getBody());
            }
        } catch (IOException e) {
            System.err.println("❌ Failed to send email to: " + toEmail);
            e.printStackTrace();
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

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