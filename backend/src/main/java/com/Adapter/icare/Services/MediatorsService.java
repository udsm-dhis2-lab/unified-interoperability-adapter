package com.Adapter.icare.Services;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Repository.MediatorsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;

@Service
public class MediatorsService {
    private final MediatorsRepository mediatorsRepository;
    private final DatastoreService datastoreService;

    public MediatorsService(MediatorsRepository mediatorsRepository, DatastoreService datastoreService) {
        this.mediatorsRepository = mediatorsRepository;
        this.datastoreService = datastoreService;
    }

    public Mediator saveMediatorConfigs(Mediator mediator) throws Exception {
        if (mediator.getUuid() == null) {
            UUID uuid = UUID.randomUUID();
            mediator.setUuid(uuid.toString());
        }
        return mediatorsRepository.save(mediator);
    }

    public List<Mediator> getMediatorsConfigs() throws Exception {
        return mediatorsRepository.findAll();
    }

    public Mediator getMediatorByUuid(String uuid) throws Exception {
        return  mediatorsRepository.getMediatorByUuid(uuid);
    }

    public Mediator updateMediator(Mediator mediator) throws Exception {
        if (mediator.getUuid() != null) {
            String uuid = mediator.getUuid();
            Mediator mediatorToUpdate = mediatorsRepository.getMediatorByUuid(uuid);
            if (mediatorToUpdate != null) {
                return mediatorsRepository.save(mediator);
            } else {
                throw new IllegalStateException("Mediator with uuid " + uuid + " does not exists");
            }
        } else {
            throw new IllegalStateException("Mediator uuid is not set");
        }

    }

    public void deleteMediator(String uuid) throws Exception {
        if (uuid == null) {
            throw new IllegalStateException("uuid is missing");
        } else {
            Mediator mediator = mediatorsRepository.getMediatorByUuid(uuid);
            if (mediator != null) {
                mediatorsRepository.deleteById(mediator.getId());
            } else {
                throw new IllegalStateException("Mediator with uuid " + uuid + " does not exists");
            }

        }
    }

    public List<Map<String, Object>> getDataTemplatesList() throws Exception {
        // To be used in case data templates can be stored on FHIR resource
        // TODO: Implement as per FHIR resource
        List<Map<String, Object>> dataTemplates = new ArrayList<>();
        return  dataTemplates;
    }

    public Map<String, Object> getDataTemplateById(String id) throws Exception {
        // To be used in case data templates can be stored on FHIR resource
        // TODO: Implement as per FHIR resource
        return  new HashMap<>();
    }

