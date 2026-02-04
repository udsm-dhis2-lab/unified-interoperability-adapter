package com.Adapter.icare.WebUserInterface;

import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Constants.WebUIConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/")
public class UserInterfaceController {

    private final List<Map<String, Object>> apps = new ArrayList<>();
    private Map<String, String> appsRoutesToResourceMap = new HashMap<>();

    public UserInterfaceController(
            DatastoreService datastoreService,
            DatastoreConstants datastoreConstants,
            WebUIConstants webUIConstants) throws Exception {
        List<Datastore> appsList = datastoreService.getDatastoreNamespaceDetails(datastoreConstants.AppsNameSpace);
        if (appsList != null && !appsList.isEmpty()) {
            for (Datastore appConfigs : appsList) {
                Map<String, Object> app = appConfigs.getValue();
                app.put("key", appConfigs.getDataKey());
                apps.add(app);
            }
        }
    }

    @PostConstruct
    public void loadRouteConfigurations() {
        for (Map<String, Object> app : apps) {
            if (app.get("key") != null && app.get("appPath") != null) {
                appsRoutesToResourceMap.put(app.get("key").toString(), app.get("appPath").toString());
            } else {
                System.out.println("Invalid app configuration: " + app);
            }
        }
    }

    @GetMapping
    public RedirectView redirectToLogin() {
        return new RedirectView("/apps");
    }

    @GetMapping("{appRoute}")
    public String provideUi(@PathVariable String appRoute) {
        String appPath = appsRoutesToResourceMap.get(appRoute);
        if (appPath != null) {
            return "forward:" + appPath + "/index.html";
        } else {
            return "forward:/login/index.html";
        }
    }

    @GetMapping("apps/{path:^(?!.*\\..*$).*}")
    public String forwardToAngular() {
        return "forward:/apps/index.html";
    }

    @GetMapping("dashboard/{path:^(?!.*\\..*$).*}")
    public String dashboard() {
        return "forward:/apps/dashboard/index.html";
    }
}
