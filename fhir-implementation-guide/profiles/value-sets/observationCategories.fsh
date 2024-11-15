ValueSet: ObservationCategories
Url: http://fhir.dhis2.udsm.ac.tz/ValueSet/observation-category
Title: Observation Categories
Description: A set of categories for organizing observations in HDU API, such as vital-signs, visit-notes, etc.
CodeSystem: http://terminology.hl7.org/CodeSystem/observation-category

* include system = "http://fhir.dhis2.udsm.ac.tz/fhir/ValueSet/observation-category"
  concept = { code: "vital-signs", display: "Vital signs" }
* include system = "http://fhir.dhis2.udsm.ac.tz/fhir/ValueSet/observation-category"
  concept = { code: "visit-notes", display: "Visit notes" }
