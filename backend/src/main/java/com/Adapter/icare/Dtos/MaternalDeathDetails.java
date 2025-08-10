package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.YesNoUnknown;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.Adapter.icare.Enums.DeathTimingDuringPregnancy;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaternalDeathDetails {
    private YesNoUnknown wasPregnant;
    private DeathTimingDuringPregnancy wasDeathAfterOrDuringPregnancy;
    private YesNoUnknown wasPregnancyContributedToDeath;
    private YesNoUnknown wasDeathAudited;
}