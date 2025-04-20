package com.moonhair.moonhair;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.moonhair.moonhair.repositories")
@EntityScan(basePackages = "com.moonhair.moonhair.entities")
public class MoonHairApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoonHairApiApplication.class, args);
	}

}
