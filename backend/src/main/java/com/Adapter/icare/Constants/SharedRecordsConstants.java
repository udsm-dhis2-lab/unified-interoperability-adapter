package com.Adapter.icare.Constants;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SharedRecordsConstants {
    @Value("${SHOULD_GET_SHARED_RECORDS_FROM_ENGINE:true}")
    public boolean ShouldGetSharedRecordsFromEngine;
}
