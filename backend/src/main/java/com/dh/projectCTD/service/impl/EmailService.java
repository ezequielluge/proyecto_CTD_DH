package com.dh.projectCTD.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.dh.projectCTD.service.IEmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService implements IEmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.frontend.url:https://localhost:5173}")
    private String url;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async 
    @Override
    public void sendRegistrationConfirmation(String to, String name, String username) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject("¡Registro Exitoso en Fast Booking!");

            String htmlMsg = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>"
                    + "<h2 style='color: #0d6efd;'>¡Hola " + name + "!</h2>"
                    + "<p>Tu registro se ha completado con éxito. ¡Bienvenido a Fast Booking!</p>"
                    + "<h3>Tus datos de acceso:</h3>"
                    + "<ul>"
                    + "<li><strong>Email/Usuario:</strong> " + username + "</li>"
                    + "</ul>"
                    + "<p>Ya puedes iniciar sesión en tu cuenta haciendo clic en el siguiente enlace:</p>"
                    + "<a href=" + url + "/login" + " style='background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;'>Iniciar Sesión</a>"
                    + "<br><br><p style='color: #6c757d; font-size: 0.9em;'>Saludos,<br>El equipo de Fast Booking</p>"
                    + "<hr style='border: 0; border-top: 1px solid #eee; margin-top: 20px;'>"
                    + "<p style='font-size: 0.8em; color: #999;'>Este es un correo generado automáticamente, por favor no respondas a esta dirección.</p>"
                    + "</div>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Error al enviar el correo de confirmación a " + to + ": " + e.getMessage());
        }
    }

}
