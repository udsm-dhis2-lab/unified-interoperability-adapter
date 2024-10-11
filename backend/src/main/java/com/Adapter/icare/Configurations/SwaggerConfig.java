package com.Adapter.icare.Configurations;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springdoc.core.GroupedOpenApi;

import java.util.Arrays;
import java.util.List;

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
        // List of servers
        List<Server> servers = Arrays.asList(
                new Server().url("https://iadapter.dhis2.udsm.ac.tz").description("Development Server")
        );

        return new OpenAPI().info(new Info().title("iAdapter API")
                        .description("This is an API documentation for iAdapter")
                        .version("v1.0.0"))
                .servers(servers);
    }
}