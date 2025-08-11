package com.Adapter.icare.Dtos;

import com.Adapter.icare.Enums.YesNoUnknown;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.Adapter.icare.Dtos.PostmortemDetails;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DROtherDeathDetails {
    private YesNoUnknown wasSurgeryPerformedInTheLast4Weeks;
    private String dateOfSurgery;
    private String surgeryReason;
    private PostmortemDetails postmortemDetails;
    private NeonatalDetails neonatalDetails;
    private MaternalDeathDetails maternalDeathDetails;
}