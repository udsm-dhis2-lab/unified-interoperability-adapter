package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.PlaceExternalCauseOfDeath;
import com.Adapter.icare.Enums.YesNoUnknown;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostmortemDetails {
    private YesNoUnknown wasPostmortemDone;
    private YesNoUnknown wasPostmortemResultsUsedToDetermineCauseOfDeath;
    private String dateOfExternalDeathCauseOccurred;
    private String externalCauseOfDeathExplanation;
    private PlaceExternalCauseOfDeath placeExternalCauseOfDeath;
}