    public String sendDataToMediatorWorkflow(Map<String, Object> data) throws Exception {
        /**
         * TODO: The base url, path and authentication details should be put on configurations
         */
//        System.out.println(JSONObject.valueToString((Map<String, Object>) data.get("templateDetails")));
        Map<String, Object> workflow =(Map<String, Object>) ((Map<String, Object>) data.get("templateDetails")).get("workflow");
        if (workflow == null) {
            throw new IllegalStateException("Workflow not set");
        } else if (data.get("data") == null) {
            throw new IllegalStateException("Data section is missing");
        } else if (((Map<String, Object>) data.get("data")).get("facilityDetails") == null) {
            throw new IllegalStateException("Facility is not set");
        } else if (((Map<String, Object>) data.get("data")).get("listGrid") == null) {
            throw new IllegalStateException("List grid is not set");
        } else if (((List) ((Map<String, Object>) data.get("data")).get("listGrid")).size() == 0) {
            throw new IllegalStateException("Nothing set on the list grid block");
        } else {
            if (workflow.get("id") != null || workflow.get("uuid") != null) {
                String id = "";
                if (workflow.get("uuid") != null) {
                    id = workflow.get("uuid").toString();
                } else if (workflow.get("id") != null) {
                    id = workflow.get("id").toString();
                }
//                System.out.println(id);
                Mediator mediator = mediatorsRepository.getMediatorByUuid(id);
//                System.out.println(mediator.getUuid());
                String authType = mediator.getAuthType();
                String authToken = mediator.getAuthToken();
                String baseUrl = mediator.getBaseUrl();
                String path = mediator.getPath();
                URL url = new URL(baseUrl + path);
                BufferedReader reader;
                String dataLine;
                StringBuffer responseContent = new StringBuffer();
                JSONObject responseJsonObject = new JSONObject();
                String returnStr = "";
                try {
                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    String authentication = "";
                    if (authType.toLowerCase().equals("basic")) {
                        authentication =  "Basic " + authToken;
//                        System.out.println(authentication);
                        httpURLConnection.setRequestProperty("Authorization", authentication);
                    } else if (authType.toLowerCase().equals("token")) {
                       authentication = "Bearer " + authToken;
                        httpURLConnection.setRequestProperty("Authorization", authentication);
                    }
                    httpURLConnection.setRequestMethod("POST");
                    httpURLConnection.setRequestProperty("Content-Type", "application/json");
                    httpURLConnection.setRequestProperty("Accept", "application/json");
                    httpURLConnection.setDoOutput(true);

                    ObjectMapper mapper = new ObjectMapper();
                    String jsonString = mapper.writeValueAsString(data);

                    try (OutputStream os = httpURLConnection.getOutputStream()) {
                        byte[] input = jsonString.getBytes("utf-8");
                        os.write(input, 0, input.length);
                    }

                    reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()));
                    while ((dataLine = reader.readLine()) != null) {
                        responseContent.append(dataLine);
                    }
                    reader.close();
                    // System.out.println(js);
                    responseJsonObject = new JSONObject(responseContent.toString());
                    returnStr  = responseJsonObject.toString();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Map<String, Object> returnResults = new HashMap<>();
                Map<String, Object> templateDetails = ((Map<String, Object>) data.get("templateDetails"));
                Map<String, Object> dataSection = ((Map<String, Object>) data.get("data"));
                List<Map<String, Object>> listGrid = new ArrayList<>();
                listGrid = (List<Map<String, Object>>) dataSection.get("listGrid");
                Map<String, Object> facilityDetails = (Map<String, Object>)dataSection.get("facilityDetails");
                String hfrCode = facilityDetails.get("HFCode").toString();
                Datastore healthFacilityData = new Datastore();
                healthFacilityData.setNamespace("Health-facilities");
                healthFacilityData.setDataKey(hfrCode);
                facilityDetails.put("code", hfrCode);
                healthFacilityData.setValue(facilityDetails);
                for(Map<String, Object> clientData: listGrid ) {
                    // TODO: Add support to retrieve client details before saving
                    Map<String, Object> demographicDetails = (Map<String, Object>) clientData.get("demographicDetails");
                    String namespace = "clients-" + hfrCode;
                    String key;
                    if (demographicDetails.get("mrn") != null) {
                        key = demographicDetails.get("mrn").toString();
                    } else {
                        key = demographicDetails.get("identifier").toString();
                    }
                    Datastore clientDetailsDatastore = new Datastore();
                    Datastore clientResponse = new Datastore();
                    clientDetailsDatastore = datastoreService.getDatastoreByNamespaceAndKey(namespace,key);
                    if (clientDetailsDatastore != null) {
                        clientResponse = clientDetailsDatastore;
                        // TODO: Add support to update if there are changes
                    } else {
                        clientDetailsDatastore = new Datastore();
                        clientDetailsDatastore.setNamespace(namespace);
                        clientDetailsDatastore.setDataKey(key);
                        clientDetailsDatastore.setValue(demographicDetails);
                        clientResponse = datastoreService.saveDatastore(clientDetailsDatastore);
                    }

                    // Save or update service data for each client
                    Datastore serviceDetails = new Datastore();
                    Map<String, Object> visitDetails = (Map<String, Object>) clientData.get("visitDetails");
                    String visitDateString = visitDetails.get("visitDate").toString();
                    Boolean newThisYear = (Boolean) visitDetails.get("newThisYear");
                    Boolean isNew = (Boolean) visitDetails.get("new");
                    String pattern = "yyyy-MM-dd";
                    SimpleDateFormat formatter = new SimpleDateFormat(pattern);
                    Date visitDate = new Date();
                    try {
                        visitDate = formatter.parse(visitDateString);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
                    String visitDateFormatted = simpleDateFormat.format(visitDate);
                    String visitId;
                    if (visitDetails.get("visitId") !=null) {
                        visitId = visitDetails.get("visitId").toString();
                    } else {
                        visitId = visitDetails.get("id").toString();
                    }
                    String visitDataNamespace = "client-visits-" + clientResponse.getUuid();
                    String visitDataKey = visitDateFormatted + "-" + visitId;
                    serviceDetails = datastoreService.getDatastoreByNamespaceAndKey(visitDataNamespace, visitDataKey);
                    Datastore visitDetailsResponse = new Datastore();

                    if (serviceDetails != null) {
                        // Update incoming data
                        Map<String, Object> updatedClientData  = updateClientData(serviceDetails.getValue(), clientData);
                        serviceDetails.setValue(updatedClientData);
                        visitDetailsResponse = datastoreService.updateDatastore(serviceDetails);
                    } else {
                        serviceDetails = new Datastore();
                        serviceDetails.setNamespace(visitDataNamespace);
                        serviceDetails.setDataKey( visitDataKey);
                        Map<String, Object> ageDetails = calculateByDateOfBirthAge(demographicDetails.get("dateOfBirth").toString());
                        // TODO: Review age calculation process
                        if ((Integer) ageDetails.get("years") == 0 && (Integer) ageDetails.get("months") == 0) {
                            clientData.put("ageType", "days");
                            clientData.put("age", ageDetails.get("days"));
                        } else if ((Integer) ageDetails.get("years") > 0) {
                            clientData.put("ageType", "years");
                            clientData.put("age", ageDetails.get("years"));
                        } else if ((Integer) ageDetails.get("years") == 0 && (Integer) ageDetails.get("months") > 0) {
                            clientData.put("ageType", "months");
                            clientData.put("age", ageDetails.get("months"));
                        }
                        clientData.put("gender", formatGender(demographicDetails.get("gender").toString()));
                        clientData.put("orgUnit", hfrCode);
                        clientData.put("visitDate",visitDateString);
                        serviceDetails.setValue(clientData);
                        visitDetailsResponse = datastoreService.saveDatastore(serviceDetails);
                    }
                }
                Datastore facilitiesResponse = this.saveHealthFacilityDataToDatastore(healthFacilityData);
                returnResults.put("templateDetails", (Map<String, Object>) data.get("templateDetails"));
                returnResults.put("statusText", "OK");
                returnResults.put("statusCode", 200);
                returnResults.put("workOrder", returnStr);
                return  JSONObject.valueToString(returnResults);
            } else {
                throw new IllegalStateException("Workflow uuid or id is missing");
            }
        }

    }

