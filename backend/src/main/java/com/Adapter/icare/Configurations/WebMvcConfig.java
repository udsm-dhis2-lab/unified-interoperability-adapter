package com.Adapter.icare.Configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.http.HttpStatus;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");

        // Add specific handlers for each app directory
        registry.addResourceHandler("/login/**")
                .addResourceLocations("classpath:/static/login/")
                .setCachePeriod(0);

        registry.addResourceHandler("/dashboard/**")
                .addResourceLocations("classpath:/static/dashboard/")
                .setCachePeriod(0);

        registry.addResourceHandler("/client-management/**")
                .addResourceLocations("classpath:/static/client-management/")
                .setCachePeriod(0);

        registry.addResourceHandler("/mapping-and-data-extraction/**")
                .addResourceLocations("classpath:/static/mapping-and-data-extraction/")
                .setCachePeriod(0);

        registry.addResourceHandler("/workflows-management/**")
                .addResourceLocations("classpath:/static/workflows-management/")
                .setCachePeriod(0);

        registry.addResourceHandler("/referral-management/**")
                .addResourceLocations("classpath:/static/referral-management/")
                .setCachePeriod(0);

        registry.addResourceHandler("/settings/**")
                .addResourceLocations("classpath:/static/settings/")
                .setCachePeriod(0);

        // This should be the last resource handler as a fallback
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(0);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Direct mappings for app root paths
        registry.addViewController("/login").setViewName("forward:/login/index.html");
        registry.addViewController("/dashboard").setViewName("forward:/dashboard/index.html");
        registry.addViewController("/client-management").setViewName("forward:/client-management/index.html");
        registry.addViewController("/mapping-and-data-extraction")
                .setViewName("forward:/mapping-and-data-extraction/index.html");
        registry.addViewController("/workflows-management").setViewName("forward:/workflows-management/index.html");
        registry.addViewController("/referral-management").setViewName("forward:/referral-management/index.html");
        registry.addViewController("/settings").setViewName("forward:/settings/index.html");

        // Default route for root path
        registry.addViewController("/").setViewName("forward:/login/index.html");
    }

    @Bean
    public ErrorPageRegistrar errorPageRegistrar() {
        return new ErrorPageRegistrar() {
            @Override
            public void registerErrorPages(ErrorPageRegistry registry) {
                // Register custom error pages
                registry.addErrorPages(
                        new ErrorPage(HttpStatus.NOT_FOUND, "/login/index.html"),
                        new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/login/index.html"),
                        new ErrorPage(Throwable.class, "/login/index.html"));
            }
        };
    }
}
