package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

@Getter
@Setter
public class MergeClients {
    @NotNull
    private int clientOne; // client to keep

    @NotNull
    private int clientTwo;
}
