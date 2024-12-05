package com.Adapter.icare.Controllers;

import com.Adapter.icare.Services.ExternalProxyingService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController()
@RequestMapping("/api/v1/dhis2")
public class ExternalSystemProxyController {

    private final ExternalProxyingService externalProxyingService;

    public ExternalSystemProxyController(ExternalProxyingService externalProxyingService) {
        this.externalProxyingService = externalProxyingService;
    }

    @GetMapping("/**")
    public Object proxyGet(HttpServletRequest request) throws Exception {
        String requestURI = request.getRequestURI();
        String queryString = request.getQueryString();
        String url = requestURI.replace("/api/v1/dhis2/", "");
        if (queryString != null) {
            String decodedQuery = URLDecoder.decode(queryString, StandardCharsets.UTF_8.name());
            url += "?" + decodedQuery;
        }
        return this.externalProxyingService.getExternalData(url);
    }

    @PostMapping("/**")
    public Object proxyPost(HttpServletRequest request, @RequestBody Map<String,Object> payload) {
        String requestURI = request.getRequestURI();
        String queryString = request.getQueryString();
        String url = requestURI.replace("/api/v1/dhis2/", "");
        if (queryString != null) {
            url += "?" + queryString;
        }
        return this.externalProxyingService.postExternalData(url,payload);
    }
}
