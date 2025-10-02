package com.Adapter.icare.Configurations;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class DualAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        // Check if this is an API request or a browser request
        String acceptHeader = request.getHeader("Accept");
        String authHeader = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();
        
        // Determine if we should trigger Basic Auth popup or return JSON error
        boolean isApiRequest = isApiRequest(acceptHeader, requestURI, authHeader);
        boolean shouldTriggerBasicAuth = shouldTriggerBasicAuthPopup(request, authHeader);

        if (shouldTriggerBasicAuth && !isApiRequest) {
            // Trigger browser Basic Auth popup
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("WWW-Authenticate", "Basic realm=\"Unified Interoperability Adapter\"");
            response.setContentType("text/html");
            response.setCharacterEncoding("UTF-8");
            
            // Optional: Send a simple HTML page for better UX
            String htmlResponse = "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <title>Authentication Required</title>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "</head>\n" +
                "<body>\n" +
                "    <h1>Authentication Required</h1>\n" +
                "    <p>Please provide your credentials to access this resource.</p>\n" +
                "    <p>If the authentication dialog doesn't appear, please refresh the page.</p>\n" +
                "</body>\n" +
                "</html>";
            
            response.getWriter().write(htmlResponse);
        } else {
            // Return JSON error response (for API clients and when Basic Auth is not appropriate)
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("authenticated", false);
            errorResponse.put("error", "Unauthorized");
            
            if (shouldTriggerBasicAuth) {
                errorResponse.put("message", "Access denied. Please provide valid Basic Auth credentials or JWT token.");
                errorResponse.put("authMethods", new String[]{"Basic", "Bearer"});
                // Also add WWW-Authenticate header for programmatic clients
                response.setHeader("WWW-Authenticate", "Basic realm=\"Unified Interoperability Adapter\"");
            } else {
                errorResponse.put("message", "Access denied. Please log in to continue.");
            }
            
            errorResponse.put("path", request.getRequestURI());
            errorResponse.put("timestamp", System.currentTimeMillis());

            String jsonResponse = objectMapper.writeValueAsString(errorResponse);
            response.getWriter().write(jsonResponse);
        }
    }

    /**
     * Determine if this is an API request based on Accept header and request path
     */
    private boolean isApiRequest(String acceptHeader, String requestURI, String authHeader) {
        // Check if Accept header indicates JSON response is preferred
        boolean acceptsJson = acceptHeader != null && 
            (acceptHeader.contains("application/json") || 
             acceptHeader.contains("*/*") && !acceptHeader.contains("text/html"));
        
        // Check if the request is to an API endpoint
        boolean isApiPath = requestURI != null && requestURI.startsWith("/api/");
        
        // Check if already has some form of auth header (failed JWT)
        boolean hasAuthHeader = StringUtils.hasText(authHeader);
        
        return acceptsJson || isApiPath || hasAuthHeader;
    }

    /**
     * Determine if we should trigger Basic Auth popup
     */
    private boolean shouldTriggerBasicAuthPopup(HttpServletRequest request, String authHeader) {
        // Always allow Basic Auth popup for browser requests without any auth header
        // or when specifically requested through a parameter
        
        String triggerBasicAuth = request.getParameter("basicAuth");
        boolean explicitlyRequested = "true".equals(triggerBasicAuth);
        
        // If no auth header and not explicitly disabled, allow Basic Auth
        boolean noAuthHeader = !StringUtils.hasText(authHeader);
        
        // Check user agent to see if it's a browser
        String userAgent = request.getHeader("User-Agent");
        boolean isBrowser = userAgent != null && 
            (userAgent.contains("Mozilla") || 
             userAgent.contains("Chrome") || 
             userAgent.contains("Safari") || 
             userAgent.contains("Edge"));
        
        return explicitlyRequested || (noAuthHeader && isBrowser);
    }
}