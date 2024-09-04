package com.Adapter.icare.Configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers (ResourceHandlerRegistry registry) {
        // Catch-all to forward any unmapped paths to index.html, except paths containing a dot
//        registry.addViewController("/{spring:\\w+}")
//                .setViewName("forward:/index.html");
//
//        // Forward all requests with more than one path segment except paths containing a dot
//        registry.addViewController("/**")
//                .setViewName("forward:/index.html");
        if (!registry.hasMappingForPattern("/assets/**")) {
            registry.addResourceHandler("/assets/**")
                    .addResourceLocations("/assets");
        }
    }
}