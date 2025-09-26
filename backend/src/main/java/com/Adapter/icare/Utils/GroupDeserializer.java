package com.Adapter.icare.Utils;

import com.Adapter.icare.Domains.Group;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;

public class GroupDeserializer extends JsonDeserializer<Group> {
    
    @Override
    public Group deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) 
            throws IOException {
        
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);
        Group group = new Group();
        
        if (node.isTextual()) {
            // If it's a string, treat it as UUID
            group.setUuid(node.asText());
        } else if (node.isObject()) {
            // If it's an object, extract the fields
            if (node.has("uuid")) {
                group.setUuid(node.get("uuid").asText());
            }
            if (node.has("groupName")) {
                group.setGroupName(node.get("groupName").asText());
            }
            if (node.has("description")) {
                group.setDescription(node.get("description").asText());
            }
        }
        
        return group;
    }
}