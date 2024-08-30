package com.Adapter.icare.Configurations;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("Executed handler file successfully");
        registry
                .addResourceHandler("/adapter/**")
                .addResourceLocations("classpath:/static/");
    }
}