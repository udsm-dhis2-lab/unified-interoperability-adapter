package com.Adapter.icare.DHIS2.DHISDomains;

import lombok.Data;

import java.io.Serializable;

@Data
public class QueryOutputMapping implements Serializable {

    private String row;
    private String column;
    private String de;
    private String co;
}
