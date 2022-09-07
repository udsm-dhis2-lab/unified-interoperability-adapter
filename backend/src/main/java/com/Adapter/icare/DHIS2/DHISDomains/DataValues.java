package com.Adapter.icare.DHIS2.DHISDomains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DataValues {
    private String dataElement;
    private String categoryOptionCombo;
    private String value;
    private String comment;
}
