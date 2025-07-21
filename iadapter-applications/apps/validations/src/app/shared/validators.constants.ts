export const DATA_MODEL_DEFINITION_CONST = {
    "mrn": {
        "label": "Mrn",
        "type": "STRING",
        "path": "#{mrn}"
    },
    "facilityDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{facilityDetails.code}"
    },
    "facilityDetails.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{facilityDetails.name}"
    },
    "reportDetails.reportingDate": {
        "label": "Reporting Date",
        "type": "DATE",
        "path": "#{reportDetails.reportingDate}"
    },
    "demographicDetails.id": {
        "label": "Id",
        "type": "STRING",
        "path": "#{demographicDetails.id}"
    },
    "demographicDetails.firstName": {
        "label": "First Name",
        "type": "STRING",
        "path": "#{demographicDetails.firstName}"
    },
    "demographicDetails.middleName": {
        "label": "Middle Name",
        "type": "STRING",
        "path": "#{demographicDetails.middleName}"
    },
    "demographicDetails.lastName": {
        "label": "Last Name",
        "type": "STRING",
        "path": "#{demographicDetails.lastName}"
    },
    "demographicDetails.dateOfBirth": {
        "label": "Date Of Birth",
        "type": "DATE",
        "path": "#{demographicDetails.dateOfBirth}"
    },
    "demographicDetails.gender": {
        "label": "Gender",
        "type": "STRING",
        "path": "#{demographicDetails.gender}"
    },
    "demographicDetails.phoneNumbers[]": {
        "label": "Phone Numbers (Item)",
        "type": "STRING",
        "path": "#{demographicDetails.phoneNumbers[]}"
    },
    "demographicDetails.emails[]": {
        "label": "Emails (Item)",
        "type": "STRING",
        "path": "#{demographicDetails.emails[]}"
    },
    "demographicDetails.occupation": {
        "label": "Occupation",
        "type": "STRING",
        "path": "#{demographicDetails.occupation}"
    },
    "demographicDetails.maritalStatus": {
        "label": "Marital Status",
        "type": "STRING",
        "path": "#{demographicDetails.maritalStatus}"
    },
    "demographicDetails.nationality": {
        "label": "Nationality",
        "type": "STRING",
        "path": "#{demographicDetails.nationality}"
    },
    "demographicDetails.relatedClients[]": {
        "label": "Related Clients (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{demographicDetails.relatedClients[]}"
    },
    "visitDetails.id": {
        "label": "Id",
        "type": "STRING",
        "path": "#{visitDetails.id}"
    },
    "visitDetails.visitDate": {
        "label": "Visit Date",
        "type": "DATE",
        "path": "#{visitDetails.visitDate}"
    },
    "visitDetails.newThisYear": {
        "label": "New This Year",
        "type": "BOOLEAN",
        "path": "#{visitDetails.newThisYear}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "visitDetails.isNew": {
        "label": "Is New",
        "type": "BOOLEAN",
        "path": "#{visitDetails.isNew}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "visitDetails.closedDate": {
        "label": "Closed Date",
        "type": "DATE",
        "path": "#{visitDetails.closedDate}"
    },
    "visitDetails.visitType": {
        "label": "Visit Type",
        "type": "STRING",
        "path": "#{visitDetails.visitType}"
    },
    "visitDetails.serviceComplaints.providedComplaints": {
        "label": "Provided Complaints",
        "type": "BOOLEAN",
        "path": "#{visitDetails.serviceComplaints.providedComplaints}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "visitDetails.serviceComplaints.complaints": {
        "label": "Complaints",
        "type": "STRING",
        "path": "#{visitDetails.serviceComplaints.complaints}"
    },
    "visitDetails.referredIn": {
        "label": "Referred In",
        "type": "BOOLEAN",
        "path": "#{visitDetails.referredIn}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "visitDetails.disabled": {
        "label": "Disabled",
        "type": "BOOLEAN",
        "path": "#{visitDetails.disabled}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "lifeStyleInformation.smoking": {
        "label": "Smoking",
        "type": "MAP_OBJECT",
        "path": "#{lifeStyleInformation.smoking}"
    },
    "lifeStyleInformation.alcoholUse": {
        "label": "Alcohol Use",
        "type": "MAP_OBJECT",
        "path": "#{lifeStyleInformation.alcoholUse}"
    },
    "lifeStyleInformation.drugUse": {
        "label": "Drug Use",
        "type": "MAP_OBJECT",
        "path": "#{lifeStyleInformation.drugUse}"
    },
    "treatmentDetails.chemoTherapy[]": {
        "label": "Chemo Therapy (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{treatmentDetails.chemoTherapy[]}"
    },
    "treatmentDetails.radioTherapy[]": {
        "label": "Radio Therapy (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{treatmentDetails.radioTherapy[]}"
    },
    "treatmentDetails.palliativeCare[]": {
        "label": "Palliative Care (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{treatmentDetails.palliativeCare[]}"
    },
    "treatmentDetails.surgery[]": {
        "label": "Surgery (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{treatmentDetails.surgery[]}"
    },
    "treatmentDetails.hormoneTherapy[]": {
        "label": "Hormone Therapy (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{treatmentDetails.hormoneTherapy[]}"
    },
    "treatmentDetails.symptomatic": {
        "label": "Symptomatic",
        "type": "STRING",
        "path": "#{treatmentDetails.symptomatic}"
    },
    "treatmentDetails.alternativeTreatment": {
        "label": "Alternative Treatment",
        "type": "STRING",
        "path": "#{treatmentDetails.alternativeTreatment}"
    },
    "eyeClinicDetails.refracted": {
        "label": "Refracted",
        "type": "BOOLEAN",
        "path": "#{eyeClinicDetails.refracted}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "eyeClinicDetails.spectaclesPrescribed": {
        "label": "Spectacles Prescribed",
        "type": "BOOLEAN",
        "path": "#{eyeClinicDetails.spectaclesPrescribed}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "eyeClinicDetails.spectacleDispensed": {
        "label": "Spectacle Dispensed",
        "type": "BOOLEAN",
        "path": "#{eyeClinicDetails.spectacleDispensed}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "eyeClinicDetails.contactLenseDispensed": {
        "label": "Contact Lense Dispensed",
        "type": "BOOLEAN",
        "path": "#{eyeClinicDetails.contactLenseDispensed}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "eyeClinicDetails.prescribedWithLowVision": {
        "label": "Prescribed With Low Vision",
        "type": "BOOLEAN",
        "path": "#{eyeClinicDetails.prescribedWithLowVision}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "eyeClinicDetails.isDispensedWithLowVisionDevice": {
        "label": "Is Dispensed With Low Vision Device",
        "type": "BOOLEAN",
        "path": "#{eyeClinicDetails.isDispensedWithLowVisionDevice}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "admissionDetails.admissionDate": {
        "label": "Admission Date",
        "type": "DATE",
        "path": "#{admissionDetails.admissionDate}"
    },
    "admissionDetails.admissionDiagnosis": {
        "label": "Admission Diagnosis",
        "type": "STRING",
        "path": "#{admissionDetails.admissionDiagnosis}"
    },
    "admissionDetails.dischargedOn": {
        "label": "Discharged On",
        "type": "STRING",
        "path": "#{admissionDetails.dischargedOn}"
    },
    "admissionDetails.dischargeStatus": {
        "label": "Discharge Status",
        "type": "STRING",
        "path": "#{admissionDetails.dischargeStatus}"
    },
    "outcomeDetails.isAlive": {
        "label": "Is Alive",
        "type": "BOOLEAN",
        "path": "#{outcomeDetails.isAlive}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "outcomeDetails.deathLocation": {
        "label": "Death Location",
        "type": "STRING",
        "path": "#{outcomeDetails.deathLocation}"
    },
    "outcomeDetails.deathDate": {
        "label": "Death Date",
        "type": "DATE",
        "path": "#{outcomeDetails.deathDate}"
    },
    "outcomeDetails.contactTracing": {
        "label": "Contact Tracing",
        "type": "BOOLEAN",
        "path": "#{outcomeDetails.contactTracing}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "outcomeDetails.investigationConducted": {
        "label": "Investigation Conducted",
        "type": "BOOLEAN",
        "path": "#{outcomeDetails.investigationConducted}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "outcomeDetails.quarantined": {
        "label": "Quarantined",
        "type": "BOOLEAN",
        "path": "#{outcomeDetails.quarantined}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "outcomeDetails.referred": {
        "label": "Referred",
        "type": "BOOLEAN",
        "path": "#{outcomeDetails.referred}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "causesOfDeathDetails.dateOfDeath": {
        "label": "Date Of Death",
        "type": "DATE",
        "path": "#{causesOfDeathDetails.dateOfDeath}"
    },
    "causesOfDeathDetails.lineA": {
        "label": "Line A",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.lineA}"
    },
    "causesOfDeathDetails.lineB": {
        "label": "Line B",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.lineB}"
    },
    "causesOfDeathDetails.lineC": {
        "label": "Line C",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.lineC}"
    },
    "causesOfDeathDetails.lineD": {
        "label": "Line D",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.lineD}"
    },
    "causesOfDeathDetails.causeOfDeathOther": {
        "label": "Cause Of Death Other",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.causeOfDeathOther}"
    },
    "causesOfDeathDetails.mannerOfDeath": {
        "label": "Manner Of Death",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.mannerOfDeath}"
    },
    "causesOfDeathDetails.placeOfDeath": {
        "label": "Place Of Death",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.placeOfDeath}"
    },
    "causesOfDeathDetails.otherDeathDetails.postmortemDetails": {
        "label": "Postmortem Details",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.otherDeathDetails.postmortemDetails}"
    },
    "causesOfDeathDetails.otherDeathDetails.marcerated": {
        "label": "Marcerated",
        "type": "BOOLEAN",
        "path": "#{causesOfDeathDetails.otherDeathDetails.marcerated}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "causesOfDeathDetails.otherDeathDetails.fresh": {
        "label": "Fresh",
        "type": "BOOLEAN",
        "path": "#{causesOfDeathDetails.otherDeathDetails.fresh}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "causesOfDeathDetails.otherDeathDetails.motherCondition": {
        "label": "Mother Condition",
        "type": "STRING",
        "path": "#{causesOfDeathDetails.otherDeathDetails.motherCondition}"
    },
    "antenatalCareDetails.date": {
        "label": "Date",
        "type": "DATE",
        "path": "#{antenatalCareDetails.date}"
    },
    "antenatalCareDetails.pregnancyAgeInWeeks": {
        "label": "Pregnancy Age In Weeks",
        "type": "NUMBER",
        "path": "#{antenatalCareDetails.pregnancyAgeInWeeks}"
    },
    "antenatalCareDetails.positiveHivStatusBeforeService": {
        "label": "Positive Hiv Status Before Service",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.positiveHivStatusBeforeService}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.referredToCTC": {
        "label": "Referred To CTC",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.referredToCTC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.gravidity": {
        "label": "Gravidity",
        "type": "NUMBER",
        "path": "#{antenatalCareDetails.gravidity}"
    },
    "antenatalCareDetails.hivDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{antenatalCareDetails.hivDetails.code}"
    },
    "antenatalCareDetails.hivDetails.hivTestNumber": {
        "label": "Hiv Test Number",
        "type": "NUMBER",
        "path": "#{antenatalCareDetails.hivDetails.hivTestNumber}"
    },
    "antenatalCareDetails.syphilisDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{antenatalCareDetails.syphilisDetails.code}"
    },
    "antenatalCareDetails.syphilisDetails.providedWithTreatment": {
        "label": "Provided With Treatment",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.syphilisDetails.providedWithTreatment}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.spouseDetails.hivDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{antenatalCareDetails.spouseDetails.hivDetails.code}"
    },
    "antenatalCareDetails.spouseDetails.hivDetails.hivTestNumber": {
        "label": "Hiv Test Number",
        "type": "NUMBER",
        "path": "#{antenatalCareDetails.spouseDetails.hivDetails.hivTestNumber}"
    },
    "antenatalCareDetails.spouseDetails.syphilisDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{antenatalCareDetails.spouseDetails.syphilisDetails.code}"
    },
    "antenatalCareDetails.spouseDetails.syphilisDetails.providedWithTreatment": {
        "label": "Provided With Treatment",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.spouseDetails.syphilisDetails.providedWithTreatment}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.spouseDetails.hepatitisB.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{antenatalCareDetails.spouseDetails.hepatitisB.code}"
    },
    "antenatalCareDetails.spouseDetails.hepatitisB.providedWithTreatment": {
        "label": "Provided With Treatment",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.spouseDetails.hepatitisB.providedWithTreatment}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.spouseDetails.diagnosedWithOtherSTDs": {
        "label": "Diagnosed With Other STDs",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.spouseDetails.diagnosedWithOtherSTDs}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.spouseDetails.providedWithTreatmentForOtherSTDs": {
        "label": "Provided With Treatment For Other STDs",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.spouseDetails.providedWithTreatmentForOtherSTDs}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.spouseDetails.otherSpouseDetails[]": {
        "label": "Other Spouse Details (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{antenatalCareDetails.spouseDetails.otherSpouseDetails[]}"
    },
    "antenatalCareDetails.otherSpouseDetails[]": {
        "label": "Other Spouse Details (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{antenatalCareDetails.otherSpouseDetails[]}"
    },
    "antenatalCareDetails.lastAncVisitDate": {
        "label": "Last Anc Visit Date",
        "type": "DATE",
        "path": "#{antenatalCareDetails.lastAncVisitDate}"
    },
    "antenatalCareDetails.referredIn": {
        "label": "Referred In",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.referredIn}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.referredOut": {
        "label": "Referred Out",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.referredOut}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.providedWithHivCounsellingBeforeLabTest": {
        "label": "Provided With Hiv Counselling Before Lab Test",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.providedWithHivCounsellingBeforeLabTest}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.providedWithHivCounsellingAfterLabTest": {
        "label": "Provided With Hiv Counselling After Lab Test",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.providedWithHivCounsellingAfterLabTest}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.prophylaxis.providedWithLLIN": {
        "label": "Provided With LLIN",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.prophylaxis.providedWithLLIN}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.prophylaxis.providedWithIPT2": {
        "label": "Provided With IPT2",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.prophylaxis.providedWithIPT2}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.prophylaxis.providedWithIPT3": {
        "label": "Provided With IPT3",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.prophylaxis.providedWithIPT3}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.prophylaxis.providedWithIPT4": {
        "label": "Provided With IPT4",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.prophylaxis.providedWithIPT4}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.prophylaxis.providedWithMebendazoleOrAlbendazole": {
        "label": "Provided With Mebendazole Or Albendazole",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.prophylaxis.providedWithMebendazoleOrAlbendazole}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.prophylaxis.providedWithIFFolic60Tablets": {
        "label": "Provided With IFFolic60Tablets",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.prophylaxis.providedWithIFFolic60Tablets}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.diagnosedWithOtherSTDs": {
        "label": "Diagnosed With Other STDs",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.diagnosedWithOtherSTDs}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "antenatalCareDetails.providedWithTreatmentForOtherSTDs": {
        "label": "Provided With Treatment For Other STDs",
        "type": "BOOLEAN",
        "path": "#{antenatalCareDetails.providedWithTreatmentForOtherSTDs}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.date": {
        "label": "Date",
        "type": "DATE",
        "path": "#{laborAndDeliveryDetails.date}"
    },
    "laborAndDeliveryDetails.deliveryMethod": {
        "label": "Delivery Method",
        "type": "MAP_OBJECT",
        "path": "#{laborAndDeliveryDetails.deliveryMethod}"
    },
    "laborAndDeliveryDetails.timeBetweenLaborPainAndDeliveryInHrs": {
        "label": "Time Between Labor Pain And Delivery In Hrs",
        "type": "NUMBER",
        "path": "#{laborAndDeliveryDetails.timeBetweenLaborPainAndDeliveryInHrs}"
    },
    "laborAndDeliveryDetails.isAttendantSkilled": {
        "label": "Is Attendant Skilled",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.isAttendantSkilled}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.providedWithFamilyPlanningCounseling": {
        "label": "Provided With Family Planning Counseling",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.providedWithFamilyPlanningCounseling}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.providedWithInfantFeedingCounseling": {
        "label": "Provided With Infant Feeding Counseling",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.providedWithInfantFeedingCounseling}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.emoc.providedAntibiotic": {
        "label": "Provided Antibiotic",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.emoc.providedAntibiotic}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.emoc.providedUterotonic": {
        "label": "Provided Uterotonic",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.emoc.providedUterotonic}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.emoc.providedMagnesiumSulphate": {
        "label": "Provided Magnesium Sulphate",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.emoc.providedMagnesiumSulphate}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.emoc.removedPlacenta": {
        "label": "Removed Placenta",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.emoc.removedPlacenta}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.emoc.performedMvaOrDc": {
        "label": "Performed Mva Or Dc",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.emoc.performedMvaOrDc}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.emoc.administeredBlood": {
        "label": "Administered Blood",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.emoc.administeredBlood}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.amstl.cordTractionUsed": {
        "label": "Cord Traction Used",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.amstl.cordTractionUsed}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.amstl.uterineMassageDone": {
        "label": "Uterine Massage Done",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.amstl.uterineMassageDone}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.amstl.administeredOxytocin": {
        "label": "Administered Oxytocin",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.amstl.administeredOxytocin}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.amstl.administeredEgometrine": {
        "label": "Administered Egometrine",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.amstl.administeredEgometrine}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.amstl.administeredMisoprostol": {
        "label": "Administered Misoprostol",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.others.amstl.administeredMisoprostol}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.others.familyPlanning[]": {
        "label": "Family Planning (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{laborAndDeliveryDetails.others.familyPlanning[]}"
    },
    "laborAndDeliveryDetails.hasComeWithSpouse": {
        "label": "Has Come With Spouse",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.hasComeWithSpouse}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.hasComeWithCompanion": {
        "label": "Has Come With Companion",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.hasComeWithCompanion}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.pregnancyAgeInWeeks": {
        "label": "Pregnancy Age In Weeks",
        "type": "NUMBER",
        "path": "#{laborAndDeliveryDetails.pregnancyAgeInWeeks}"
    },
    "laborAndDeliveryDetails.wasProvidedWithAntenatalCorticosteroid": {
        "label": "Was Provided With Antenatal Corticosteroid",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.wasProvidedWithAntenatalCorticosteroid}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.hasHistoryOfFGM": {
        "label": "Has History Of FGM",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.hasHistoryOfFGM}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.hivDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{laborAndDeliveryDetails.hivDetails.code}"
    },
    "laborAndDeliveryDetails.hivDetails.hivTestNumber": {
        "label": "Hiv Test Number",
        "type": "NUMBER",
        "path": "#{laborAndDeliveryDetails.hivDetails.hivTestNumber}"
    },
    "laborAndDeliveryDetails.hivDetails.referredToCTC": {
        "label": "Referred To CTC",
        "type": "BOOLEAN",
        "path": "#{laborAndDeliveryDetails.hivDetails.referredToCTC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "laborAndDeliveryDetails.hivDetails.ancHivStatus.numberOfTestTaken": {
        "label": "Number Of Test Taken",
        "type": "NUMBER",
        "path": "#{laborAndDeliveryDetails.hivDetails.ancHivStatus.numberOfTestTaken}"
    },
    "postnatalDetails.date": {
        "label": "Date",
        "type": "DATE",
        "path": "#{postnatalDetails.date}"
    },
    "postnatalDetails.positiveHivStatusBeforeService": {
        "label": "Positive Hiv Status Before Service",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.positiveHivStatusBeforeService}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.hivDetails.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{postnatalDetails.hivDetails.code}"
    },
    "postnatalDetails.hivDetails.hivTestNumber": {
        "label": "Hiv Test Number",
        "type": "NUMBER",
        "path": "#{postnatalDetails.hivDetails.hivTestNumber}"
    },
    "postnatalDetails.referredToCTC": {
        "label": "Referred To CTC",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.referredToCTC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.prophylaxis.providedWithAntenatalCorticosteroids": {
        "label": "Provided With Antenatal Corticosteroids",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.prophylaxis.providedWithAntenatalCorticosteroids}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.prophylaxis.provideWithVitaminA": {
        "label": "Provide With Vitamin A",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.prophylaxis.provideWithVitaminA}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.prophylaxis.providedWithFEFO": {
        "label": "Provided With FEFO",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.prophylaxis.providedWithFEFO}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.referredToClinicForFurtherServices": {
        "label": "Referred To Clinic For Further Services",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.referredToClinicForFurtherServices}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.daysSinceDelivery": {
        "label": "Days Since Delivery",
        "type": "NUMBER",
        "path": "#{postnatalDetails.daysSinceDelivery}"
    },
    "postnatalDetails.outCome": {
        "label": "Out Come",
        "type": "STRING",
        "path": "#{postnatalDetails.outCome}"
    },
    "postnatalDetails.APGARScore": {
        "label": "APGARScore",
        "type": "NUMBER",
        "path": "#{postnatalDetails.APGARScore}"
    },
    "postnatalDetails.breastFeedingDetails": {
        "label": "Breast Feeding Details",
        "type": "MAP_OBJECT",
        "path": "#{postnatalDetails.breastFeedingDetails}"
    },
    "postnatalDetails.demagedNipples.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{postnatalDetails.demagedNipples.code}"
    },
    "postnatalDetails.demagedNipples.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{postnatalDetails.demagedNipples.name}"
    },
    "postnatalDetails.demagedNipples.provided": {
        "label": "Provided",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.demagedNipples.provided}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.mastitis.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{postnatalDetails.mastitis.code}"
    },
    "postnatalDetails.mastitis.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{postnatalDetails.mastitis.name}"
    },
    "postnatalDetails.mastitis.provided": {
        "label": "Provided",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.mastitis.provided}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.breastAbscess.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{postnatalDetails.breastAbscess.code}"
    },
    "postnatalDetails.breastAbscess.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{postnatalDetails.breastAbscess.name}"
    },
    "postnatalDetails.breastAbscess.provided": {
        "label": "Provided",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.breastAbscess.provided}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.fistula.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{postnatalDetails.fistula.code}"
    },
    "postnatalDetails.fistula.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{postnatalDetails.fistula.name}"
    },
    "postnatalDetails.fistula.provided": {
        "label": "Provided",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.fistula.provided}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.puerperalPsychosis.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{postnatalDetails.puerperalPsychosis.code}"
    },
    "postnatalDetails.puerperalPsychosis.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{postnatalDetails.puerperalPsychosis.name}"
    },
    "postnatalDetails.puerperalPsychosis.provided": {
        "label": "Provided",
        "type": "BOOLEAN",
        "path": "#{postnatalDetails.puerperalPsychosis.provided}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "postnatalDetails.otherServices[]": {
        "label": "Other Services (Item)",
        "type": "GENERIC_OBJECT",
        "path": "#{postnatalDetails.otherServices[]}"
    },
    "familyPlanningDetails.date": {
        "label": "Date",
        "type": "DATE",
        "path": "#{familyPlanningDetails.date}"
    },
    "familyPlanningDetails.positiveHivStatusBeforeService": {
        "label": "Positive Hiv Status Before Service",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.positiveHivStatusBeforeService}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.wasCounselled": {
        "label": "Was Counselled",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.wasCounselled}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.hasComeWithSpouse": {
        "label": "Has Come With Spouse",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.hasComeWithSpouse}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.referred": {
        "label": "Referred",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.referred}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms": {
        "label": "Found With Breast Cancer Symptoms",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.cancerScreeningDetails.breastCancer.screened": {
        "label": "Screened",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.cancerScreeningDetails.breastCancer.screened}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.hivStatus.referredToCTC": {
        "label": "Referred To CTC",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.hivStatus.referredToCTC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.spouseHivStatus.referredToCTC": {
        "label": "Referred To CTC",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.spouseHivStatus.referredToCTC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.breastFeeding": {
        "label": "Breast Feeding",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.breastFeeding}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.sideEffects.bleeding": {
        "label": "Bleeding",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.sideEffects.bleeding}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.sideEffects.headache": {
        "label": "Headache",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.sideEffects.headache}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "familyPlanningDetails.sideEffects.gotPregnancy": {
        "label": "Got Pregnancy",
        "type": "BOOLEAN",
        "path": "#{familyPlanningDetails.sideEffects.gotPregnancy}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "childHealthDetails.motherAge": {
        "label": "Mother Age",
        "type": "NUMBER",
        "path": "#{childHealthDetails.motherAge}"
    },
    "childHealthDetails.prophylaxis.albendazole.administered": {
        "label": "Administered",
        "type": "BOOLEAN",
        "path": "#{childHealthDetails.prophylaxis.albendazole.administered}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "childHealthDetails.prophylaxis.vitaminA.administered": {
        "label": "Administered",
        "type": "BOOLEAN",
        "path": "#{childHealthDetails.prophylaxis.vitaminA.administered}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "childHealthDetails.prophylaxis.providedWithLLIN": {
        "label": "Provided With LLIN",
        "type": "BOOLEAN",
        "path": "#{childHealthDetails.prophylaxis.providedWithLLIN}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "childHealthDetails.providedWithInfantFeedingCounselling": {
        "label": "Provided With Infant Feeding Counselling",
        "type": "BOOLEAN",
        "path": "#{childHealthDetails.providedWithInfantFeedingCounselling}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "childHealthDetails.hasBeenBreastFedFor24Month": {
        "label": "Has Been Breast Fed For24Month",
        "type": "BOOLEAN",
        "path": "#{childHealthDetails.hasBeenBreastFedFor24Month}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "childHealthDetails.motherHivStatus.testingDate": {
        "label": "Testing Date",
        "type": "DATE",
        "path": "#{childHealthDetails.motherHivStatus.testingDate}"
    },
    "childHealthDetails.referredToCTC": {
        "label": "Referred To CTC",
        "type": "BOOLEAN",
        "path": "#{childHealthDetails.referredToCTC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.pregnancyAgeInWeeks": {
        "label": "Pregnancy Age In Weeks",
        "type": "NUMBER",
        "path": "#{cpacDetails.pregnancyAgeInWeeks}"
    },
    "cpacDetails.positiveHIVStatusBeforeAbortion": {
        "label": "Positive HIVStatus Before Abortion",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.positiveHIVStatusBeforeAbortion}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionsMedications.providedWithAntibiotics": {
        "label": "Provided With Antibiotics",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionsMedications.providedWithAntibiotics}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionsMedications.providedWithPainKillers": {
        "label": "Provided With Pain Killers",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionsMedications.providedWithPainKillers}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionsMedications.providedWithOxytocin": {
        "label": "Provided With Oxytocin",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionsMedications.providedWithOxytocin}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionsMedications.providedWithMisoprostol": {
        "label": "Provided With Misoprostol",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionsMedications.providedWithMisoprostol}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionsMedications.providedWithIvInfusion": {
        "label": "Provided With Iv Infusion",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionsMedications.providedWithIvInfusion}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionCounselling.providedWithSTDsPreventionCounselling": {
        "label": "Provided With STDs Prevention Counselling",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionCounselling.providedWithSTDsPreventionCounselling}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionCounselling.providedWithHIVCounselling": {
        "label": "Provided With HIVCounselling",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionCounselling.providedWithHIVCounselling}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.postAbortionCounselling.providedWithFamilyPlanningCounselling": {
        "label": "Provided With Family Planning Counselling",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.postAbortionCounselling.providedWithFamilyPlanningCounselling}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.didReceiveOralPillsPOP": {
        "label": "Did Receive Oral Pills POP",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.didReceiveOralPillsPOP}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.popCyclesProvided": {
        "label": "Pop Cycles Provided",
        "type": "NUMBER",
        "path": "#{cpacDetails.contraceptives.popCyclesProvided}"
    },
    "cpacDetails.contraceptives.didReceiveOralPillsCOC": {
        "label": "Did Receive Oral Pills COC",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.didReceiveOralPillsCOC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.cocCyclesProvided": {
        "label": "Coc Cycles Provided",
        "type": "NUMBER",
        "path": "#{cpacDetails.contraceptives.cocCyclesProvided}"
    },
    "cpacDetails.contraceptives.didReceivePillCycles": {
        "label": "Did Receive Pill Cycles",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.didReceivePillCycles}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.wasInsertedWithImplanon": {
        "label": "Was Inserted With Implanon",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.wasInsertedWithImplanon}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.wasInsertedWithJadelle": {
        "label": "Was Inserted With Jadelle",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.wasInsertedWithJadelle}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.didReceiveIUD": {
        "label": "Did Receive IUD",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.didReceiveIUD}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.didHaveTubalLigation": {
        "label": "Did Have Tubal Ligation",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.didHaveTubalLigation}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.didReceiveInjection": {
        "label": "Did Receive Injection",
        "type": "BOOLEAN",
        "path": "#{cpacDetails.contraceptives.didReceiveInjection}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cpacDetails.contraceptives.numberOfFemaleCondomsProvided": {
        "label": "Number Of Female Condoms Provided",
        "type": "NUMBER",
        "path": "#{cpacDetails.contraceptives.numberOfFemaleCondomsProvided}"
    },
    "cpacDetails.contraceptives.numberOfMaleCondomsProvided": {
        "label": "Number Of Male Condoms Provided",
        "type": "NUMBER",
        "path": "#{cpacDetails.contraceptives.numberOfMaleCondomsProvided}"
    },
    "cecap.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms": {
        "label": "Found With Breast Cancer Symptoms",
        "type": "BOOLEAN",
        "path": "#{cecap.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "cecap.cancerScreeningDetails.breastCancer.screened": {
        "label": "Screened",
        "type": "BOOLEAN",
        "path": "#{cecap.cancerScreeningDetails.breastCancer.screened}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didReceiveOralPillsPOP": {
        "label": "Did Receive Oral Pills POP",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didReceiveOralPillsPOP}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.popCyclesProvided": {
        "label": "Pop Cycles Provided",
        "type": "NUMBER",
        "path": "#{contraceptives.popCyclesProvided}"
    },
    "contraceptives.didReceiveOralPillsCOC": {
        "label": "Did Receive Oral Pills COC",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didReceiveOralPillsCOC}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.cocCyclesProvided": {
        "label": "Coc Cycles Provided",
        "type": "NUMBER",
        "path": "#{contraceptives.cocCyclesProvided}"
    },
    "contraceptives.didReceivePillCycles": {
        "label": "Did Receive Pill Cycles",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didReceivePillCycles}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.wasInsertedWithImplanon": {
        "label": "Was Inserted With Implanon",
        "type": "BOOLEAN",
        "path": "#{contraceptives.wasInsertedWithImplanon}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.wasInsertedWithJadelle": {
        "label": "Was Inserted With Jadelle",
        "type": "BOOLEAN",
        "path": "#{contraceptives.wasInsertedWithJadelle}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didReceiveIUD": {
        "label": "Did Receive IUD",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didReceiveIUD}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didHaveTubalLigation": {
        "label": "Did Have Tubal Ligation",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didHaveTubalLigation}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didReceiveInjection": {
        "label": "Did Receive Injection",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didReceiveInjection}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.numberOfFemaleCondomsProvided": {
        "label": "Number Of Female Condoms Provided",
        "type": "NUMBER",
        "path": "#{contraceptives.numberOfFemaleCondomsProvided}"
    },
    "contraceptives.numberOfMaleCondomsProvided": {
        "label": "Number Of Male Condoms Provided",
        "type": "NUMBER",
        "path": "#{contraceptives.numberOfMaleCondomsProvided}"
    },
    "contraceptives.didReceiveSDM": {
        "label": "Did Receive SDM",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didReceiveSDM}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didUseLAM": {
        "label": "Did Use LAM",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didUseLAM}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didOptToUseEmergencyMethods": {
        "label": "Did Opt To Use Emergency Methods",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didOptToUseEmergencyMethods}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didRemoveIUD": {
        "label": "Did Remove IUD",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didRemoveIUD}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didRemoveImplanon": {
        "label": "Did Remove Implanon",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didRemoveImplanon}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didRemoveJadelle": {
        "label": "Did Remove Jadelle",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didRemoveJadelle}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "contraceptives.didHaveVasectomy": {
        "label": "Did Have Vasectomy",
        "type": "BOOLEAN",
        "path": "#{contraceptives.didHaveVasectomy}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "visitMainPaymentDetails.shortName": {
        "label": "Short Name",
        "type": "STRING",
        "path": "#{visitMainPaymentDetails.shortName}"
    },
    "visitMainPaymentDetails.type": {
        "label": "Type",
        "type": "STRING",
        "path": "#{visitMainPaymentDetails.type}"
    },
    "visitMainPaymentDetails.insuranceCode": {
        "label": "Insurance Code",
        "type": "STRING",
        "path": "#{visitMainPaymentDetails.insuranceCode}"
    },
    "visitMainPaymentDetails.name": {
        "label": "Name",
        "type": "STRING",
        "path": "#{visitMainPaymentDetails.name}"
    },
    "visitMainPaymentDetails.insuranceId": {
        "label": "Insurance Id",
        "type": "STRING",
        "path": "#{visitMainPaymentDetails.insuranceId}"
    },
    "referralDetails.referralDate": {
        "label": "Referral Date",
        "type": "DATE",
        "path": "#{referralDetails.referralDate}"
    },
    "referralDetails.hfrCode": {
        "label": "Hfr Code",
        "type": "STRING",
        "path": "#{referralDetails.hfrCode}"
    },
    "referralDetails.facility": {
        "label": "Facility",
        "type": "STRING",
        "path": "#{referralDetails.facility}"
    },
    "referralDetails.reason[]": {
        "label": "Reason (Item)",
        "type": "STRING",
        "path": "#{referralDetails.reason[]}"
    },
    "referralDetails.referralNumber": {
        "label": "Referral Number",
        "type": "STRING",
        "path": "#{referralDetails.referralNumber}"
    },
    "referralDetails.referringClinician": {
        "label": "Referring Clinician",
        "type": "MAP_OBJECT",
        "path": "#{referralDetails.referringClinician}"
    },
    "referralDetails.referredToOtherCountry": {
        "label": "Referred To Other Country",
        "type": "BOOLEAN",
        "path": "#{referralDetails.referredToOtherCountry}",
        "options": [
            {
                "label": "True",
                "value": true
            },
            {
                "label": "False",
                "value": false
            }
        ]
    },
    "otherInformation.cancerScreening.date": {
        "label": "Date",
        "type": "DATE",
        "path": "#{otherInformation.cancerScreening.date}"
    },
    "otherInformation.cancerScreening.method": {
        "label": "Method",
        "type": "STRING",
        "path": "#{otherInformation.cancerScreening.method}"
    },
    "otherInformation.cancerScreening.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{otherInformation.cancerScreening.code}"
    },
    "otherInformation.cancerScreening.results.date": {
        "label": "Date",
        "type": "DATE",
        "path": "#{otherInformation.cancerScreening.results.date}"
    },
    "otherInformation.cancerScreening.results.value": {
        "label": "Value",
        "type": "STRING",
        "path": "#{otherInformation.cancerScreening.results.value}"
    },
    "otherInformation.cancerScreening.results.code": {
        "label": "Code",
        "type": "STRING",
        "path": "#{otherInformation.cancerScreening.results.code}"
    }
}