    public Map<String, Object> getCodeSystems() throws Exception {
        Map<String, Object> codeSystemsData = new HashMap<>();
        Mediator FHIRMediator = mediatorsRepository.getMediatorByCategory("FHIR");
        String authType = FHIRMediator.getAuthType();
        String authToken = FHIRMediator.getAuthToken();
        String baseUrl = FHIRMediator.getBaseUrl();
        String path = "CodeSystem";
        URL url = new URL(baseUrl + path);
        return  codeSystemsData;
    }

    private Map<String, Object> updateClientData(Map<String, Object> existingClientData, Map<String, Object> incomingClientData) throws Exception {
        Map<String, Object> clientData = existingClientData;
        clientData.put("demographicDetails", existingClientData.get("demographicDetails"));
        List<Map<String, Object>> diagnosisDetails =new ArrayList<>();
        diagnosisDetails =  (List<Map<String, Object>>) existingClientData.get("diagnosisDetails");
        for (Map<String, Object> diagnosisDetail: (List<Map<String, Object>>) incomingClientData.get("diagnosisDetails")) {
            diagnosisDetails.add(diagnosisDetail);
        }

        clientData.put("diagnosisDetails", diagnosisDetails);
        List<Map<String, Object>> investigationDetails = (List<Map<String, Object>>) existingClientData.get("investigationDetails");
        for (Map<String, Object> investigationDetail: (List<Map<String, Object>>) incomingClientData.get("investigationDetails")) {
            investigationDetails.add(investigationDetail);
        }

        clientData.put("investigationDetails", investigationDetails);
        return clientData;
    }

    private Map<String, Object> calculateByDateOfBirthAge(String dateOfBirth) throws Exception {
        LocalDate today = LocalDate.now();
        LocalDate dob = LocalDate.parse(dateOfBirth);
        Period period = Period.between(dob, today);
        Map<String, Object> ageDetails = new HashMap<>();
        ageDetails.put("years", period.getYears());
        ageDetails.put("months", period.getMonths());
        ageDetails.put("days", period.getDays());
        return ageDetails;
    }

    private String formatGender(String gender) throws Exception {
        if (gender.toLowerCase().equals("male") || gender.toLowerCase().equals("m")) {
            return "M";
        } else if (gender.toLowerCase().equals("female") || gender.toLowerCase().equals("f")) {
            return "F";
        }  else {
            return "U";
        }
    }

    private Datastore saveHealthFacilityDataToDatastore(Datastore healthFacilitiesData) throws Exception {
        // Check if exists
        Datastore response;
        String namespace = healthFacilitiesData.getNamespace();
        String dataKey = healthFacilitiesData.getDataKey();
        Datastore existingHealthFacilityData = datastoreService.getDatastoreByNamespaceAndKey(namespace,dataKey);
        if (existingHealthFacilityData != null) {
            existingHealthFacilityData.setValue(healthFacilitiesData.getValue());
            response = datastoreService.updateDatastore(existingHealthFacilityData);
        } else {
            response = datastoreService.saveDatastore(healthFacilitiesData);
        }
        return response;
    }
}
