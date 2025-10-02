package com.Adapter.icare.Configurations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class DualAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public DualAuthenticationFilter(JwtTokenProvider tokenProvider, 
                                  UserDetailsService userDetailsService, 
                                  PasswordEncoder passwordEncoder) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
            FilterChain filterChain) throws ServletException, IOException {
        
        logger.debug("DualAuthenticationFilter - Processing request: " + request.getRequestURI());
        
        try {
            // First, try JWT authentication
            String jwt = getJwtFromRequest(request);
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                logger.debug("Valid JWT token found, authenticating with JWT");
                authenticateWithJWT(request, jwt);
            } else {
                // If no valid JWT, try Basic Auth
                String basicAuth = getBasicAuthFromRequest(request);
                if (StringUtils.hasText(basicAuth)) {
                    logger.debug("Basic Auth header found, attempting basic authentication");
                    authenticateWithBasicAuth(request, basicAuth);
                } else {
                    logger.debug("No authentication credentials found in request");
                }
            }
        } catch (Exception ex) {
            logger.error("Could not authenticate user", ex);
            // Clear context on authentication failure
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }

    private void authenticateWithJWT(HttpServletRequest request, String jwt) {
        String username = tokenProvider.getUsernameFromToken(jwt);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.debug("JWT Authentication successful for user: " + username);
    }

    private void authenticateWithBasicAuth(HttpServletRequest request, String basicAuth) {
        try {
            String[] credentials = extractBasicAuthCredentials(basicAuth);
            if (credentials != null && credentials.length == 2) {
                String username = credentials[0];
                String password = credentials[1];
                
                logger.debug("Attempting basic auth for user: " + username);
                
                // Load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // Verify password
                if (passwordEncoder.matches(password, userDetails.getPassword())) {
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("Basic Authentication successful for user: " + username);
                } else {
                    logger.debug("Basic Auth password verification failed for user: " + username);
                }
            }
        } catch (Exception ex) {
            logger.debug("Basic Auth failed: " + ex.getMessage());
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private String getBasicAuthFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Basic ")) {
            return authHeader.substring(6);
        }
        return null;
    }

    private String[] extractBasicAuthCredentials(String basicAuth) {
        try {
            byte[] decoded = Base64.getDecoder().decode(basicAuth);
            String credentials = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = credentials.split(":", 2);
            if (parts.length == 2) {
                return parts;
            }
        } catch (Exception ex) {
            logger.debug("Failed to decode basic auth credentials: " + ex.getMessage());
        }
        return null;
    }
}