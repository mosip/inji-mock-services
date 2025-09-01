package com.mosip.inji_usecase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class InjiDataCreationApp {

	public static void main(String[] args) {
		SpringApplication.run(InjiDataCreationApp.class, args);
	}

}
