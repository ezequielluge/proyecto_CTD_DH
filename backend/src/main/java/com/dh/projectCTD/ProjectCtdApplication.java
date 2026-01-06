package com.dh.projectCTD;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjectCtdApplication {

	public static void main(String[] args) {
		System.out.println(System.getenv("AWS_S3_BUCKET"));

		SpringApplication.run(ProjectCtdApplication.class, args);
	}

}
