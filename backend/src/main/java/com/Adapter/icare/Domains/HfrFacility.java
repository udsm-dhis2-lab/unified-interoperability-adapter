package com.Adapter.icare.Domains;

import com.Adapter.icare.CustomDeserializers.DirtyBigDecimalDeserializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "hfr_facility")
public class HfrFacility extends  BaseEntity{
    @Id
    @Column(name = "fac_id_number", length = 30)
    @JsonProperty("Fac_IDNumber")
    private String facIdNumber;

    @Column(name = "name", nullable = false, length = 100)
    @JsonProperty("Name")
    private String name;

    @Column(name = "comm_fac_name", length = 100)
    @JsonProperty("Comm_FacName")
    private String commFacName;

    @Column(name = "fac_zone", length = 100)
    @JsonProperty("Zone")
    private String zone;

    @Column(name = "region_code", length = 100)
    @JsonProperty("Region_Code")
    private String regionCode;

    @Column(name = "fac_region", length = 100)
    @JsonProperty("region")
    private String region;

    @Column(name = "district_code", length = 100)
    @JsonProperty("District_Code")
    private String districtCode;

    @Column(name = "district", length = 100)
    @JsonProperty("district")
    private String district;

    @Column(name = "council_code", length = 100)
    @JsonProperty("Council_Code")
    private String councilCode;

    @Column(name = "council", length = 100)
    @JsonProperty("council")
    private String council;

    @Column(name = "ward", length = 100)
    @JsonProperty("ward")
    private String ward;

    @Column(name = "ward_code", length = 100)
    @JsonProperty("ward_Code")
    private String wardCode;

    @Column(name = "village", length = 100)
    @JsonProperty("village")
    private String village;

    @Column(name = "village_code", length = 100)
    @JsonProperty("Village_Code")
    private String villageCode;

    @Column(name = "facility_type_group_code", length = 100)
    @JsonProperty("FacilityTypeGroupCode")
    private String facilityTypeGroupCode;

    @Column(name = "facility_type_group", length = 100)
    @JsonProperty("FacilityTypeGroup")
    private String facilityTypeGroup;

    @Column(name = "facility_type_code", length = 100)
    @JsonProperty("FacilityTypeCode")
    private String facilityTypeCode;

    @Column(name = "facility_type", length = 100)
    @JsonProperty("FacilityType")
    private String facilityType;

    @Column(name = "vote", length = 100)
    @JsonProperty("Vote")
    private String vote;

    @Column(name = "ownership_group_code", length = 100)
    @JsonProperty("OwnershipGroupCode")
    private String ownershipGroupCode;

    @Column(name = "ownership_group", length = 100)
    @JsonProperty("OwnershipGroup")
    private String ownershipGroup;

    @Column(name = "ownership_code", length = 100)
    @JsonProperty("OwnershipCode")
    private String ownershipCode;

    @Column(name = "ownership", length = 100)
    @JsonProperty("Ownership")
    private String ownership;

    @Column(name = "operating_status", length = 100)
    @JsonProperty("OperatingStatus")
    private String operatingStatus;

