package com.dh.projectCTD.service;

public interface IEmailService {
    void sendRegistrationConfirmation(String to, String name, String username);
}
