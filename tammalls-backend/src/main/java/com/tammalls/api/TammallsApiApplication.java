package com.tammalls.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.tammalls.api")
public class TammallsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TammallsApiApplication.class, args);
        System.out.println("Access Swagger At: http://localhost:8080/api/swagger-ui/index.html#/");
    }
}
