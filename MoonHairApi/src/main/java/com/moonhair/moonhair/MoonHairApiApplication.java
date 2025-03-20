package com.moonhair.moonhair;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MoonHairApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoonHairApiApplication.class, args);
	}

}
