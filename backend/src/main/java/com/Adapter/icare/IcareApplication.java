package com.Adapter.icare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class IcareApplication {

	public static void main(String[] args) {
		SpringApplication.run(IcareApplication.class, args);
	}

}
