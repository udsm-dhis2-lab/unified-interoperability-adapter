package com.Adapter.icare.Dtos;

import com.Adapter.icare.Domains.User;

public class JwtAuthenticationResponse {
    private String token;
    private String tokenType = "Bearer";
    private User user;
    private boolean authenticated;

    public JwtAuthenticationResponse() {}

    public JwtAuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
        this.authenticated = true;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }
}