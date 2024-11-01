package com.Adapter.icare.Dtos;

import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.MediatorApiPath;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
public class MediatorDTO {
    private String baseUrl;
    private String path;
    private String category;
    private String code;
    private String authToken;
    private String authType;
    private Set<MediatorApiPath> apis;
}
