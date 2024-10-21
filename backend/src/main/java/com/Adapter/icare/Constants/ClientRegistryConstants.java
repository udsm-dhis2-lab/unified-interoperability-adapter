package com.Adapter.icare.Constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ClientRegistryConstants {
    @Value("${CLIENT_REGISTRY_GENERATE_IDENTIFIER:true}")
    public String GenerateClientIdentifier;

    @Value("${CLIENT_REGISTRY_IDENTIFIER_REGEX:^CR-\\\\d{4}-\\\\d{3}$}")
    public String ClientRegistryIdentifierRegex;

    @Value("${DEFAULT_IDENTIFIER_TYPE:NIDA}")
    public String DefaultIdentifierType;

    @Value("${VALIDATE_DATA_TEMPLATE_PRIOR_TO_WORKFLOW_ENGINE:true}")
    public Boolean ValidateDataTemplate;
}
