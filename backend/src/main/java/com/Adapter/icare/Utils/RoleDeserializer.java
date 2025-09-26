package com.Adapter.icare.Utils;

import com.Adapter.icare.Domains.Role;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;

public class RoleDeserializer extends JsonDeserializer<Role> {
    
    @Override
    public Role deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) 
            throws IOException {
        
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        Role role = new Role();
        
        if (node.isTextual()) {
            // If it's a string, treat it as UUID
            role.setUuid(node.asText());
        } else if (node.isObject()) {
            // If it's an object, extract the fields
            if (node.has("uuid")) {
                role.setUuid(node.get("uuid").asText());
            }
            if (node.has("roleName")) {
                role.setRoleName(node.get("roleName").asText());
            }
            if (node.has("description")) {
                role.setDescription(node.get("description").asText());
            }
        }
        
        return role;
    }
}