package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

@Getter
@Setter
public class ClientsToMergeDTO {
    @NotNull
    private String clientOne; // client to keep

    @NotNull
    private String clientTwo;
}
