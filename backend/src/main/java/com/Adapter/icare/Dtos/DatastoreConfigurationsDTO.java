package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import org.json.JSONObject;

import javax.validation.constraints.NotNull;
import java.util.Map;

@Getter
@Setter
public class DatastoreConfigurationsDTO {
    @NotNull(message = "key cannot be null")
    private String key;
    private String group;

    @NotNull(message = "value cannot be null")
    private Map<String,Object> value;
}
