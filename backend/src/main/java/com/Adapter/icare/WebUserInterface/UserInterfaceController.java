package com.Adapter.icare.WebUserInterface;

import com.Adapter.icare.Constants.DatastoreConstants;
import com.Adapter.icare.Constants.WebUIConstants;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Services.DatastoreService;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Controller
public class UserInterfaceController {

//    private static final Logger logger = (Logger) LoggerFactory.getLogger(UserInterfaceController.class);
    private final DatastoreService datastoreService;
    private final DatastoreConstants datastoreConstants;
    private final WebUIConstants webUIConstants;
    private final List<Map<String, Object>> apps = new ArrayList<>();
    private Map<String, String> appsRoutesToResourceMap = new HashMap<>();
    public UserInterfaceController(
            DatastoreService datastoreService,
            DatastoreConstants datastoreConstants,
            WebUIConstants webUIConstants) throws Exception {
        this.datastoreService =datastoreService;
        this.datastoreConstants = datastoreConstants;
        this.webUIConstants = webUIConstants;
        List<Datastore> appsList = datastoreService.getDatastoreNamespaceDetails(datastoreConstants.AppsNameSpace);
        if (appsList != null && !appsList.isEmpty()) {
            for(Datastore appConfigs: appsList) {
                Map<String, Object> app = appConfigs.getValue();
                app.put("key", appConfigs.getDataKey());
                apps.add(app);
            }
        }
    }

    @PostConstruct
    public void loadRouteConfigurations() {
        // TODO: Create DTO for the app configs instead of using Map<String,Object> type
        for (Map<String, Object> app : apps) {
            appsRoutesToResourceMap.put(app.get("key").toString(), app.get("appPath").toString());
        }
    }

//    @GetMapping("/")
//    public RedirectView redirectRouteApplicationPathToLoginUiPath() {
//        System.out.println("TESTING REDIRECTION");
//        return new RedirectView(webUIConstants.DefaultApplicationUiRoutePath);
//    }

    @GetMapping("{appRoute}")
    public String provideUi(@PathVariable String appRoute) {
        System.out.println(appRoute);
        String appPath = appsRoutesToResourceMap.get(appRoute.toString());
        if (appPath != null) {
            return "forward:" + appPath + "/index.html";
        } else {
//            logger.warning("No mapping found for appRoute: {}. Redirecting to login page.");
            return "forward:/login/index.html";
        }
    }
}
