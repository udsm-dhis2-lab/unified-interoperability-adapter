package com.Adapter.icare.Utils;

import com.Adapter.icare.Dtos.CreateUserDTO;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class RoleListDeserializer extends JsonDeserializer<List<CreateUserDTO.RoleDTO>> {
    
    @Override
    public List<CreateUserDTO.RoleDTO> deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) 
            throws IOException {
        
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        List<CreateUserDTO.RoleDTO> roles = new ArrayList<>();
        
        if (node.isArray()) {
            for (JsonNode roleNode : node) {
                CreateUserDTO.RoleDTO roleDTO = new CreateUserDTO.RoleDTO();
                
                if (roleNode.isTextual()) {
                    // If it's a string, treat it as UUID
                    roleDTO.setUuid(roleNode.asText());
                } else if (roleNode.isObject()) {
                    // If it's an object, extract the fields
                    if (roleNode.has("uuid")) {
                        roleDTO.setUuid(roleNode.get("uuid").asText());
                    }
                    if (roleNode.has("roleName")) {
                        roleDTO.setRoleName(roleNode.get("roleName").asText());
                    }
                    if (roleNode.has("description")) {
                        roleDTO.setDescription(roleNode.get("description").asText());
                    }
                }
                
                roles.add(roleDTO);
            }
        }
        
        return roles;
    }
}