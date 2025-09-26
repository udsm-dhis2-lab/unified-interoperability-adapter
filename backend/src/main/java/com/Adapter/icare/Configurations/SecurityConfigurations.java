package com.Adapter.icare.Configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfigurations extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfigurations(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and()
                .authorizeRequests()
                .antMatchers(
                        "/",
                        "/error",
                        "/login",
                        "/dashboard",
                        "/client-management",
                        "/workflows-management",
                        "/apps",
                        "/login/**",
                        "/dashboard/**",
                        "/client-management/**",
                        "/workflows-management/**",
                        "/apps/**",
                        "/customError",
                        "/swagger-ui/**",
                        "/swagger-ui/index.html",
                        "/v3/api-docs/**",
                        "/swagger-resources/**",
                        "/webjars/**")
                .permitAll()
                .antMatchers("/**/styles-*.css", "/**/runtime-*.js", "/**/polyfills-*.js", "/**/chunk-*.js",
                        "/**/main-*.js", "/**/favicon.ico")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/login")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/login")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/users")
                .permitAll()
                .antMatchers("/api/v1/init/**")
                .permitAll()
                .anyRequest()
                .authenticated();

        // Add JWT filter before Username Password Authentication Filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        // Enable CORS
        http.cors();
    }
    
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new
                org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
        config.setAllowedOriginPatterns(java.util.Arrays.asList("*")); // Allow all origins
        config.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Cache-Control", "Content-Type", "Accept"));
        config.setAllowCredentials(true); // Allow credentials
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
