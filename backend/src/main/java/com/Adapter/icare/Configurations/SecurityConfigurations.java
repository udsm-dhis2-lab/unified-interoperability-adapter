package com.Adapter.icare.Configurations;

import com.Adapter.icare.Handlers.CustomAuthSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfigurations extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;

    public SecurityConfigurations(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
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
                        "/webjars/**"
                ).permitAll()
                .antMatchers("/**/styles-*.css", "/**/runtime-*.js", "/**/polyfills-*.js", "/**/chunk-*.js", "/**/main-*.js", "/**/favicon.ico")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/login")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/login")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic();
    }
}
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(Arrays.asList("*")); // Allow all origins
//        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
//        config.setAllowCredentials(true); // Allow credentials
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }