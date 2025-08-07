package com.Adapter.icare.Utils;

import com.Adapter.icare.Dtos.CervicalCancerDTO;
import com.Adapter.icare.Dtos.FPCervicalCancerDTO;
import com.Adapter.icare.Dtos.ParentCervicalCancerDTO;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class CervicalCancerDeserializer extends StdDeserializer<ParentCervicalCancerDTO> {

    public CervicalCancerDeserializer() {
        this(null);
    }

    public CervicalCancerDeserializer(Class<?> vc) {
        super(vc);
    }


    @Override
    public ParentCervicalCancerDTO deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        ObjectMapper mapper = (ObjectMapper) jsonParser.getCodec();
        JsonNode node = mapper.readTree(jsonParser);

        ParentCervicalCancerDTO result = null;

        if ((node.has("suspected") || node.has("screenedWithVia") || node.has("viaTestPositive")) &&
                !(node.has("screenedWithHPVDNA") || node.has("hpvDNAPositive")  ||
                        node.has("diagnosedWithLargeLesion") || node.has("diagnosedWithSmallOrModerateLesion") || node.has("treatedWithCryo") ||
                        node.has("treatedWithThermo") || node.has("treatedWithLEEP") || node.has("firstTimeScreening") || node.has("treatedOnTheSameDay") || node.has("complicationsAfterTreatment") || node.has("foundWithHivAndReferredToCTC"))){
            try {
                result = mapper.treeToValue(node, FPCervicalCancerDTO.class);
            } catch (JsonProcessingException e) {
                System.err.println("Error deserializing node as FPCervicalCancerDTO: " + node.toString());
                return null;
            }
        }

        else if (node.has("screenedWithHPVDNA") || node.has("hpvDNAPositive") ||
         node.has("diagnosedWithLargeLesion") || node.has("diagnosedWithSmallOrModerateLesion") || node.has("treatedWithCryo") ||
                 node.has("treatedWithThermo") || node.has("treatedWithLEEP") || node.has("firstTimeScreening") || node.has("treatedOnTheSameDay") || node.has("complicationsAfterTreatment") || node.has("foundWithHivAndReferredToCTC")
        ) {
            try {
                result = mapper.treeToValue(node, CervicalCancerDTO.class);
            } catch (JsonProcessingException e) {
                System.err.println("Error deserializing node as CervicalCancerDTO: " + node.toString());
                return null;
            }
        }
        if (result == null) {
            throw deserializationContext.weirdStringException(node.toString(), ParentCervicalCancerDTO.class,
                    "Cannot determine CervicalCancer subtype from provided fields.");
        }

        return result;
    }
}