export const DISPLAY_DATA_TEMPLATE = [
    {
      title: 'demographicDetails',
      key: 'demographicDetails',
      children: [
        {
          title: 'mrn',
          key: 'demographicDetails.mrn',
          isLeaf: true,
        },
        {
          title: 'firstName',
          key: 'demographicDetails.firstName',
          isLeaf: true,
        },
        {
          title: 'middleName',
          key: 'demographicDetails.middleName',
          isLeaf: true,
        },
        {
          title: 'lastName',
          key: 'demographicDetails.lastName',
          isLeaf: true,
        },
        {
          title: 'dateOfBirth',
          key: 'demographicDetails.dateOfBirth',
          isLeaf: true,
        },
        {
          title: 'gender',
          key: 'demographicDetails.gender',
          isLeaf: true,
        },
        {
          title: 'phoneNumbers',
          key: 'demographicDetails.phoneNumbers',
          children: [
            {
              title: '0',
              key: 'demographicDetails.phoneNumbers.0',
              isLeaf: true,
            },
            {
              title: '1',
              key: 'demographicDetails.phoneNumbers.1',
              isLeaf: true,
            },
            {
              title: '2',
              key: 'demographicDetails.phoneNumbers.2',
              isLeaf: true,
            },
            {
              title: '3',
              key: 'demographicDetails.phoneNumbers.3',
              isLeaf: true,
            },
            {
              title: '4',
              key: 'demographicDetails.phoneNumbers.4',
              isLeaf: true,
            },
            {
              title: '5',
              key: 'demographicDetails.phoneNumbers.5',
              isLeaf: true,
            },
            {
              title: '6',
              key: 'demographicDetails.phoneNumbers.6',
              isLeaf: true,
            },
            {
              title: '7',
              key: 'demographicDetails.phoneNumbers.7',
              isLeaf: true,
            },
            {
              title: '8',
              key: 'demographicDetails.phoneNumbers.8',
              isLeaf: true,
            },
            {
              title: '9',
              key: 'demographicDetails.phoneNumbers.9',
              isLeaf: true,
            },
            {
              title: '10',
              key: 'demographicDetails.phoneNumbers.10',
              isLeaf: true,
            },
            {
              title: '11',
              key: 'demographicDetails.phoneNumbers.11',
              isLeaf: true,
            },
            {
              title: '12',
              key: 'demographicDetails.phoneNumbers.12',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'emails',
          key: 'demographicDetails.emails',
          children: [
            {
              title: '0',
              key: 'demographicDetails.emails.0',
              isLeaf: true,
            },
            {
              title: '1',
              key: 'demographicDetails.emails.1',
              isLeaf: true,
            },
            {
              title: '2',
              key: 'demographicDetails.emails.2',
              isLeaf: true,
            },
            {
              title: '3',
              key: 'demographicDetails.emails.3',
              isLeaf: true,
            },
            {
              title: '4',
              key: 'demographicDetails.emails.4',
              isLeaf: true,
            },
            {
              title: '5',
              key: 'demographicDetails.emails.5',
              isLeaf: true,
            },
            {
              title: '6',
              key: 'demographicDetails.emails.6',
              isLeaf: true,
            },
            {
              title: '7',
              key: 'demographicDetails.emails.7',
              isLeaf: true,
            },
            {
              title: '8',
              key: 'demographicDetails.emails.8',
              isLeaf: true,
            },
            {
              title: '9',
              key: 'demographicDetails.emails.9',
              isLeaf: true,
            },
            {
              title: '10',
              key: 'demographicDetails.emails.10',
              isLeaf: true,
            },
            {
              title: '11',
              key: 'demographicDetails.emails.11',
              isLeaf: true,
            },
            {
              title: '12',
              key: 'demographicDetails.emails.12',
              isLeaf: true,
            },
            {
              title: '13',
              key: 'demographicDetails.emails.13',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'occupation',
          key: 'demographicDetails.occupation',
          isLeaf: true,
        },
        {
          title: 'maritalStatus',
          key: 'demographicDetails.maritalStatus',
          isLeaf: true,
        },
        {
          title: 'nationality',
          key: 'demographicDetails.nationality',
          isLeaf: true,
        },
        {
          title: 'addresses',
          key: 'demographicDetails.addresses',
          children: [
            {
              title: 'village',
              key: 'demographicDetails.addresses.village',
              isLeaf: true,
            },
            {
              title: 'ward',
              key: 'demographicDetails.addresses.ward',
              isLeaf: true,
            },
            {
              title: 'district',
              key: 'demographicDetails.addresses.district',
              isLeaf: true,
            },
            {
              title: 'region',
              key: 'demographicDetails.addresses.region',
              isLeaf: true,
            },
            {
              title: 'country',
              key: 'demographicDetails.addresses.country',
              isLeaf: true,
            },
            {
              title: 'category',
              key: 'demographicDetails.addresses.category',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'identifiers',
          key: 'demographicDetails.identifiers',
          children: [
            {
              title: 'type',
              key: 'demographicDetails.identifiers.type',
              isLeaf: true,
            },
            {
              title: 'id',
              key: 'demographicDetails.identifiers.id',
              isLeaf: true,
            },
            {
              title: 'preferred',
              key: 'demographicDetails.identifiers.preferred',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'contactPeople',
          key: 'demographicDetails.contactPeople',
          children: [
            {
              title: 'firstName',
              key: 'demographicDetails.contactPeople.firstName',
              isLeaf: true,
            },
            {
              title: 'lastName',
              key: 'demographicDetails.contactPeople.lastName',
              isLeaf: true,
            },
            {
              title: 'phoneNumbers',
              key: 'demographicDetails.contactPeople.phoneNumbers',
              children: [
                {
                  title: '0',
                  key: 'demographicDetails.contactPeople.phoneNumbers.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'demographicDetails.contactPeople.phoneNumbers.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'demographicDetails.contactPeople.phoneNumbers.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'demographicDetails.contactPeople.phoneNumbers.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'demographicDetails.contactPeople.phoneNumbers.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'demographicDetails.contactPeople.phoneNumbers.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'demographicDetails.contactPeople.phoneNumbers.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'demographicDetails.contactPeople.phoneNumbers.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'demographicDetails.contactPeople.phoneNumbers.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'demographicDetails.contactPeople.phoneNumbers.9',
                  isLeaf: true,
                },
                {
                  title: '10',
                  key: 'demographicDetails.contactPeople.phoneNumbers.10',
                  isLeaf: true,
                },
                {
                  title: '11',
                  key: 'demographicDetails.contactPeople.phoneNumbers.11',
                  isLeaf: true,
                },
                {
                  title: '12',
                  key: 'demographicDetails.contactPeople.phoneNumbers.12',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'relationShip',
              key: 'demographicDetails.contactPeople.relationShip',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'paymentDetails',
          key: 'demographicDetails.paymentDetails',
          children: [
            {
              title: 'shortName',
              key: 'demographicDetails.paymentDetails.shortName',
              isLeaf: true,
            },
            {
              title: 'type',
              key: 'demographicDetails.paymentDetails.type',
              isLeaf: true,
            },
            {
              title: 'insuranceCode',
              key: 'demographicDetails.paymentDetails.insuranceCode',
              isLeaf: true,
            },
            {
              title: 'name',
              key: 'demographicDetails.paymentDetails.name',
              isLeaf: true,
            },
            {
              title: 'insuranceId',
              key: 'demographicDetails.paymentDetails.insuranceId',
              isLeaf: true,
            },
            {
              title: 'policyNumber',
              key: 'demographicDetails.paymentDetails.policyNumber',
              isLeaf: true,
            },
            {
              title: 'groupNumber',
              key: 'demographicDetails.paymentDetails.groupNumber',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'visitDetails',
      key: 'visitDetails',
      children: [
        {
          title: 'id',
          key: 'visitDetails.id',
          isLeaf: true,
        },
        {
          title: 'visitDate',
          key: 'visitDetails.visitDate',
          isLeaf: true,
        },
        {
          title: 'newThisYear',
          key: 'visitDetails.newThisYear',
          isLeaf: true,
        },
        {
          title: 'isNew',
          key: 'visitDetails.isNew',
          isLeaf: true,
        },
        {
          title: 'referredIn',
          key: 'visitDetails.referredIn',
          isLeaf: true,
        },
        {
          title: 'closedDate',
          key: 'visitDetails.closedDate',
          isLeaf: true,
        },
        {
          title: 'visitType',
          key: 'visitDetails.visitType',
          isLeaf: true,
        },
        {
          title: 'disabled',
          key: 'visitDetails.disabled',
          isLeaf: true,
        },
        {
          title: 'careServices',
          key: 'visitDetails.careServices',
          children: [
            {
              title: 'careType',
              key: 'visitDetails.careServices.careType',
              isLeaf: true,
            },
            {
              title: 'visitNumber',
              key: 'visitDetails.careServices.visitNumber',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'attendedSpecialist',
          key: 'visitDetails.attendedSpecialist',
          children: [
            {
              title: 'superSpecialist',
              key: 'visitDetails.attendedSpecialist.superSpecialist',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'serviceComplaints',
          key: 'visitDetails.serviceComplaints',
          children: [
            {
              title: 'providedComplaints',
              key: 'visitDetails.serviceComplaints.providedComplaints',
              isLeaf: true,
            },
            {
              title: 'complaints',
              key: 'visitDetails.serviceComplaints.complaints',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'appointment',
      key: 'appointment',
      children: [
        {
          title: 'appointmentId',
          key: 'appointment.appointmentId',
          isLeaf: true,
        },
        {
          title: 'hfrCode',
          key: 'appointment.hfrCode',
          isLeaf: true,
        },
        {
          title: 'appointmentStatus',
          key: 'appointment.appointmentStatus',
          isLeaf: true,
        },
        {
          title: 'paymentDetails',
          key: 'appointment.paymentDetails',
          children: [
            {
              title: 'controlNumber',
              key: 'appointment.paymentDetails.controlNumber',
              isLeaf: true,
            },
            {
              title: 'statusCode',
              key: 'appointment.paymentDetails.statusCode',
              isLeaf: true,
            },
            {
              title: 'description',
              key: 'appointment.paymentDetails.description',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'serviceDetails',
          key: 'appointment.serviceDetails',
          children: [
            {
              title: 'serviceCode',
              key: 'appointment.serviceDetails.serviceCode',
              isLeaf: true,
            },
            {
              title: 'serviceName',
              key: 'appointment.serviceDetails.serviceName',
              isLeaf: true,
            },
            {
              title: 'shortName',
              key: 'appointment.serviceDetails.shortName',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'selfMonitoringClinicalInformation',
      key: 'selfMonitoringClinicalInformation',
      children: [
        {
          title: 'vitalSigns',
          key: 'selfMonitoringClinicalInformation.vitalSigns',
          children: [
            {
              title: 'bloodPressure',
              key: 'selfMonitoringClinicalInformation.vitalSigns.bloodPressure',
              isLeaf: true,
            },
            {
              title: 'weight',
              key: 'selfMonitoringClinicalInformation.vitalSigns.weight',
              isLeaf: true,
            },
            {
              title: 'temperature',
              key: 'selfMonitoringClinicalInformation.vitalSigns.temperature',
              isLeaf: true,
            },
            {
              title: 'height',
              key: 'selfMonitoringClinicalInformation.vitalSigns.height',
              isLeaf: true,
            },
            {
              title: 'respiration',
              key: 'selfMonitoringClinicalInformation.vitalSigns.respiration',
              isLeaf: true,
            },
            {
              title: 'pulseRate',
              key: 'selfMonitoringClinicalInformation.vitalSigns.pulseRate',
              isLeaf: true,
            },
            {
              title: 'dateTime',
              key: 'selfMonitoringClinicalInformation.vitalSigns.dateTime',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'selfMonitoringClinicalInformation.vitalSigns.notes',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'clinicalInformation',
      key: 'clinicalInformation',
      children: [
        {
          title: 'vitalSigns',
          key: 'clinicalInformation.vitalSigns',
          children: [
            {
              title: 'bloodPressure',
              key: 'clinicalInformation.vitalSigns.bloodPressure',
              isLeaf: true,
            },
            {
              title: 'weight',
              key: 'clinicalInformation.vitalSigns.weight',
              isLeaf: true,
            },
            {
              title: 'temperature',
              key: 'clinicalInformation.vitalSigns.temperature',
              isLeaf: true,
            },
            {
              title: 'height',
              key: 'clinicalInformation.vitalSigns.height',
              isLeaf: true,
            },
            {
              title: 'respiration',
              key: 'clinicalInformation.vitalSigns.respiration',
              isLeaf: true,
            },
            {
              title: 'pulseRate',
              key: 'clinicalInformation.vitalSigns.pulseRate',
              isLeaf: true,
            },
            {
              title: 'dateTime',
              key: 'clinicalInformation.vitalSigns.dateTime',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'clinicalInformation.vitalSigns.notes',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'visitNotes',
          key: 'clinicalInformation.visitNotes',
          children: [
            {
              title: 'date',
              key: 'clinicalInformation.visitNotes.date',
              isLeaf: true,
            },
            {
              title: 'chiefComplaints',
              key: 'clinicalInformation.visitNotes.chiefComplaints',
              children: [
                {
                  title: '0',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.9',
                  isLeaf: true,
                },
                {
                  title: '10',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.10',
                  isLeaf: true,
                },
                {
                  title: '11',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.11',
                  isLeaf: true,
                },
                {
                  title: '12',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.12',
                  isLeaf: true,
                },
                {
                  title: '13',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.13',
                  isLeaf: true,
                },
                {
                  title: '14',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.14',
                  isLeaf: true,
                },
                {
                  title: '15',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.15',
                  isLeaf: true,
                },
                {
                  title: '16',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.16',
                  isLeaf: true,
                },
                {
                  title: '17',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.17',
                  isLeaf: true,
                },
                {
                  title: '18',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.18',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'injured',
              key: 'clinicalInformation.visitNotes.injured',
              isLeaf: true,
            },
            {
              title: 'historyOfPresentIllness',
              key: 'clinicalInformation.visitNotes.historyOfPresentIllness',
            },
            {
              title: 'reviewOfOtherSystems',
              key: 'clinicalInformation.visitNotes.reviewOfOtherSystems',
              children: [
                {
                  title: 'code',
                  key: 'clinicalInformation.visitNotes.reviewOfOtherSystems.code',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'clinicalInformation.visitNotes.reviewOfOtherSystems.name',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'clinicalInformation.visitNotes.reviewOfOtherSystems.notes',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'pastMedicalHistory',
              key: 'clinicalInformation.visitNotes.pastMedicalHistory',
            },
            {
              title: 'familyAndSocialHistory',
              key: 'clinicalInformation.visitNotes.familyAndSocialHistory',
            },
            {
              title: 'generalExaminationObservation',
              key: 'clinicalInformation.visitNotes.generalExaminationObservation',
              isLeaf: true,
            },
            {
              title: 'localExamination',
              key: 'clinicalInformation.visitNotes.localExamination',
              isLeaf: true,
            },
            {
              title: 'systemicExaminationObservation',
              key: 'clinicalInformation.visitNotes.systemicExaminationObservation',
              children: [
                {
                  title: 'code',
                  key: 'clinicalInformation.visitNotes.systemicExaminationObservation.code',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'clinicalInformation.visitNotes.systemicExaminationObservation.name',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'clinicalInformation.visitNotes.systemicExaminationObservation.notes',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'doctorPlanOrSuggestion',
              key: 'clinicalInformation.visitNotes.doctorPlanOrSuggestion',
              isLeaf: true,
            },
            {
              title: 'providerSpeciality',
              key: 'clinicalInformation.visitNotes.providerSpeciality',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'allergies',
      key: 'allergies',
      children: [
        {
          title: 'code',
          key: 'allergies.code',
          isLeaf: true,
        },
        {
          title: 'category',
          key: 'allergies.category',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'allergies.name',
          isLeaf: true,
        },
        {
          title: 'criticality',
          key: 'allergies.criticality',
          isLeaf: true,
        },
        {
          title: 'verificationStatus',
          key: 'allergies.verificationStatus',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'chronicConditions',
      key: 'chronicConditions',
      children: [
        {
          title: 'code',
          key: 'chronicConditions.code',
          isLeaf: true,
        },
        {
          title: 'category',
          key: 'chronicConditions.category',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'chronicConditions.name',
          isLeaf: true,
        },
        {
          title: 'criticality',
          key: 'chronicConditions.criticality',
          isLeaf: true,
        },
        {
          title: 'verificationStatus',
          key: 'chronicConditions.verificationStatus',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'lifeStyleInformation',
      key: 'lifeStyleInformation',
      children: [
        {
          title: 'smoking',
          key: 'lifeStyleInformation.smoking',
          children: [
            {
              title: 'using',
              key: 'lifeStyleInformation.smoking.using',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'lifeStyleInformation.smoking.notes',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'alcoholUse',
          key: 'lifeStyleInformation.alcoholUse',
          children: [
            {
              title: 'using',
              key: 'lifeStyleInformation.alcoholUse.using',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'lifeStyleInformation.alcoholUse.notes',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'drugUse',
          key: 'lifeStyleInformation.drugUse',
          children: [
            {
              title: 'using',
              key: 'lifeStyleInformation.drugUse.using',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'lifeStyleInformation.drugUse.notes',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'investigationDetails',
      key: 'investigationDetails',
      children: [
        {
          title: 'dateOccurred',
          key: 'investigationDetails.dateOccurred',
          isLeaf: true,
        },
        {
          title: 'caseClassification',
          key: 'investigationDetails.caseClassification',
          isLeaf: true,
        },
        {
          title: 'daysSinceSymptoms',
          key: 'investigationDetails.daysSinceSymptoms',
          isLeaf: true,
        },
        {
          title: 'diseaseCode',
          key: 'investigationDetails.diseaseCode',
          isLeaf: true,
        },
        {
          title: 'labSpecimenTaken',
          key: 'investigationDetails.labSpecimenTaken',
          isLeaf: true,
        },
        {
          title: 'specimenSentToLab',
          key: 'investigationDetails.specimenSentToLab',
          isLeaf: true,
        },
        {
          title: 'vaccinated',
          key: 'investigationDetails.vaccinated',
          isLeaf: true,
        },
        {
          title: 'specimenCollected',
          key: 'investigationDetails.specimenCollected',
          isLeaf: true,
        },
        {
          title: 'dateSpecimenCollected',
          key: 'investigationDetails.dateSpecimenCollected',
          isLeaf: true,
        },
        {
          title: 'specimenCollectedFrom',
          key: 'investigationDetails.specimenCollectedFrom',
          isLeaf: true,
        },
        {
          title: 'specimenID',
          key: 'investigationDetails.specimenID',
          isLeaf: true,
        },
        {
          title: 'typeOfSpecimen',
          key: 'investigationDetails.typeOfSpecimen',
          isLeaf: true,
        },
        {
          title: 'dateSpecimenSentToLab',
          key: 'investigationDetails.dateSpecimenSentToLab',
          isLeaf: true,
        },
        {
          title: 'laboratoryName',
          key: 'investigationDetails.laboratoryName',
          isLeaf: true,
        },
        {
          title: 'typeOfTest',
          key: 'investigationDetails.typeOfTest',
          isLeaf: true,
        },
        {
          title: 'specimenAcceptanceStatus',
          key: 'investigationDetails.specimenAcceptanceStatus',
          isLeaf: true,
        },
        {
          title: 'specimenCollectorName',
          key: 'investigationDetails.specimenCollectorName',
          isLeaf: true,
        },
        {
          title: 'specimenCollectorContactNumber',
          key: 'investigationDetails.specimenCollectorContactNumber',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'labInvestigationDetails',
      key: 'labInvestigationDetails',
      children: [
        {
          title: 'testCode',
          key: 'labInvestigationDetails.testCode',
          isLeaf: true,
        },
        {
          title: 'testOrderDate',
          key: 'labInvestigationDetails.testOrderDate',
          isLeaf: true,
        },
        {
          title: 'testSampleId',
          key: 'labInvestigationDetails.testSampleId',
          isLeaf: true,
        },
        {
          title: 'testOrderId',
          key: 'labInvestigationDetails.testOrderId',
          isLeaf: true,
        },
        {
          title: 'testResultDate',
          key: 'labInvestigationDetails.testResultDate',
          isLeaf: true,
        },
        {
          title: 'testStatus',
          key: 'labInvestigationDetails.testStatus',
          isLeaf: true,
        },
        {
          title: 'testType',
          key: 'labInvestigationDetails.testType',
          isLeaf: true,
        },
        {
          title: 'standardCode',
          key: 'labInvestigationDetails.standardCode',
          isLeaf: true,
        },
        {
          title: 'codeType',
          key: 'labInvestigationDetails.codeType',
          isLeaf: true,
        },
        {
          title: 'testResults',
          key: 'labInvestigationDetails.testResults',
          children: [
            {
              title: 'parameter',
              key: 'labInvestigationDetails.testResults.parameter',
              isLeaf: true,
            },
            {
              title: 'releaseDate',
              key: 'labInvestigationDetails.testResults.releaseDate',
              isLeaf: true,
            },
            {
              title: 'result',
              key: 'labInvestigationDetails.testResults.result',
              isLeaf: true,
            },
            {
              title: 'codedValue',
              key: 'labInvestigationDetails.testResults.codedValue',
              isLeaf: true,
            },
            {
              title: 'valueType',
              key: 'labInvestigationDetails.testResults.valueType',
              isLeaf: true,
            },
            {
              title: 'standardCode',
              key: 'labInvestigationDetails.testResults.standardCode',
              isLeaf: true,
            },
            {
              title: 'codeType',
              key: 'labInvestigationDetails.testResults.codeType',
              isLeaf: true,
            },
            {
              title: 'unit',
              key: 'labInvestigationDetails.testResults.unit',
              isLeaf: true,
            },
            {
              title: 'lowRange',
              key: 'labInvestigationDetails.testResults.lowRange',
              isLeaf: true,
            },
            {
              title: 'hiRange',
              key: 'labInvestigationDetails.testResults.hiRange',
              isLeaf: true,
            },
            {
              title: 'remarks',
              key: 'labInvestigationDetails.testResults.remarks',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'diagnosisDetails',
      key: 'diagnosisDetails',
      children: [
        {
          title: 'certainty',
          key: 'diagnosisDetails.certainty',
          isLeaf: true,
        },
        {
          title: 'diagnosis',
          key: 'diagnosisDetails.diagnosis',
          isLeaf: true,
        },
        {
          title: 'diagnosisCode',
          key: 'diagnosisDetails.diagnosisCode',
          isLeaf: true,
        },
        {
          title: 'diagnosisDate',
          key: 'diagnosisDetails.diagnosisDate',
          isLeaf: true,
        },
        {
          title: 'diagnosisDescription',
          key: 'diagnosisDetails.diagnosisDescription',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'medicationDetails',
      key: 'medicationDetails',
      children: [
        {
          title: 'name',
          key: 'medicationDetails.name',
          isLeaf: true,
        },
        {
          title: 'code',
          key: 'medicationDetails.code',
          isLeaf: true,
        },
        {
          title: 'codeStandard',
          key: 'medicationDetails.codeStandard',
          isLeaf: true,
        },
        {
          title: 'dosage',
          key: 'medicationDetails.dosage',
          children: [
            {
              title: 'dose',
              key: 'medicationDetails.dosage.dose',
              isLeaf: true,
            },
            {
              title: 'frequency',
              key: 'medicationDetails.dosage.frequency',
              isLeaf: true,
            },
            {
              title: 'route',
              key: 'medicationDetails.dosage.route',
              isLeaf: true,
            },
            {
              title: 'instructions',
              key: 'medicationDetails.dosage.instructions',
              isLeaf: true,
            },
            {
              title: 'quantity',
              key: 'medicationDetails.dosage.quantity',
              isLeaf: true,
            },
            {
              title: 'duration',
              key: 'medicationDetails.dosage.duration',
              isLeaf: true,
            },
            {
              title: 'days',
              key: 'medicationDetails.dosage.days',
            },
            {
              title: 'schedule',
              key: 'medicationDetails.dosage.schedule',
              children: [
                {
                  title: '0',
                  key: 'medicationDetails.dosage.schedule.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'medicationDetails.dosage.schedule.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'medicationDetails.dosage.schedule.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'medicationDetails.dosage.schedule.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'medicationDetails.dosage.schedule.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'medicationDetails.dosage.schedule.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'medicationDetails.dosage.schedule.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'medicationDetails.dosage.schedule.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'medicationDetails.dosage.schedule.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'medicationDetails.dosage.schedule.9',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'dosageDates',
              key: 'medicationDetails.dosage.dosageDates',
              children: [
                {
                  title: '0',
                  key: 'medicationDetails.dosage.dosageDates.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'medicationDetails.dosage.dosageDates.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'medicationDetails.dosage.dosageDates.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'medicationDetails.dosage.dosageDates.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'medicationDetails.dosage.dosageDates.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'medicationDetails.dosage.dosageDates.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'medicationDetails.dosage.dosageDates.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'medicationDetails.dosage.dosageDates.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'medicationDetails.dosage.dosageDates.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'medicationDetails.dosage.dosageDates.9',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'issued',
          key: 'medicationDetails.issued',
          children: [
            {
              title: 'quantity',
              key: 'medicationDetails.issued.quantity',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'orderDate',
          key: 'medicationDetails.orderDate',
          isLeaf: true,
        },
        {
          title: 'periodOfMedication',
          key: 'medicationDetails.periodOfMedication',
          isLeaf: true,
        },
        {
          title: 'treatmentType',
          key: 'medicationDetails.treatmentType',
          isLeaf: true,
        },
        {
          title: 'refillStatus',
          key: 'medicationDetails.refillStatus',
          isLeaf: true,
        },
        {
          title: 'currentRefill',
          key: 'medicationDetails.currentRefill',
          isLeaf: true,
        },
        {
          title: 'maxRefill',
          key: 'medicationDetails.maxRefill',
          isLeaf: true,
        },
        {
          title: 'paymentDetails',
          key: 'medicationDetails.paymentDetails',
          children: [
            {
              title: 'controlNumber',
              key: 'medicationDetails.paymentDetails.controlNumber',
              isLeaf: true,
            },
            {
              title: 'statusCode',
              key: 'medicationDetails.paymentDetails.statusCode',
              isLeaf: true,
            },
            {
              title: 'status',
              key: 'medicationDetails.paymentDetails.status',
              isLeaf: true,
            },
            {
              title: 'type',
              key: 'medicationDetails.paymentDetails.type',
              isLeaf: true,
            },
            {
              title: 'description',
              key: 'medicationDetails.paymentDetails.description',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'treatmentDetails',
      key: 'treatmentDetails',
      children: [
        {
          title: 'chemoTherapy',
          key: 'treatmentDetails.chemoTherapy',
          children: [
            {
              title: 'diagnosis',
              key: 'treatmentDetails.chemoTherapy.diagnosis',
              isLeaf: true,
            },
            {
              title: 'regiment',
              key: 'treatmentDetails.chemoTherapy.regiment',
              isLeaf: true,
            },
            {
              title: 'stage',
              key: 'treatmentDetails.chemoTherapy.stage',
              isLeaf: true,
            },
            {
              title: 'totalNumberOfExpectedCycles',
              key: 'treatmentDetails.chemoTherapy.totalNumberOfExpectedCycles',
              isLeaf: true,
            },
            {
              title: 'currentChemotherapeuticCycles',
              key: 'treatmentDetails.chemoTherapy.currentChemotherapeuticCycles',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'radioTherapy',
          key: 'treatmentDetails.radioTherapy',
          children: [
            {
              title: 'prescription',
              key: 'treatmentDetails.radioTherapy.prescription',
              children: [
                {
                  title: 'type',
                  key: 'treatmentDetails.radioTherapy.prescription.type',
                  isLeaf: true,
                },
                {
                  title: 'intention',
                  key: 'treatmentDetails.radioTherapy.prescription.intention',
                  isLeaf: true,
                },
                {
                  title: 'technique',
                  key: 'treatmentDetails.radioTherapy.prescription.technique',
                  isLeaf: true,
                },
                {
                  title: 'site',
                  key: 'treatmentDetails.radioTherapy.prescription.site',
                  isLeaf: true,
                },
                {
                  title: 'dailyDose',
                  key: 'treatmentDetails.radioTherapy.prescription.dailyDose',
                  isLeaf: true,
                },
                {
                  title: 'totalDose',
                  key: 'treatmentDetails.radioTherapy.prescription.totalDose',
                  isLeaf: true,
                },
                {
                  title: 'startDate',
                  key: 'treatmentDetails.radioTherapy.prescription.startDate',
                  isLeaf: true,
                },
                {
                  title: 'dosageDates',
                  key: 'treatmentDetails.radioTherapy.prescription.dosageDates',
                  children: [
                    {
                      title: '0',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.0',
                      isLeaf: true,
                    },
                    {
                      title: '1',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.1',
                      isLeaf: true,
                    },
                    {
                      title: '2',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.2',
                      isLeaf: true,
                    },
                    {
                      title: '3',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.3',
                      isLeaf: true,
                    },
                    {
                      title: '4',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.4',
                      isLeaf: true,
                    },
                    {
                      title: '5',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.5',
                      isLeaf: true,
                    },
                    {
                      title: '6',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.6',
                      isLeaf: true,
                    },
                    {
                      title: '7',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.7',
                      isLeaf: true,
                    },
                    {
                      title: '8',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.8',
                      isLeaf: true,
                    },
                    {
                      title: '9',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.9',
                      isLeaf: true,
                    },
                  ],
                },
                {
                  title: 'administrationDates',
                  key: 'treatmentDetails.radioTherapy.prescription.administrationDates',
                },
                {
                  title: 'remarks',
                  key: 'treatmentDetails.radioTherapy.prescription.remarks',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'report',
              key: 'treatmentDetails.radioTherapy.report',
              children: [
                {
                  title: 'date',
                  key: 'treatmentDetails.radioTherapy.report.date',
                  isLeaf: true,
                },
                {
                  title: 'MU',
                  key: 'treatmentDetails.radioTherapy.report.MU',
                  isLeaf: true,
                },
                {
                  title: 'attachments',
                  key: 'treatmentDetails.radioTherapy.report.attachments',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'surgery',
          key: 'treatmentDetails.surgery',
          children: [
            {
              title: 'diagnosis',
              key: 'treatmentDetails.surgery.diagnosis',
              isLeaf: true,
            },
            {
              title: 'reason',
              key: 'treatmentDetails.surgery.reason',
              isLeaf: true,
            },
            {
              title: 'report',
              key: 'treatmentDetails.surgery.report',
              children: [
                {
                  title: 'indication',
                  key: 'treatmentDetails.surgery.report.indication',
                  isLeaf: true,
                },
                {
                  title: 'steps',
                  key: 'treatmentDetails.surgery.report.steps',
                  isLeaf: true,
                },
                {
                  title: 'remarks',
                  key: 'treatmentDetails.surgery.report.remarks',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'hormoneTherapy',
          key: 'treatmentDetails.hormoneTherapy',
          children: [
            {
              title: 'diagnosis',
              key: 'treatmentDetails.hormoneTherapy.diagnosis',
              isLeaf: true,
            },
            {
              title: 'regiment',
              key: 'treatmentDetails.hormoneTherapy.regiment',
              isLeaf: true,
            },
            {
              title: 'stage',
              key: 'treatmentDetails.hormoneTherapy.stage',
              isLeaf: true,
            },
            {
              title: 'totalNumberOfExpectedCycles',
              key: 'treatmentDetails.hormoneTherapy.totalNumberOfExpectedCycles',
              isLeaf: true,
            },
            {
              title: 'currentChemotherapeuticCycles',
              key: 'treatmentDetails.hormoneTherapy.currentChemotherapeuticCycles',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'symptomatic',
          key: 'treatmentDetails.symptomatic',
          isLeaf: true,
        },
        {
          title: 'alternativeTreatment',
          key: 'treatmentDetails.alternativeTreatment',
          isLeaf: true,
        },
        {
          title: 'medicalProcedureDetails',
          key: 'treatmentDetails.medicalProcedureDetails',
          children: [
            {
              title: 'procedureDate',
              key: 'treatmentDetails.medicalProcedureDetails.procedureDate',
              isLeaf: true,
            },
            {
              title: 'procedureType',
              key: 'treatmentDetails.medicalProcedureDetails.procedureType',
              isLeaf: true,
            },
            {
              title: 'findings',
              key: 'treatmentDetails.medicalProcedureDetails.findings',
              isLeaf: true,
            },
            {
              title: 'diagnosis',
              key: 'treatmentDetails.medicalProcedureDetails.diagnosis',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'eyeClinicDetails',
      key: 'eyeClinicDetails',
      children: [
        {
          title: 'Refracted',
          key: 'eyeClinicDetails.Refracted',
          isLeaf: true,
        },
        {
          title: 'spectaclesPrescribed',
          key: 'eyeClinicDetails.spectaclesPrescribed',
          isLeaf: true,
        },
        {
          title: 'spectacleDispensed',
          key: 'eyeClinicDetails.spectacleDispensed',
          isLeaf: true,
        },
        {
          title: 'contactLenseDispensed',
          key: 'eyeClinicDetails.contactLenseDispensed',
          isLeaf: true,
        },
        {
          title: 'prescribedWithLowVision',
          key: 'eyeClinicDetails.prescribedWithLowVision',
          isLeaf: true,
        },
        {
          title: 'diagnosedWithLowVisionI',
          key: 'eyeClinicDetails.diagnosedWithLowVisionI',
          isLeaf: true,
        },
        {
          title: 'diagnosedWithLowVisionII',
          key: 'eyeClinicDetails.diagnosedWithLowVisionII',
          isLeaf: true,
        },
        {
          title: 'isDispensedWithLowVisionDevice',
          key: 'eyeClinicDetails.isDispensedWithLowVisionDevice',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'radiologyDetails',
      key: 'radiologyDetails',
      children: [
        {
          title: 'testDate',
          key: 'radiologyDetails.testDate',
          isLeaf: true,
        },
        {
          title: 'testTypeName',
          key: 'radiologyDetails.testTypeName',
          isLeaf: true,
        },
        {
          title: 'testTypeCode',
          key: 'radiologyDetails.testTypeCode',
          isLeaf: true,
        },
        {
          title: 'testReport',
          key: 'radiologyDetails.testReport',
          isLeaf: true,
        },
        {
          title: 'bodySite',
          key: 'radiologyDetails.bodySite',
          isLeaf: true,
        },
        {
          title: 'url',
          key: 'radiologyDetails.url',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'admissionDetails',
      key: 'admissionDetails',
      children: [
        {
          title: 'admissionDate',
          key: 'admissionDetails.admissionDate',
          isLeaf: true,
        },
        {
          title: 'admissionDiagnosis',
          key: 'admissionDetails.admissionDiagnosis',
          isLeaf: true,
        },
        {
          title: 'dischargedOn',
          key: 'admissionDetails.dischargedOn',
          isLeaf: true,
        },
        {
          title: 'dischargeStatus',
          key: 'admissionDetails.dischargeStatus',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'outcomeDetails',
      key: 'outcomeDetails',
      children: [
        {
          title: 'isAlive',
          key: 'outcomeDetails.isAlive',
          isLeaf: true,
        },
        {
          title: 'deathLocation',
          key: 'outcomeDetails.deathLocation',
          isLeaf: true,
        },
        {
          title: 'deathDate',
          key: 'outcomeDetails.deathDate',
          isLeaf: true,
        },
        {
          title: 'contactTracing',
          key: 'outcomeDetails.contactTracing',
          isLeaf: true,
        },
        {
          title: 'investigationConducted',
          key: 'outcomeDetails.investigationConducted',
          isLeaf: true,
        },
        {
          title: 'quarantined',
          key: 'outcomeDetails.quarantined',
          isLeaf: true,
        },
        {
          title: 'dischargedLocation',
          key: 'outcomeDetails.dischargedLocation',
          isLeaf: true,
        },
        {
          title: 'referred',
          key: 'outcomeDetails.referred',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'otherInformation',
      key: 'otherInformation',
      children: [
        {
          title: 'cancerScreening',
          key: 'otherInformation.cancerScreening',
          children: [
            {
              title: 'date',
              key: 'otherInformation.cancerScreening.date',
              isLeaf: true,
            },
            {
              title: 'method',
              key: 'otherInformation.cancerScreening.method',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'otherInformation.cancerScreening.code',
              isLeaf: true,
            },
            {
              title: 'results',
              key: 'otherInformation.cancerScreening.results',
              children: [
                {
                  title: 'date',
                  key: 'otherInformation.cancerScreening.results.date',
                  isLeaf: true,
                },
                {
                  title: 'value',
                  key: 'otherInformation.cancerScreening.results.value',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'otherInformation.cancerScreening.results.code',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'cancerDetails',
          key: 'otherInformation.cancerDetails',
          children: [
            {
              title: 'incidenceDate',
              key: 'otherInformation.cancerDetails.incidenceDate',
              isLeaf: true,
            },
            {
              title: 'topography',
              key: 'otherInformation.cancerDetails.topography',
              isLeaf: true,
            },
            {
              title: 'morphology',
              key: 'otherInformation.cancerDetails.morphology',
              isLeaf: true,
            },
            {
              title: 'basisOfDiagnosis',
              key: 'otherInformation.cancerDetails.basisOfDiagnosis',
              isLeaf: true,
            },
            {
              title: 'stage',
              key: 'otherInformation.cancerDetails.stage',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'visitMainPaymentDetails',
      key: 'visitMainPaymentDetails',
      children: [
        {
          title: 'shortName',
          key: 'visitMainPaymentDetails.shortName',
          isLeaf: true,
        },
        {
          title: 'type',
          key: 'visitMainPaymentDetails.type',
          isLeaf: true,
        },
        {
          title: 'insuranceCode',
          key: 'visitMainPaymentDetails.insuranceCode',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'visitMainPaymentDetails.name',
          isLeaf: true,
        },
        {
          title: 'insuranceId',
          key: 'visitMainPaymentDetails.insuranceId',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'causesOfDeathDetails',
      key: 'causesOfDeathDetails',
      children: [
        {
          title: 'dateOfDeath',
          key: 'causesOfDeathDetails.dateOfDeath',
          isLeaf: true,
        },
        {
          title: 'lineA',
          key: 'causesOfDeathDetails.lineA',
          isLeaf: true,
        },
        {
          title: 'lineB',
          key: 'causesOfDeathDetails.lineB',
          isLeaf: true,
        },
        {
          title: 'lineC',
          key: 'causesOfDeathDetails.lineC',
          isLeaf: true,
        },
        {
          title: 'lineD',
          key: 'causesOfDeathDetails.lineD',
          isLeaf: true,
        },
        {
          title: 'causeOfDeathOther',
          key: 'causesOfDeathDetails.causeOfDeathOther',
          isLeaf: true,
        },
        {
          title: 'mannerOfDeath',
          key: 'causesOfDeathDetails.mannerOfDeath',
          isLeaf: true,
        },
        {
          title: 'placeOfDeath',
          key: 'causesOfDeathDetails.placeOfDeath',
          isLeaf: true,
        },
        {
          title: 'otherDeathDetails',
          key: 'causesOfDeathDetails.otherDeathDetails',
          children: [
            {
              title: 'postmortemDetails',
              key: 'causesOfDeathDetails.otherDeathDetails.postmortemDetails',
              isLeaf: true,
            },
            {
              title: 'marcerated',
              key: 'causesOfDeathDetails.otherDeathDetails.marcerated',
              isLeaf: true,
            },
            {
              title: 'fresh',
              key: 'causesOfDeathDetails.otherDeathDetails.fresh',
              isLeaf: true,
            },
            {
              title: 'motherCondition',
              key: 'causesOfDeathDetails.otherDeathDetails.motherCondition',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'antenatalCareDetails',
      key: 'antenatalCareDetails',
      children: [
        {
          title: 'date',
          key: 'antenatalCareDetails.date',
          isLeaf: true,
        },
        {
          title: 'pregnancyAgeInWeeks',
          key: 'antenatalCareDetails.pregnancyAgeInWeeks',
          isLeaf: true,
        },
        {
          title: 'lastAncVisitDate',
          key: 'antenatalCareDetails.lastAncVisitDate',
          isLeaf: true,
        },
        {
          title: 'positiveHivStatusBeforeService',
          key: 'antenatalCareDetails.positiveHivStatusBeforeService',
          isLeaf: true,
        },
        {
          title: 'referredToCTC',
          key: 'antenatalCareDetails.referredToCTC',
          isLeaf: true,
        },
        {
          title: 'referredIn',
          key: 'antenatalCareDetails.referredIn',
          isLeaf: true,
        },
        {
          title: 'referredOut',
          key: 'antenatalCareDetails.referredOut',
          isLeaf: true,
        },
        {
          title: 'counselling',
          key: 'antenatalCareDetails.counselling',
          children: [
            {
              title: 'name',
              key: 'antenatalCareDetails.counselling.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'antenatalCareDetails.counselling.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'providedWithHivCounsellingBeforeLabTest',
          key: 'antenatalCareDetails.providedWithHivCounsellingBeforeLabTest',
          isLeaf: true,
        },
        {
          title: 'providedWithHivCounsellingAfterLabTest',
          key: 'antenatalCareDetails.providedWithHivCounsellingAfterLabTest',
          isLeaf: true,
        },
        {
          title: 'prophylaxis',
          key: 'antenatalCareDetails.prophylaxis',
          children: [
            {
              title: 'providedWithLLIN',
              key: 'antenatalCareDetails.prophylaxis.providedWithLLIN',
              isLeaf: true,
            },
            {
              title: 'providedWithIPT2',
              key: 'antenatalCareDetails.prophylaxis.providedWithIPT2',
              isLeaf: true,
            },
            {
              title: 'providedWithIPT3',
              key: 'antenatalCareDetails.prophylaxis.providedWithIPT3',
              isLeaf: true,
            },
            {
              title: 'providedWithIPT4',
              key: 'antenatalCareDetails.prophylaxis.providedWithIPT4',
              isLeaf: true,
            },
            {
              title: 'providedWithIFFolic60Tablets',
              key: 'antenatalCareDetails.prophylaxis.providedWithIFFolic60Tablets',
              isLeaf: true,
            },
            {
              title: 'providedWithMebendazoleOrAlbendazole',
              key: 'antenatalCareDetails.prophylaxis.providedWithMebendazoleOrAlbendazole',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'hivDetails',
          key: 'antenatalCareDetails.hivDetails',
          children: [
            {
              title: 'status',
              key: 'antenatalCareDetails.hivDetails.status',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'antenatalCareDetails.hivDetails.code',
              isLeaf: true,
            },
            {
              title: 'hivTestNumber',
              key: 'antenatalCareDetails.hivDetails.hivTestNumber',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'syphilisDetails',
          key: 'antenatalCareDetails.syphilisDetails',
          children: [
            {
              title: 'status',
              key: 'antenatalCareDetails.syphilisDetails.status',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'antenatalCareDetails.syphilisDetails.code',
              isLeaf: true,
            },
            {
              title: 'providedWithTreatment',
              key: 'antenatalCareDetails.syphilisDetails.providedWithTreatment',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'diagnosedWithOtherSTDs',
          key: 'antenatalCareDetails.diagnosedWithOtherSTDs',
          isLeaf: true,
        },
        {
          title: 'providedWithTreatmentForOtherSTDs',
          key: 'antenatalCareDetails.providedWithTreatmentForOtherSTDs',
          isLeaf: true,
        },
        {
          title: 'gravidity',
          key: 'antenatalCareDetails.gravidity',
          isLeaf: true,
        },
        {
          title: 'spouseDetails',
          key: 'antenatalCareDetails.spouseDetails',
          children: [
            {
              title: 'hivDetails',
              key: 'antenatalCareDetails.spouseDetails.hivDetails',
              children: [
                {
                  title: 'status',
                  key: 'antenatalCareDetails.spouseDetails.hivDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'antenatalCareDetails.spouseDetails.hivDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'hivTestNumber',
                  key: 'antenatalCareDetails.spouseDetails.hivDetails.hivTestNumber',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'hepatitisB',
              key: 'antenatalCareDetails.spouseDetails.hepatitisB',
              children: [
                {
                  title: 'status',
                  key: 'antenatalCareDetails.spouseDetails.hepatitisB.status',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'antenatalCareDetails.spouseDetails.hepatitisB.code',
                  isLeaf: true,
                },
                {
                  title: 'providedWithTreatments',
                  key: 'antenatalCareDetails.spouseDetails.hepatitisB.providedWithTreatments',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'syphilisDetails',
              key: 'antenatalCareDetails.spouseDetails.syphilisDetails',
              children: [
                {
                  title: 'status',
                  key: 'antenatalCareDetails.spouseDetails.syphilisDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'antenatalCareDetails.spouseDetails.syphilisDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'providedWithTreatment',
                  key: 'antenatalCareDetails.spouseDetails.syphilisDetails.providedWithTreatment',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'diagnosedWithOtherSTDs',
              key: 'antenatalCareDetails.spouseDetails.diagnosedWithOtherSTDs',
              isLeaf: true,
            },
            {
              title: 'providedWithTreatmentForOtherSTDs',
              key: 'antenatalCareDetails.spouseDetails.providedWithTreatmentForOtherSTDs',
              isLeaf: true,
            },
            {
              title: 'otherSpouseDetails',
              key: 'antenatalCareDetails.spouseDetails.otherSpouseDetails',
            },
          ],
        },
      ],
    },
    {
      title: 'laborAndDeliveryDetails',
      key: 'laborAndDeliveryDetails',
      children: [
        {
          title: 'date',
          key: 'laborAndDeliveryDetails.date',
          isLeaf: true,
        },
        {
          title: 'motherOrigin',
          key: 'laborAndDeliveryDetails.motherOrigin',
          isLeaf: true,
        },
        {
          title: 'hasComeWithSpouse',
          key: 'laborAndDeliveryDetails.hasComeWithSpouse',
          isLeaf: true,
        },
        {
          title: 'hasComeWithCompanion',
          key: 'laborAndDeliveryDetails.hasComeWithCompanion',
          isLeaf: true,
        },
        {
          title: 'pregnancyAgeInWeeks',
          key: 'laborAndDeliveryDetails.pregnancyAgeInWeeks',
          isLeaf: true,
        },
        {
          title: 'wasProvidedWithAntenatalCorticosteroid',
          key: 'laborAndDeliveryDetails.wasProvidedWithAntenatalCorticosteroid',
          isLeaf: true,
        },
        {
          title: 'hasHistoryOfFGM',
          key: 'laborAndDeliveryDetails.hasHistoryOfFGM',
          isLeaf: true,
        },
        {
          title: 'hivDetails',
          key: 'laborAndDeliveryDetails.hivDetails',
          children: [
            {
              title: 'status',
              key: 'laborAndDeliveryDetails.hivDetails.status',
              isLeaf: true,
            },
            {
              title: 'hivTestNumber',
              key: 'laborAndDeliveryDetails.hivDetails.hivTestNumber',
              isLeaf: true,
            },
            {
              title: 'referredToCTC',
              key: 'laborAndDeliveryDetails.hivDetails.referredToCTC',
              isLeaf: true,
            },
            {
              title: 'ancHivStatus',
              key: 'laborAndDeliveryDetails.hivDetails.ancHivStatus',
              children: [
                {
                  title: 'numberOfTestsTaken',
                  key: 'laborAndDeliveryDetails.hivDetails.ancHivStatus.numberOfTestsTaken',
                  isLeaf: true,
                },
                {
                  title: 'status',
                  key: 'laborAndDeliveryDetails.hivDetails.ancHivStatus.status',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'deliveryMethod',
          key: 'laborAndDeliveryDetails.deliveryMethod',
          children: [
            {
              title: 'name',
              key: 'laborAndDeliveryDetails.deliveryMethod.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'laborAndDeliveryDetails.deliveryMethod.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'placeOfBirth',
          key: 'laborAndDeliveryDetails.placeOfBirth',
          isLeaf: true,
        },
        {
          title: 'timeBetweenLaborPainAndDeliveryInHrs',
          key: 'laborAndDeliveryDetails.timeBetweenLaborPainAndDeliveryInHrs',
          isLeaf: true,
        },
        {
          title: 'isAttendantSkilled',
          key: 'laborAndDeliveryDetails.isAttendantSkilled',
          isLeaf: true,
        },
        {
          title: 'providedWithFamilyPlanningCounseling',
          key: 'laborAndDeliveryDetails.providedWithFamilyPlanningCounseling',
          isLeaf: true,
        },
        {
          title: 'providedWithInfantFeedingCounseling',
          key: 'laborAndDeliveryDetails.providedWithInfantFeedingCounseling',
          isLeaf: true,
        },
        {
          title: 'beforeBirthComplications',
          key: 'laborAndDeliveryDetails.beforeBirthComplications',
          children: [
            {
              title: 'name',
              key: 'laborAndDeliveryDetails.beforeBirthComplications.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'laborAndDeliveryDetails.beforeBirthComplications.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'birthComplications',
          key: 'laborAndDeliveryDetails.birthComplications',
          children: [
            {
              title: 'name',
              key: 'laborAndDeliveryDetails.birthComplications.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'laborAndDeliveryDetails.birthComplications.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'birthDetails',
          key: 'laborAndDeliveryDetails.birthDetails',
          children: [
            {
              title: 'dateOfBirth',
              key: 'laborAndDeliveryDetails.birthDetails.dateOfBirth',
              isLeaf: true,
            },
            {
              title: 'macerated',
              key: 'laborAndDeliveryDetails.birthDetails.macerated',
              isLeaf: true,
            },
            {
              title: 'fresh',
              key: 'laborAndDeliveryDetails.birthDetails.fresh',
              isLeaf: true,
            },
            {
              title: 'bornWithDisabilities',
              key: 'laborAndDeliveryDetails.birthDetails.bornWithDisabilities',
              isLeaf: true,
            },
            {
              title: 'hivDnaPCRTested',
              key: 'laborAndDeliveryDetails.birthDetails.hivDnaPCRTested',
              isLeaf: true,
            },
            {
              title: 'childHivStatus',
              key: 'laborAndDeliveryDetails.birthDetails.childHivStatus',
              isLeaf: true,
            },
            {
              title: 'apgarScore',
              key: 'laborAndDeliveryDetails.birthDetails.apgarScore',
              children: [
                {
                  title: 'oneMinute',
                  key: 'laborAndDeliveryDetails.birthDetails.apgarScore.oneMinute',
                  isLeaf: true,
                },
                {
                  title: 'fiveMinute',
                  key: 'laborAndDeliveryDetails.birthDetails.apgarScore.fiveMinute',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'wasBreastFedWithinOneHourAfterDelivery',
              key: 'laborAndDeliveryDetails.birthDetails.wasBreastFedWithinOneHourAfterDelivery',
              isLeaf: true,
            },
            {
              title: 'weightInKgs',
              key: 'laborAndDeliveryDetails.birthDetails.weightInKgs',
              isLeaf: true,
            },
            {
              title: 'multipleBirth',
              key: 'laborAndDeliveryDetails.birthDetails.multipleBirth',
              isLeaf: true,
            },
            {
              title: 'motherAgeInYears',
              key: 'laborAndDeliveryDetails.birthDetails.motherAgeInYears',
              isLeaf: true,
            },
            {
              title: 'birthOrder',
              key: 'laborAndDeliveryDetails.birthDetails.birthOrder',
              isLeaf: true,
            },
            {
              title: 'exclusiveBreastFed',
              key: 'laborAndDeliveryDetails.birthDetails.exclusiveBreastFed',
              isLeaf: true,
            },
            {
              title: 'motherHivStatus',
              key: 'laborAndDeliveryDetails.birthDetails.motherHivStatus',
              isLeaf: true,
            },
            {
              title: 'providedWithARV',
              key: 'laborAndDeliveryDetails.birthDetails.providedWithARV',
              isLeaf: true,
            },
            {
              title: 'outcomeDetails',
              key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails',
              children: [
                {
                  title: 'isAlive',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.isAlive',
                  isLeaf: true,
                },
                {
                  title: 'referredToPNC',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.referredToPNC',
                  isLeaf: true,
                },
                {
                  title: 'referredToHospital',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.referredToHospital',
                  isLeaf: true,
                },
                {
                  title: 'referredTohealthFacility',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.referredTohealthFacility',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'vaccinationDetails',
              key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails',
              children: [
                {
                  title: 'code',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'date',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.date',
                  isLeaf: true,
                },
                {
                  title: 'type',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.type',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.name',
                  isLeaf: true,
                },
                {
                  title: 'vaccinationModality',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.vaccinationModality',
                  isLeaf: true,
                },
                {
                  title: 'status',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.notes',
                  isLeaf: true,
                },
                {
                  title: 'dosage',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.dosage',
                  isLeaf: true,
                },
                {
                  title: 'reaction',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction',
                  children: [
                    {
                      title: 'reactionDate',
                      key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction.reactionDate',
                      isLeaf: true,
                    },
                    {
                      title: 'notes',
                      key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction.notes',
                      isLeaf: true,
                    },
                    {
                      title: 'reported',
                      key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction.reported',
                      isLeaf: true,
                    },
                  ],
                },
              ],
            },
            {
              title: 'methodOfResuscitation',
              key: 'laborAndDeliveryDetails.birthDetails.methodOfResuscitation',
              isLeaf: true,
            },
            {
              title: 'otherServices',
              key: 'laborAndDeliveryDetails.birthDetails.otherServices',
            },
          ],
        },
        {
          title: 'others',
          key: 'laborAndDeliveryDetails.others',
          children: [
            {
              title: 'emoc',
              key: 'laborAndDeliveryDetails.others.emoc',
              children: [
                {
                  title: 'providedAntibiotic',
                  key: 'laborAndDeliveryDetails.others.emoc.providedAntibiotic',
                  isLeaf: true,
                },
                {
                  title: 'providedUterotonic',
                  key: 'laborAndDeliveryDetails.others.emoc.providedUterotonic',
                  isLeaf: true,
                },
                {
                  title: 'providedMagnesiumSulphate',
                  key: 'laborAndDeliveryDetails.others.emoc.providedMagnesiumSulphate',
                  isLeaf: true,
                },
                {
                  title: 'removedPlacenta',
                  key: 'laborAndDeliveryDetails.others.emoc.removedPlacenta',
                  isLeaf: true,
                },
                {
                  title: 'performedMvaOrDc',
                  key: 'laborAndDeliveryDetails.others.emoc.performedMvaOrDc',
                  isLeaf: true,
                },
                {
                  title: 'administeredBlood',
                  key: 'laborAndDeliveryDetails.others.emoc.administeredBlood',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'amstl',
              key: 'laborAndDeliveryDetails.others.amstl',
              children: [
                {
                  title: 'cordTractionUsed',
                  key: 'laborAndDeliveryDetails.others.amstl.cordTractionUsed',
                  isLeaf: true,
                },
                {
                  title: 'uterineMassageDone',
                  key: 'laborAndDeliveryDetails.others.amstl.uterineMassageDone',
                  isLeaf: true,
                },
                {
                  title: 'administeredOxytocin',
                  key: 'laborAndDeliveryDetails.others.amstl.administeredOxytocin',
                  isLeaf: true,
                },
                {
                  title: 'administeredEgometrine',
                  key: 'laborAndDeliveryDetails.others.amstl.administeredEgometrine',
                  isLeaf: true,
                },
                {
                  title: 'administeredMisoprostol',
                  key: 'laborAndDeliveryDetails.others.amstl.administeredMisoprostol',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'familyPlanning',
              key: 'laborAndDeliveryDetails.others.familyPlanning',
            },
          ],
        },
      ],
    },
    {
      title: 'vaccinationDetails',
      key: 'vaccinationDetails',
      children: [
        {
          title: 'code',
          key: 'vaccinationDetails.code',
          isLeaf: true,
        },
        {
          title: 'date',
          key: 'vaccinationDetails.date',
          isLeaf: true,
        },
        {
          title: 'type',
          key: 'vaccinationDetails.type',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'vaccinationDetails.name',
          isLeaf: true,
        },
        {
          title: 'vaccinationModality',
          key: 'vaccinationDetails.vaccinationModality',
          isLeaf: true,
        },
        {
          title: 'status',
          key: 'vaccinationDetails.status',
          isLeaf: true,
        },
        {
          title: 'notes',
          key: 'vaccinationDetails.notes',
          isLeaf: true,
        },
        {
          title: 'dosage',
          key: 'vaccinationDetails.dosage',
          isLeaf: true,
        },
        {
          title: 'reaction',
          key: 'vaccinationDetails.reaction',
          children: [
            {
              title: 'reactionDate',
              key: 'vaccinationDetails.reaction.reactionDate',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'vaccinationDetails.reaction.notes',
              isLeaf: true,
            },
            {
              title: 'reported',
              key: 'vaccinationDetails.reaction.reported',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'prophylAxisDetails',
      key: 'prophylAxisDetails',
      children: [
        {
          title: 'code',
          key: 'prophylAxisDetails.code',
          isLeaf: true,
        },
        {
          title: 'date',
          key: 'prophylAxisDetails.date',
          isLeaf: true,
        },
        {
          title: 'type',
          key: 'prophylAxisDetails.type',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'prophylAxisDetails.name',
          isLeaf: true,
        },
        {
          title: 'status',
          key: 'prophylAxisDetails.status',
          isLeaf: true,
        },
        {
          title: 'notes',
          key: 'prophylAxisDetails.notes',
          isLeaf: true,
        },
        {
          title: 'reaction',
          key: 'prophylAxisDetails.reaction',
          children: [
            {
              title: 'reactionDate',
              key: 'prophylAxisDetails.reaction.reactionDate',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'prophylAxisDetails.reaction.notes',
              isLeaf: true,
            },
            {
              title: 'reported',
              key: 'prophylAxisDetails.reaction.reported',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'familyPlanningDetails',
      key: 'familyPlanningDetails',
      children: [
        {
          title: 'date',
          key: 'familyPlanningDetails.date',
          isLeaf: true,
        },
        {
          title: 'positiveHivStatusBeforeService',
          key: 'familyPlanningDetails.positiveHivStatusBeforeService',
          isLeaf: true,
        },
        {
          title: 'wasCounselled',
          key: 'familyPlanningDetails.wasCounselled',
          isLeaf: true,
        },
        {
          title: 'hasComeWithSpouse',
          key: 'familyPlanningDetails.hasComeWithSpouse',
          isLeaf: true,
        },
        {
          title: 'serviceLocation',
          key: 'familyPlanningDetails.serviceLocation',
          isLeaf: true,
        },
        {
          title: 'referred',
          key: 'familyPlanningDetails.referred',
          isLeaf: true,
        },
        {
          title: 'cancerScreeningDetails',
          key: 'familyPlanningDetails.cancerScreeningDetails',
          children: [
            {
              title: 'breastCancer',
              key: 'familyPlanningDetails.cancerScreeningDetails.breastCancer',
              children: [
                {
                  title: 'foundWithBreastCancerSymptoms',
                  key: 'familyPlanningDetails.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms',
                  isLeaf: true,
                },
                {
                  title: 'screened',
                  key: 'familyPlanningDetails.cancerScreeningDetails.breastCancer.screened',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'cervicalCancer',
              key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer',
              children: [
                {
                  title: 'suspected',
                  key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer.suspected',
                  isLeaf: true,
                },
                {
                  title: 'screenedWithVIA',
                  key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer.screenedWithVIA',
                  isLeaf: true,
                },
                {
                  title: 'viaTestPositive',
                  key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer.viaTestPositive',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'hivStatus',
          key: 'familyPlanningDetails.hivStatus',
          children: [
            {
              title: 'status',
              key: 'familyPlanningDetails.hivStatus.status',
              isLeaf: true,
            },
            {
              title: 'referredToCTC',
              key: 'familyPlanningDetails.hivStatus.referredToCTC',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'spouseHivStatus',
          key: 'familyPlanningDetails.spouseHivStatus',
          children: [
            {
              title: 'status',
              key: 'familyPlanningDetails.spouseHivStatus.status',
              isLeaf: true,
            },
            {
              title: 'referredToCTC',
              key: 'familyPlanningDetails.spouseHivStatus.referredToCTC',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'breastFeeding',
          key: 'familyPlanningDetails.breastFeeding',
          isLeaf: true,
        },
        {
          title: 'sideEffects',
          key: 'familyPlanningDetails.sideEffects',
          children: [
            {
              title: 'bleeding',
              key: 'familyPlanningDetails.sideEffects.bleeding',
              isLeaf: true,
            },
            {
              title: 'headache',
              key: 'familyPlanningDetails.sideEffects.headache',
              isLeaf: true,
            },
            {
              title: 'gotPregnancy',
              key: 'familyPlanningDetails.sideEffects.gotPregnancy',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'childHealthDetails',
      key: 'childHealthDetails',
      children: [
        {
          title: 'serviceModality',
          key: 'childHealthDetails.serviceModality',
          isLeaf: true,
        },
        {
          title: 'motherAge',
          key: 'childHealthDetails.motherAge',
          isLeaf: true,
        },
        {
          title: 'prophylaxis',
          key: 'childHealthDetails.prophylaxis',
          children: [
            {
              title: 'albendazole',
              key: 'childHealthDetails.prophylaxis.albendazole',
              children: [
                {
                  title: 'administered',
                  key: 'childHealthDetails.prophylaxis.albendazole.administered',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'vitaminA',
              key: 'childHealthDetails.prophylaxis.vitaminA',
              children: [
                {
                  title: 'administered',
                  key: 'childHealthDetails.prophylaxis.vitaminA.administered',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'providedWithLLIN',
              key: 'childHealthDetails.prophylaxis.providedWithLLIN',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'infantFeeding',
          key: 'childHealthDetails.infantFeeding',
          isLeaf: true,
        },
        {
          title: 'providedWithInfantFeedingCounselling',
          key: 'childHealthDetails.providedWithInfantFeedingCounselling',
          isLeaf: true,
        },
        {
          title: 'hasBeenBreastFedFor24Month',
          key: 'childHealthDetails.hasBeenBreastFedFor24Month',
          isLeaf: true,
        },
        {
          title: 'motherHivStatus',
          key: 'childHealthDetails.motherHivStatus',
          children: [
            {
              title: 'status',
              key: 'childHealthDetails.motherHivStatus.status',
              isLeaf: true,
            },
            {
              title: 'testingDate',
              key: 'childHealthDetails.motherHivStatus.testingDate',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referredToCTC',
          key: 'childHealthDetails.referredToCTC',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'cpacDetails',
      key: 'cpacDetails',
      children: [
        {
          title: 'pregnancyAgeInWeeks',
          key: 'cpacDetails.pregnancyAgeInWeeks',
          isLeaf: true,
        },
        {
          title: 'causeOfAbortion',
          key: 'cpacDetails.causeOfAbortion',
          isLeaf: true,
        },
        {
          title: 'afterAbortionServices',
          key: 'cpacDetails.afterAbortionServices',
          isLeaf: true,
        },
        {
          title: 'positiveHIVStatusBeforeAbortion',
          key: 'cpacDetails.positiveHIVStatusBeforeAbortion',
          isLeaf: true,
        },
        {
          title: 'hivTest',
          key: 'cpacDetails.hivTest',
          children: [
            {
              title: 'status',
              key: 'cpacDetails.hivTest.status',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referReason',
          key: 'cpacDetails.referReason',
          isLeaf: true,
        },
        {
          title: 'postAbortionsMedications',
          key: 'cpacDetails.postAbortionsMedications',
          children: [
            {
              title: 'providedWithAntibiotics',
              key: 'cpacDetails.postAbortionsMedications.providedWithAntibiotics',
              isLeaf: true,
            },
            {
              title: 'providedWithPainKillers',
              key: 'cpacDetails.postAbortionsMedications.providedWithPainKillers',
              isLeaf: true,
            },
            {
              title: 'providedWithOxytocin',
              key: 'cpacDetails.postAbortionsMedications.providedWithOxytocin',
              isLeaf: true,
            },
            {
              title: 'providedWithMisoprostol',
              key: 'cpacDetails.postAbortionsMedications.providedWithMisoprostol',
              isLeaf: true,
            },
            {
              title: 'providedWithIvInfusion',
              key: 'cpacDetails.postAbortionsMedications.providedWithIvInfusion',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'postAbortionCounselling',
          key: 'cpacDetails.postAbortionCounselling',
          children: [
            {
              title: 'providedWithSTDsPreventionCounselling',
              key: 'cpacDetails.postAbortionCounselling.providedWithSTDsPreventionCounselling',
              isLeaf: true,
            },
            {
              title: 'providedWithHIVCounselling',
              key: 'cpacDetails.postAbortionCounselling.providedWithHIVCounselling',
              isLeaf: true,
            },
            {
              title: 'providedWithFamilyPlanningCounselling',
              key: 'cpacDetails.postAbortionCounselling.providedWithFamilyPlanningCounselling',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'contraceptives',
          key: 'cpacDetails.contraceptives',
          children: [
            {
              title: 'didReceiveOralPillsPOP',
              key: 'cpacDetails.contraceptives.didReceiveOralPillsPOP',
              isLeaf: true,
            },
            {
              title: 'popCyclesProvided',
              key: 'cpacDetails.contraceptives.popCyclesProvided',
              isLeaf: true,
            },
            {
              title: 'didReceiveOralPillsCOC',
              key: 'cpacDetails.contraceptives.didReceiveOralPillsCOC',
              isLeaf: true,
            },
            {
              title: 'cocCyclesProvided',
              key: 'cpacDetails.contraceptives.cocCyclesProvided',
              isLeaf: true,
            },
            {
              title: 'didReceivePillCycles',
              key: 'cpacDetails.contraceptives.didReceivePillCycles',
              isLeaf: true,
            },
            {
              title: 'wasInsertedWithImplanon',
              key: 'cpacDetails.contraceptives.wasInsertedWithImplanon',
              isLeaf: true,
            },
            {
              title: 'wasInsertedWithJadelle',
              key: 'cpacDetails.contraceptives.wasInsertedWithJadelle',
              isLeaf: true,
            },
            {
              title: 'didReceiveIUD',
              key: 'cpacDetails.contraceptives.didReceiveIUD',
              isLeaf: true,
            },
            {
              title: 'didHaveTubalLigation',
              key: 'cpacDetails.contraceptives.didHaveTubalLigation',
              isLeaf: true,
            },
            {
              title: 'didReceiveInjection',
              key: 'cpacDetails.contraceptives.didReceiveInjection',
              isLeaf: true,
            },
            {
              title: 'numberOfFemaleCondomsProvided',
              key: 'cpacDetails.contraceptives.numberOfFemaleCondomsProvided',
              isLeaf: true,
            },
            {
              title: 'numberOfMaleCondomsProvided',
              key: 'cpacDetails.contraceptives.numberOfMaleCondomsProvided',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'cecap',
      key: 'cecap',
      children: [
        {
          title: 'cancerScreeningDetails',
          key: 'cecap.cancerScreeningDetails',
          children: [
            {
              title: 'breastCancer',
              key: 'cecap.cancerScreeningDetails.breastCancer',
              children: [
                {
                  title: 'foundWithBreastCancerSymptoms',
                  key: 'cecap.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms',
                  isLeaf: true,
                },
                {
                  title: 'screened',
                  key: 'cecap.cancerScreeningDetails.breastCancer.screened',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'cervicalCancer',
              key: 'cecap.cancerScreeningDetails.cervicalCancer',
              children: [
                {
                  title: 'suspected',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.suspected',
                  isLeaf: true,
                },
                {
                  title: 'screenedWithVIA',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.screenedWithVIA',
                  isLeaf: true,
                },
                {
                  title: 'screenedWithHPVDNA',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.screenedWithHPVDNA',
                  isLeaf: true,
                },
                {
                  title: 'viaTestPositive',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.viaTestPositive',
                  isLeaf: true,
                },
                {
                  title: 'hpvDNAPositive',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.hpvDNAPositive',
                  isLeaf: true,
                },
                {
                  title: 'diagnosedWithLargeLesion',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.diagnosedWithLargeLesion',
                  isLeaf: true,
                },
                {
                  title: 'diagnosedWithSmallOrModerateLesion',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.diagnosedWithSmallOrModerateLesion',
                  isLeaf: true,
                },
                {
                  title: 'treatedWithCryo',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedWithCryo',
                  isLeaf: true,
                },
                {
                  title: 'treatedWithThermo',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedWithThermo',
                  isLeaf: true,
                },
                {
                  title: 'treatedWithLEEP',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedWithLEEP',
                  isLeaf: true,
                },
                {
                  title: 'firstTimeScreening',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.firstTimeScreening',
                  isLeaf: true,
                },
                {
                  title: 'treatedOnTheSameDay',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedOnTheSameDay',
                  isLeaf: true,
                },
                {
                  title: 'complicationsAfterTreatment',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.complicationsAfterTreatment',
                  isLeaf: true,
                },
                {
                  title: 'foundWithHivAndReferredToCTC',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.foundWithHivAndReferredToCTC',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'postnatalDetails',
      key: 'postnatalDetails',
      children: [
        {
          title: 'date',
          key: 'postnatalDetails.date',
          isLeaf: true,
        },
        {
          title: 'positiveHivStatusBeforeService',
          key: 'postnatalDetails.positiveHivStatusBeforeService',
          isLeaf: true,
        },
        {
          title: 'hivStatusAsSeenFromAncCard',
          key: 'postnatalDetails.hivStatusAsSeenFromAncCard',
          isLeaf: true,
        },
        {
          title: 'hivDetails',
          key: 'postnatalDetails.hivDetails',
          children: [
            {
              title: 'status',
              key: 'postnatalDetails.hivDetails.status',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.hivDetails.code',
              isLeaf: true,
            },
            {
              title: 'hivTestNumber',
              key: 'postnatalDetails.hivDetails.hivTestNumber',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'motherAndChildOrigin',
          key: 'postnatalDetails.motherAndChildOrigin',
          isLeaf: true,
        },
        {
          title: 'referredToCTC',
          key: 'postnatalDetails.referredToCTC',
          isLeaf: true,
        },
        {
          title: 'placeOfBirth',
          key: 'postnatalDetails.placeOfBirth',
          isLeaf: true,
        },
        {
          title: 'prophylaxis',
          key: 'postnatalDetails.prophylaxis',
          children: [
            {
              title: 'providedWithAntenatalCorticosteroids',
              key: 'postnatalDetails.prophylaxis.providedWithAntenatalCorticosteroids',
              isLeaf: true,
            },
            {
              title: 'provideWithVitaminA',
              key: 'postnatalDetails.prophylaxis.provideWithVitaminA',
              isLeaf: true,
            },
            {
              title: 'providedWithFEFO',
              key: 'postnatalDetails.prophylaxis.providedWithFEFO',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'counselling',
          key: 'postnatalDetails.counselling',
          children: [
            {
              title: 'name',
              key: 'postnatalDetails.counselling.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.counselling.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referredToClinicForFurtherServices',
          key: 'postnatalDetails.referredToClinicForFurtherServices',
          isLeaf: true,
        },
        {
          title: 'outCome',
          key: 'postnatalDetails.outCome',
          isLeaf: true,
        },
        {
          title: 'APGARScore',
          key: 'postnatalDetails.APGARScore',
          isLeaf: true,
        },
        {
          title: 'demagedNipples',
          key: 'postnatalDetails.demagedNipples',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.demagedNipples.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.demagedNipples.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'mastitis',
          key: 'postnatalDetails.mastitis',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.mastitis.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.mastitis.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'breastAbscess',
          key: 'postnatalDetails.breastAbscess',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.breastAbscess.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.breastAbscess.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'fistula',
          key: 'postnatalDetails.fistula',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.fistula.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.fistula.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'puerperalPsychosis',
          key: 'postnatalDetails.puerperalPsychosis',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.puerperalPsychosis.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.puerperalPsychosis.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'daysSinceDelivery',
          key: 'postnatalDetails.daysSinceDelivery',
          isLeaf: true,
        },
        {
          title: 'breastFeedingDetails',
          key: 'postnatalDetails.breastFeedingDetails',
          isLeaf: true,
        },
        {
          title: 'neonatalDeathDetails',
          key: 'postnatalDetails.neonatalDeathDetails',
          children: [
            {
              title: 'dateOfDeath',
              key: 'postnatalDetails.neonatalDeathDetails.dateOfDeath',
              isLeaf: true,
            },
            {
              title: 'lineA',
              key: 'postnatalDetails.neonatalDeathDetails.lineA',
              isLeaf: true,
            },
            {
              title: 'lineB',
              key: 'postnatalDetails.neonatalDeathDetails.lineB',
              isLeaf: true,
            },
            {
              title: 'lineC',
              key: 'postnatalDetails.neonatalDeathDetails.lineC',
              isLeaf: true,
            },
            {
              title: 'lineD',
              key: 'postnatalDetails.neonatalDeathDetails.lineD',
              isLeaf: true,
            },
            {
              title: 'causeOfDeathOther',
              key: 'postnatalDetails.neonatalDeathDetails.causeOfDeathOther',
              isLeaf: true,
            },
            {
              title: 'mannerOfDeath',
              key: 'postnatalDetails.neonatalDeathDetails.mannerOfDeath',
              isLeaf: true,
            },
            {
              title: 'placeOfDeath',
              key: 'postnatalDetails.neonatalDeathDetails.placeOfDeath',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'birthDetails',
          key: 'postnatalDetails.birthDetails',
          children: [
            {
              title: 'dateOfBirth',
              key: 'postnatalDetails.birthDetails.dateOfBirth',
              isLeaf: true,
            },
            {
              title: 'weightInKgs',
              key: 'postnatalDetails.birthDetails.weightInKgs',
              isLeaf: true,
            },
            {
              title: 'multipleBirth',
              key: 'postnatalDetails.birthDetails.multipleBirth',
              isLeaf: true,
            },
            {
              title: 'birthOrder',
              key: 'postnatalDetails.birthDetails.birthOrder',
              isLeaf: true,
            },
            {
              title: 'infantFeeding',
              key: 'postnatalDetails.birthDetails.infantFeeding',
              isLeaf: true,
            },
            {
              title: 'gender',
              key: 'postnatalDetails.birthDetails.gender',
              isLeaf: true,
            },
            {
              title: 'macerated',
              key: 'postnatalDetails.birthDetails.macerated',
              isLeaf: true,
            },
            {
              title: 'fresh',
              key: 'postnatalDetails.birthDetails.fresh',
              isLeaf: true,
            },
            {
              title: 'providedWithKmc',
              key: 'postnatalDetails.birthDetails.providedWithKmc',
              isLeaf: true,
            },
            {
              title: 'hb',
              key: 'postnatalDetails.birthDetails.hb',
              isLeaf: true,
            },
            {
              title: 'hbigTested',
              key: 'postnatalDetails.birthDetails.hbigTested',
              isLeaf: true,
            },
            {
              title: 'hivDnaPCRTested',
              key: 'postnatalDetails.birthDetails.hivDnaPCRTested',
              isLeaf: true,
            },
            {
              title: 'childHivStatus',
              key: 'postnatalDetails.birthDetails.childHivStatus',
              isLeaf: true,
            },
            {
              title: 'infections',
              key: 'postnatalDetails.birthDetails.infections',
              children: [
                {
                  title: 'hasSepticaemia',
                  key: 'postnatalDetails.birthDetails.infections.hasSepticaemia',
                  isLeaf: true,
                },
                {
                  title: 'hasOmphalitis',
                  key: 'postnatalDetails.birthDetails.infections.hasOmphalitis',
                  isLeaf: true,
                },
                {
                  title: 'hasSkinInfection',
                  key: 'postnatalDetails.birthDetails.infections.hasSkinInfection',
                  isLeaf: true,
                },
                {
                  title: 'hasOcularInfection',
                  key: 'postnatalDetails.birthDetails.infections.hasOcularInfection',
                  isLeaf: true,
                },
                {
                  title: 'hasJaundice',
                  key: 'postnatalDetails.birthDetails.infections.hasJaundice',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'outcomeDetails',
              key: 'postnatalDetails.birthDetails.outcomeDetails',
              children: [
                {
                  title: 'dischargedHome',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.dischargedHome',
                  isLeaf: true,
                },
                {
                  title: 'referredToNCU',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.referredToNCU',
                  isLeaf: true,
                },
                {
                  title: 'referredToHospital',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.referredToHospital',
                  isLeaf: true,
                },
                {
                  title: 'referredToHealthFacility',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.referredToHealthFacility',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'motherHivStatus',
              key: 'postnatalDetails.birthDetails.motherHivStatus',
              children: [
                {
                  title: 'name',
                  key: 'postnatalDetails.birthDetails.motherHivStatus.name',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'postnatalDetails.birthDetails.motherHivStatus.code',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'providedWithARV',
              key: 'postnatalDetails.birthDetails.providedWithARV',
              isLeaf: true,
            },
            {
              title: 'referred',
              key: 'postnatalDetails.birthDetails.referred',
              isLeaf: true,
            },
            {
              title: 'vaccinationDetails',
              key: 'postnatalDetails.birthDetails.vaccinationDetails',
              children: [
                {
                  title: 'code',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'date',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.date',
                  isLeaf: true,
                },
                {
                  title: 'type',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.type',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.name',
                  isLeaf: true,
                },
                {
                  title: 'vaccinationModality',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.vaccinationModality',
                  isLeaf: true,
                },
                {
                  title: 'status',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.notes',
                  isLeaf: true,
                },
                {
                  title: 'dosage',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.dosage',
                  isLeaf: true,
                },
                {
                  title: 'reaction',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction',
                  children: [
                    {
                      title: 'reactionDate',
                      key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction.reactionDate',
                      isLeaf: true,
                    },
                    {
                      title: 'notes',
                      key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction.notes',
                      isLeaf: true,
                    },
                    {
                      title: 'reported',
                      key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction.reported',
                      isLeaf: true,
                    },
                  ],
                },
              ],
            },
            {
              title: 'breatheAssistance',
              key: 'postnatalDetails.birthDetails.breatheAssistance',
              children: [
                {
                  title: 'provided',
                  key: 'postnatalDetails.birthDetails.breatheAssistance.provided',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'postnatalDetails.birthDetails.breatheAssistance.code',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'otherServices',
              key: 'postnatalDetails.birthDetails.otherServices',
            },
          ],
        },
        {
          title: 'otherServices',
          key: 'postnatalDetails.otherServices',
        },
      ],
    },
    {
      title: 'billingsDetails',
      key: 'billingsDetails',
      children: [
        {
          title: 'billID',
          key: 'billingsDetails.billID',
          isLeaf: true,
        },
        {
          title: 'billingCode',
          key: 'billingsDetails.billingCode',
          isLeaf: true,
        },
        {
          title: 'billType',
          key: 'billingsDetails.billType',
          isLeaf: true,
        },
        {
          title: 'insuranceCode',
          key: 'billingsDetails.insuranceCode',
          isLeaf: true,
        },
        {
          title: 'insuranceName',
          key: 'billingsDetails.insuranceName',
          isLeaf: true,
        },
        {
          title: 'amountBilled',
          key: 'billingsDetails.amountBilled',
          isLeaf: true,
        },
        {
          title: 'exemptionType',
          key: 'billingsDetails.exemptionType',
          isLeaf: true,
        },
        {
          title: 'wavedAmount',
          key: 'billingsDetails.wavedAmount',
          isLeaf: true,
        },
        {
          title: 'billDate',
          key: 'billingsDetails.billDate',
          isLeaf: true,
        },
        {
          title: 'standardCode',
          key: 'billingsDetails.standardCode',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'referralDetails',
      key: 'referralDetails',
      children: [
        {
          title: 'referralDate',
          key: 'referralDetails.referralDate',
          isLeaf: true,
        },
        {
          title: 'referredToOtherCountry',
          key: 'referralDetails.referredToOtherCountry',
          isLeaf: true,
        },
        {
          title: 'reason',
          key: 'referralDetails.reason',
          children: [
            {
              title: '0',
              key: 'referralDetails.reason.0',
              isLeaf: true,
            },
            {
              title: '1',
              key: 'referralDetails.reason.1',
              isLeaf: true,
            },
            {
              title: '2',
              key: 'referralDetails.reason.2',
              isLeaf: true,
            },
            {
              title: '3',
              key: 'referralDetails.reason.3',
              isLeaf: true,
            },
            {
              title: '4',
              key: 'referralDetails.reason.4',
              isLeaf: true,
            },
            {
              title: '5',
              key: 'referralDetails.reason.5',
              isLeaf: true,
            },
            {
              title: '6',
              key: 'referralDetails.reason.6',
              isLeaf: true,
            },
            {
              title: '7',
              key: 'referralDetails.reason.7',
              isLeaf: true,
            },
            {
              title: '8',
              key: 'referralDetails.reason.8',
              isLeaf: true,
            },
            {
              title: '9',
              key: 'referralDetails.reason.9',
              isLeaf: true,
            },
            {
              title: '10',
              key: 'referralDetails.reason.10',
              isLeaf: true,
            },
            {
              title: '11',
              key: 'referralDetails.reason.11',
              isLeaf: true,
            },
            {
              title: '12',
              key: 'referralDetails.reason.12',
              isLeaf: true,
            },
            {
              title: '13',
              key: 'referralDetails.reason.13',
              isLeaf: true,
            },
            {
              title: '14',
              key: 'referralDetails.reason.14',
              isLeaf: true,
            },
            {
              title: '15',
              key: 'referralDetails.reason.15',
              isLeaf: true,
            },
            {
              title: '16',
              key: 'referralDetails.reason.16',
              isLeaf: true,
            },
            {
              title: '17',
              key: 'referralDetails.reason.17',
              isLeaf: true,
            },
            {
              title: '18',
              key: 'referralDetails.reason.18',
              isLeaf: true,
            },
            {
              title: '19',
              key: 'referralDetails.reason.19',
              isLeaf: true,
            },
            {
              title: '20',
              key: 'referralDetails.reason.20',
              isLeaf: true,
            },
            {
              title: '21',
              key: 'referralDetails.reason.21',
              isLeaf: true,
            },
            {
              title: '22',
              key: 'referralDetails.reason.22',
              isLeaf: true,
            },
            {
              title: '23',
              key: 'referralDetails.reason.23',
              isLeaf: true,
            },
            {
              title: '24',
              key: 'referralDetails.reason.24',
              isLeaf: true,
            },
            {
              title: '25',
              key: 'referralDetails.reason.25',
              isLeaf: true,
            },
            {
              title: '26',
              key: 'referralDetails.reason.26',
              isLeaf: true,
            },
            {
              title: '27',
              key: 'referralDetails.reason.27',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referralNumber',
          key: 'referralDetails.referralNumber',
          isLeaf: true,
        },
        {
          title: 'hfrCode',
          key: 'referralDetails.hfrCode',
          isLeaf: true,
        },
        {
          title: 'referringClinician',
          key: 'referralDetails.referringClinician',
          children: [
            {
              title: 'name',
              key: 'referralDetails.referringClinician.name',
              isLeaf: true,
            },
            {
              title: 'phoneNumber',
              key: 'referralDetails.referringClinician.phoneNumber',
              isLeaf: true,
            },
            {
              title: 'MCTCode',
              key: 'referralDetails.referringClinician.MCTCode',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'contraceptives',
      key: 'contraceptives',
      children: [
        {
          title: 'popCyclesProvided',
          key: 'contraceptives.popCyclesProvided',
          isLeaf: true,
        },
        {
          title: 'cocCyclesProvided',
          key: 'contraceptives.cocCyclesProvided',
          isLeaf: true,
        },
        {
          title: 'didReceiveSDM',
          key: 'contraceptives.didReceiveSDM',
          isLeaf: true,
        },
        {
          title: 'didUseLAM',
          key: 'contraceptives.didUseLAM',
          isLeaf: true,
        },
        {
          title: 'didOptToUseEmergencyMethods',
          key: 'contraceptives.didOptToUseEmergencyMethods',
          isLeaf: true,
        },
        {
          title: 'wasInsertedWithImplanon',
          key: 'contraceptives.wasInsertedWithImplanon',
          isLeaf: true,
        },
        {
          title: 'wasInsertedWithJadelle',
          key: 'contraceptives.wasInsertedWithJadelle',
          isLeaf: true,
        },
        {
          title: 'didRemoveImplanon',
          key: 'contraceptives.didRemoveImplanon',
          isLeaf: true,
        },
        {
          title: 'didRemoveJadelle',
          key: 'contraceptives.didRemoveJadelle',
          isLeaf: true,
        },
        {
          title: 'didReceiveIUD',
          key: 'contraceptives.didReceiveIUD',
          isLeaf: true,
        },
        {
          title: 'didRemoveIUD',
          key: 'contraceptives.didRemoveIUD',
          isLeaf: true,
        },
        {
          title: 'didHaveTubalLigation',
          key: 'contraceptives.didHaveTubalLigation',
          isLeaf: true,
        },
        {
          title: 'didHaveVasectomy',
          key: 'contraceptives.didHaveVasectomy',
          isLeaf: true,
        },
        {
          title: 'didReceiveInjection',
          key: 'contraceptives.didReceiveInjection',
          isLeaf: true,
        },
        {
          title: 'numberOfFemaleCondomsProvided',
          key: 'contraceptives.numberOfFemaleCondomsProvided',
          isLeaf: true,
        },
        {
          title: 'numberOfMaleCondomsProvided',
          key: 'contraceptives.numberOfMaleCondomsProvided',
          isLeaf: true,
        },
      ],
    },
  ]
