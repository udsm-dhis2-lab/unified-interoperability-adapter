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
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

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
                .antMatchers("/")
                .permitAll()
                .antMatchers("/error")
                .permitAll()
                .antMatchers("/login/**")
                .permitAll()
                .antMatchers("/customError")
                .permitAll()
                .antMatchers("/login")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/api/v1/login")
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/v1/login")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic();
//        SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
//        http
//                .authorizeRequests()
//                .antMatchers(HttpMethod.GET, "/error").permitAll()
//                .antMatchers(HttpMethod.GET, "/customError").permitAll()
//                .antMatchers(HttpMethod.GET, "/login/**").permitAll()
//                .antMatchers(HttpMethod.GET, "/**/**.js", "/**.js").permitAll()
//                .antMatchers(HttpMethod.GET, "/**/**.css", "/**.css").permitAll()
//                .antMatchers(HttpMethod.POST, "/api/v1/login").permitAll()
//                .antMatchers(HttpMethod.GET, "/api/v1/login").permitAll()
//                .anyRequest().authenticated()
//                .and()
//                .httpBasic()
//                .and()
//                .sessionManagement(session -> session
//                        .sessionFixation().migrateSession()
//                        .maximumSessions(1)
//                        .maxSessionsPreventsLogin(true));
//        return http.build();

//        http
//                .formLogin()
//                .loginPage("/login")
//                .successHandler(new CustomAuthSuccessHandler());
//        return http.build();
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
}