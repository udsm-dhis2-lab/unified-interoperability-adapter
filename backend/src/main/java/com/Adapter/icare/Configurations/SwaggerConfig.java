package com.Adapter.icare.Configurations;

import java.util.List;

import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

        @Bean
        public GroupedOpenApi publicApi() {
                return GroupedOpenApi.builder()
                                .group("public-api")
                                .pathsToMatch("/api/**")
                                .build();
        }

        @Bean
        public OpenAPI customOpenAPI() {
                // Instead of hardcoding servers, we'll use a server variable
                Server currentServer = new Server()
                                .url("/") // This will use the relative path, making it use whatever URL the user is
                                          // currently on
                                .description("Current Server");

                return new OpenAPI().info(
                                new Info().title("iAdapter/HDU API Documentation")
                                                .description("This is an API documentation for iAdapter, the core of the Health Data Universal (HDU) API")
                                                .version("v1.0.0"))
                                .servers(List.of(currentServer));
        }
}