package com.Adapter.icare.Dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@Setter
public class AppointmentDetailsDTO {
    private String appointmentId;
    private String hfrCode;
    private String appointmentStatus;
    private List<AppointmentPaymentDetailsDTO> paymentDetails;
    private List<AppointmentServiceDetailsDTO> serviceDetails;

    Map<String, Object> toMap() {
        Map<String, Object> appointmentDetails = new HashMap<>();

        appointmentDetails.put("appointmentId", this.getAppointmentId());
        appointmentDetails.put("hfrCode", this.getHfrCode());
        appointmentDetails.put("appointmentStatus", this.getAppointmentStatus());
        appointmentDetails.put("paymentDetails", this.getPaymentDetails().stream().map(AppointmentPaymentDetailsDTO::toMap).collect(Collectors.toList()));
        appointmentDetails.put("serviceDetails", this.getServiceDetails().stream().map(AppointmentServiceDetailsDTO::toMap).collect(Collectors.toList()));

        return appointmentDetails;
    }
}
