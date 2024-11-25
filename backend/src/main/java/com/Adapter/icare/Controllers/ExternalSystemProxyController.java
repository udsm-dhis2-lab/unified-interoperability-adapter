package com.Adapter.icare.Controllers;

import com.Adapter.icare.Services.ExternalProxyingService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController()
@RequestMapping("/api/v1/dhis2")
public class ExternalSystemProxyController {

    private final ExternalProxyingService externalProxyingService;

    public ExternalSystemProxyController(ExternalProxyingService externalProxyingService) {
        this.externalProxyingService = externalProxyingService;
    }

    @GetMapping("{url}")
    public Map<String, Object> proxyGet(@PathVariable String url) {
        return this.externalProxyingService.getExternalData(url);
    }

    @PostMapping("{url}")
    public Map<String, Object> proxyPost(@PathVariable String url, @RequestBody Map<String,Object> payload) {
        return this.externalProxyingService.getExternalData(url);
    }
}
