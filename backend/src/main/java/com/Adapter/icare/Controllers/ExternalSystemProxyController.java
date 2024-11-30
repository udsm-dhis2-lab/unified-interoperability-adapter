package com.Adapter.icare.Controllers;

import com.Adapter.icare.Services.ExternalProxyingService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

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
            url += "?" + queryString;
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
