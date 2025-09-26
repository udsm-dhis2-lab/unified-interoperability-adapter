package com.Adapter.icare.Configurations;

import java.util.List;

import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
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
                final String securitySchemeName = "bearerAuth";
                
                Server currentServer = new Server()
                                .url("/")
                                .description("Current Server");

                return new OpenAPI()
                                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                                .components(
                                        new Components()
                                                .addSecuritySchemes(securitySchemeName,
                                                        new SecurityScheme()
                                                                .name(securitySchemeName)
                                                                .type(SecurityScheme.Type.HTTP)
                                                                .scheme("bearer")
                                                                .bearerFormat("JWT")
                                                                .description("JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"")
                                                )
                                )
                                .info(
                                        new Info().title("iAdapter/HDU API Documentation")
                                                        .description("This is an API documentation for iAdapter, the core of the Health Data Universal (HDU) API.\n\n" +
                                                                "**Authentication:** This API uses JWT (JSON Web Token) authentication. \n\n" +
                                                                "**How to authenticate:**\n" +
                                                                "1. First, call the `/api/v1/login` endpoint with your credentials\n" +
                                                                "2. Copy the `token` from the response\n" +
                                                                "3. Click the 'Authorize' button above and paste the token (without 'Bearer ' prefix)\n" +
                                                                "4. All subsequent requests will be automatically authenticated\n\n" +
                                                                "\n"
                                                                )
                                                        .version("v1.0.0"))
                                .servers(List.of(currentServer));
        }
}