package com.Adapter.icare.Constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class WebUIConstants {
    @Value("${DEFAULT_APPLICATION_UI_ROUTE_PATH:/login/#/}")
    public String DefaultApplicationUiRoutePath;

}
