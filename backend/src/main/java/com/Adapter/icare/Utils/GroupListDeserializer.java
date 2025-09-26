package com.Adapter.icare.Utils;

import com.Adapter.icare.Dtos.CreateUserDTO;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class GroupListDeserializer extends JsonDeserializer<List<CreateUserDTO.GroupDTO>> {
    
    @Override
    public List<CreateUserDTO.GroupDTO> deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) 
            throws IOException {
        
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        List<CreateUserDTO.GroupDTO> groups = new ArrayList<>();
        
        if (node.isArray()) {
            for (JsonNode groupNode : node) {
                CreateUserDTO.GroupDTO groupDTO = new CreateUserDTO.GroupDTO();
                
                if (groupNode.isTextual()) {
                    // If it's a string, treat it as UUID
                    groupDTO.setUuid(groupNode.asText());
                } else if (groupNode.isObject()) {
                    // If it's an object, extract the fields
                    if (groupNode.has("uuid")) {
                        groupDTO.setUuid(groupNode.get("uuid").asText());
                    }
                    if (groupNode.has("groupName")) {
                        groupDTO.setGroupName(groupNode.get("groupName").asText());
                    }
                    if (groupNode.has("description")) {
                        groupDTO.setDescription(groupNode.get("description").asText());
                    }
                }
                
                groups.add(groupDTO);
            }
        }
        
        return groups;
    }
}