package com.mosip.common_database;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.mosip.common_database.repository")
public class CommonDatabaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommonDatabaseApplication.class, args);
	}

}
