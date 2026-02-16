package com.dh.projectCTD.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${storage.local.dir}")
    private String localStorageDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get(localStorageDir).toAbsolutePath().toUri().toString();
        registry.addResourceHandler(localStorageDir + "/**")
                .addResourceLocations(uploadPath);
    }
}
