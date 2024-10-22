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

    @Value("${DATASTORE_MAPPINGS_NAMESPACE_FILTER:MAPPINGS-}")
    public String MappingsNamespaceFilter;

    @Value("${DATASTORE_RESOURCE_METADATA_NAMESPACE:METADATA}")
    public String ResourcesMetadataNamespace;

    @Value("${DATASTORE_KEY_FOR_CLIENT_METADATA:CLIENTS}")
    public String ClientsMetadataKey;

    @Value("${DATASTORE_KEY_FOR_DATA_TEMPLATE_METADATA:DATA-TEMPLATE}")
    public String DataTemplateMetadataKey;

    @Value("${DATASTORE_KEY_FOR_AGREED_CLIENT_MANDATORY_IDS_TYPES:mandatory-cr-id-types}")
    public String MandatoryClientRegistryIdTypes;
}