    @Column(name = "latitude", precision = 10, scale = 6)
    @JsonDeserialize(using = DirtyBigDecimalDeserializer.class)
    @JsonProperty("Latitude")
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 6)
    @JsonDeserialize(using = DirtyBigDecimalDeserializer.class)
    @JsonProperty("Longitude")
    private BigDecimal longitude;

    @Column(name = "registration_status", length = 100)
    @JsonProperty("RegistrationStatus")
    private String registrationStatus;

    @Column(name = "opened_date")
    @JsonProperty("OpenedDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate openedDate;

    @Column(name = "created_at", updatable = false)
    @JsonProperty("CreatedAt")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @JsonProperty("UpdatedAt")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @Column(name = "closed_date")
    @JsonProperty("ClosedDate")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate closedDate;

    @Column(name = "os_change_opened_to_close", length = 1)
    @JsonProperty("OSchangeOpenedtoClose")
    private String osChangeOpenedToClose;

    @Column(name = "os_change_closed_to_operational", length = 1)
    @JsonProperty("OSchangeClosedtoOperational")
    private String osChangeClosedToOperational;

    @Column(name = "post_or_update", length = 1)
    @JsonProperty("PostorUpdate")
    private String postOrUpdate;

    @Column(name = "is_designated")
    @JsonProperty("IsDesignated")
    private Boolean isDesignated;

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("Fac_IDNumber",              facIdNumber);
        map.put("Name",                      name);
        map.put("Comm_FacName",              commFacName);
        map.put("Zone",                      zone);
        map.put("Region_Code",               regionCode);
        map.put("region",                    region);
        map.put("District_Code",             districtCode);
        map.put("district",                  district);
        map.put("Council_Code",              councilCode);
        map.put("council",                   council);
        map.put("ward",                      ward);
        map.put("ward_Code",                 wardCode);
        map.put("village",                   village);
        map.put("Village_Code",              villageCode);
        map.put("FacilityTypeGroupCode",     facilityTypeGroupCode);
        map.put("FacilityTypeGroup",         facilityTypeGroup);
        map.put("FacilityTypeCode",          facilityTypeCode);
        map.put("FacilityType",              facilityType);
        map.put("Vote",                      vote);
        map.put("OwnershipGroupCode",        ownershipGroupCode);
        map.put("OwnershipGroup",            ownershipGroup);
        map.put("OwnershipCode",             ownershipCode);
        map.put("Ownership",                 ownership);
        map.put("OperatingStatus",           operatingStatus);
        map.put("Latitude",                  latitude == null ? null : latitude.toPlainString());
        map.put("Longitude",                 longitude == null ? null : longitude.toPlainString());
        map.put("RegistrationStatus",        registrationStatus);
        map.put("OpenedDate",                openedDate == null ? null : openedDate.toString());
        map.put("CreatedAt",                 createdAt == null ? null : createdAt.toString());
        map.put("UpdatedAt",                 updatedAt == null ? null : updatedAt.toString());
        map.put("ClosedDate",                closedDate == null ? null : closedDate.toString());
        map.put("OSchangeOpenedtoClose",     osChangeOpenedToClose);
        map.put("OSchangeClosedtoOperational", osChangeClosedToOperational);
        map.put("PostorUpdate",              postOrUpdate);
        map.put("IsDesignated",              isDesignated == null ? null : isDesignated.toString());
        return map;
    }

    public static HfrFacility fromMap(Map<String, Object> map) {
        HfrFacility f = new HfrFacility();
        f.setFacIdNumber((String) map.get("Fac_IDNumber"));
        f.setName((String) map.get("Name"));
        f.setCommFacName((String) map.get("Comm_FacName"));
        f.setZone((String) map.get("Zone"));
        f.setRegionCode((String) map.get("Region_Code"));
        f.setRegion((String) map.get("region"));
        f.setDistrictCode((String) map.get("District_Code"));
        f.setDistrict((String) map.get("district"));
        f.setCouncilCode((String) map.get("Council_Code"));
        f.setCouncil((String) map.get("council"));
        f.setWard((String) map.get("ward"));
        f.setWardCode((String) map.get("ward_Code"));
        f.setVillage((String) map.get("village"));
        f.setVillageCode((String) map.get("Village_Code"));
        f.setFacilityTypeGroupCode((String) map.get("FacilityTypeGroupCode"));
        f.setFacilityTypeGroup((String) map.get("FacilityTypeGroup"));
        f.setFacilityTypeCode((String) map.get("FacilityTypeCode"));
        f.setFacilityType((String) map.get("FacilityType"));
        f.setVote((String) map.get("Vote"));
        f.setOwnershipGroupCode((String) map.get("OwnershipGroupCode"));
        f.setOwnershipGroup((String) map.get("OwnershipGroup"));
        f.setOwnershipCode((String) map.get("OwnershipCode"));
        f.setOwnership((String) map.get("Ownership"));
        f.setOperatingStatus((String) map.get("OperatingStatus"));

        String lat = (String) map.get("Latitude");
        if (lat != null) f.setLatitude(new java.math.BigDecimal(lat));

        String lon = (String) map.get("Longitude");
        if (lon != null) f.setLongitude(new java.math.BigDecimal(lon));

        f.setRegistrationStatus((String) map.get("RegistrationStatus"));

        String od = (String) map.get("OpenedDate");
        if (od != null && !od.isBlank()) f.setOpenedDate(java.time.LocalDate.parse(od));

        String cd = (String) map.get("ClosedDate");
        if (cd != null && !cd.isBlank()) f.setClosedDate(java.time.LocalDate.parse(cd));

        String cat = (String) map.get("CreatedAt");
        if (cat != null && !cat.isBlank()) f.setCreatedAt(java.time.LocalDateTime.parse(cat));

        String uat = (String) map.get("UpdatedAt");
        if (uat != null && !uat.isBlank()) f.setUpdatedAt(java.time.LocalDateTime.parse(uat));

        f.setOsChangeOpenedToClose((String) map.get("OSchangeOpenedtoClose"));
        f.setOsChangeClosedToOperational((String) map.get("OSchangeClosedtoOperational"));
        f.setPostOrUpdate((String) map.get("PostorUpdate"));

        String des = (String) map.get("IsDesignated");
        if (des != null) f.setIsDesignated(Boolean.valueOf(des));

        return f;
    }
}
