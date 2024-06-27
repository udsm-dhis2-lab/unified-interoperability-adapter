package com.Adapter.icare.Services;

import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Repository.MediatorsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class MediatorsService {
    private final MediatorsRepository mediatorsRepository;

    public MediatorsService(MediatorsRepository mediatorsRepository) {
        this.mediatorsRepository = mediatorsRepository;
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
        System.out.println(JSONObject.valueToString((Map<String, Object>) data.get("templateDetails")));
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
                        System.out.println(authentication);
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
}
