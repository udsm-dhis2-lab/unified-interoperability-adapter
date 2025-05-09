package com.Adapter.icare.Utils;

import com.Adapter.icare.Dtos.*;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class OutcomeDetailsDeserializer extends StdDeserializer<ParentOutcomeDetailsDTO> {

    public OutcomeDetailsDeserializer(){
        this(null);
    }

    public OutcomeDetailsDeserializer(Class<?> vc) {
        super(vc);
    }


    @Override
    public ParentOutcomeDetailsDTO deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        ObjectMapper mapper = (ObjectMapper) jsonParser.getCodec();
        JsonNode node = mapper.readTree(jsonParser);

        ParentOutcomeDetailsDTO result = null;
        if (node.has("dischargedHome") || node.has("referredToNCU")){
            try {
                result = mapper.treeToValue(node, PNCBirthOutcomeDetailsDTO.class);
            } catch (JsonProcessingException e) {
                System.err.println("Error deserializing node as PNCBirthOutcomeDetailsDTO: " + node.toString());
                return null;
            }
        }
        else if (node.has("isAlive")) {
            try {
                result = mapper.treeToValue(node, BDOutcomeDetailsDTO.class);
            } catch (JsonProcessingException e) {
                System.err.println("Error deserializing node as BDOutcomeDetailsDTO: " + node.toString());
                return null;
            }
        }
        if (result == null) {
            throw deserializationContext.weirdStringException(node.toString(), ParentOutcomeDetailsDTO.class,
                    "Cannot determine CervicalCancer subtype from provided fields.");
        }

        return result;
    }
}
