package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ReactionDTO {
    private Date reactionDate;
    private String notes;
    private boolean reported;
}
