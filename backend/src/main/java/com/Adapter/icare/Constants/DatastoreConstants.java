package com.Adapter.icare.Constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DatastoreConstants {
    @Value("${DATASTORE_CONFIGURATIONS_NAMESPACE:CONFIGURATIONS}")
    public String ConfigurationsNamespace;

    @Value("${DEFAULT_WORKFLOW_ENGINE_CONFIG_KEY:defaultWorkflowEngine}")
    public String DefaultWorkflowEngineConfigurationDatastoreKey;

    @Value("${APPS_NAMESPACE:APPS}")
    public String AppsNameSpace;

    @Value("${DEFAULT_NAMESPACE_FOR_POTENTIAL_CLIENT_DUPLICATES:CLIENT-DUPLICATES}")
    public String DefaultNameSpaceForPotentialClientDuplicates;

    @Value("${DATASTORE_MAPPINGS_NAMESPACE:MAPPINGS}")
    public String MappingsNamespace;
}
