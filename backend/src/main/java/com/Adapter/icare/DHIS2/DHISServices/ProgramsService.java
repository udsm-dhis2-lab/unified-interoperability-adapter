package com.Adapter.icare.DHIS2.DHISServices;

import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Domains.Program;
import com.Adapter.icare.Repository.InstancesRepository;
import com.Adapter.icare.Repository.ProgramRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.Base64;

@Service
public class ProgramsService {
    private final InstancesRepository instancesRepository;
    private final ProgramRepository programRepository;

    public ProgramsService(InstancesRepository instancesRepository, ProgramRepository programRepository) {
        this.instancesRepository = instancesRepository;
        this.programRepository = programRepository;
    }

    public Map<String, Object> getDhis2Programs(String instanceUuid, Integer page, Integer pageSize, String q, String programType, String programId) throws Exception {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> programsList = new ArrayList<>();
        JSONObject pagerInfo = new JSONObject();
        try {
            Instance instance = instancesRepository.getInstanceByUuid(instanceUuid);
            String instanceUrl = instance.getUrl();
            String username = instance.getUsername();
            String password = instance.getPassword();
            StringBuilder path;
            boolean isSingleProgram = programId != null && !programId.isEmpty();
            if (isSingleProgram) {
                path = new StringBuilder("/api/programs/" + programId + "?fields=programTrackedEntityAttributes[trackedEntityAttribute[id,formName,displayName]],id,displayName,displayShortName,description,programType,style,displayFrontPageList,useFirstStageDuringRegistration,onlyEnrollOnce,minAttributesRequiredToSearch,enrollmentDateLabel,incidentDateLabel,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,displayIncidentDate,dataEntryForm[id,htmlCode],trackedEntityType[id],categoryCombo[id,displayName,isDefault,categories[id,displayName]],programStages[id,autoGenerateEvent,openAfterEnrollment,hideDueDate,allowGenerateNextVisit,repeatable,generatedByEnrollmentDate,reportDateToUse,minDaysFromStart,name,displayName,description,displayExecutionDateLabel,displayDueDateLabel,formType,featureType,validationStrategy,enableUserAssignment,style,dataEntryForm[id,htmlCode],programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id,name,displayName,formName,optionSet[id,name,options[id,name,code]]],programSections[id,displayFormName,sortOrder,trackedEntityAttributes],programTrackedEntityAttributes[trackedEntityAttribute[id],displayInList,searchable,mandatory,renderOptionsAsRadio,allowFutureDate]");
            } else {
                path = new StringBuilder("/api/programs?fields=id,displayName,displayShortName,description,programType,style,displayFrontPageList,useFirstStageDuringRegistration,onlyEnrollOnce,minAttributesRequiredToSearch,enrollmentDateLabel,incidentDateLabel,featureType,selectEnrollmentDatesInFuture,selectIncidentDatesInFuture,displayIncidentDate,dataEntryForm[id,htmlCode],trackedEntityType[id],categoryCombo[id,displayName,isDefault,categories[id,displayName]],programStages[id,autoGenerateEvent,openAfterEnrollment,hideDueDate,allowGenerateNextVisit,repeatable,generatedByEnrollmentDate,reportDateToUse,minDaysFromStart,name,displayName,description,displayExecutionDateLabel,displayDueDateLabel,formType,featureType,validationStrategy,enableUserAssignment,style,dataEntryForm[id,htmlCode],programStageSections[id,displayName,displayDescription,sortOrder,dataElements[id,name,displayName,formName]],programSections[id,displayFormName,sortOrder,trackedEntityAttributes],programTrackedEntityAttributes[trackedEntityAttribute[id],displayInList,searchable,mandatory,renderOptionsAsRadio,allowFutureDate]");
                path.append("&page=").append(page).append("&pageSize=").append(pageSize);
                if (programType != null && !programType.isEmpty()) {
                    path.append("&filter=programType:eq:").append(programType);
                }
                if (q != null && !q.isEmpty()) {
                    path.append("&filter=displayName:ilike:").append(q);
                }
            }
            URL url = new URL(instanceUrl.concat(path.toString()));
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            String userCredentials = username + ":" + password;
            String basicAuth = "Basic " + Base64.getEncoder().encodeToString(userCredentials.getBytes());
            httpURLConnection.setRequestProperty("Authorization", basicAuth);
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.setRequestProperty("Content-Type", "application/json");
            StringBuilder responseContent = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    responseContent.append(line);
                }
            }
            if (isSingleProgram) {
                JSONObject programObj = new JSONObject(responseContent.toString());
                Map<String, Object> programMap = jsonToMap(programObj);
                programsList.add(programMap);
                // For single program, pager is not relevant
                pagerInfo.put("page", 1);
                pagerInfo.put("total", 1);
                pagerInfo.put("pageSize", 1);
                pagerInfo.put("totalPages", 1);
            } else {
                JSONObject jsObject = new JSONObject(responseContent.toString());
                pagerInfo = jsObject.getJSONObject("pager");
                JSONArray js = jsObject.getJSONArray("programs");
                for (int i = 0; i < js.length(); i++) {
                    JSONObject programObj = js.getJSONObject(i);
                    Map<String, Object> programMap = jsonToMap(programObj);
                    programsList.add(programMap);
                }
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
        response.put("programs", programsList);
        Map<String, Object> pager = new HashMap<>();
        pager.put("page", pagerInfo.optInt("page"));
        pager.put("total", pagerInfo.optInt("total"));
        pager.put("pageSize", pagerInfo.optInt("pageSize"));
        pager.put("totalPages", pagerInfo.optInt("pageCount"));
        response.put("pager", pager);
        return response;
    }

    public Program saveSelectedProgram(String instanceUuid, String programId) throws Exception {
        Instance instance = instancesRepository.getInstanceByUuid(instanceUuid);
        if (instance == null) throw new Exception("Instance not found");
        String instanceUrl = instance.getUrl();
        String username = instance.getUsername();
        String password = instance.getPassword();
        String path = "/api/programs/" + programId + "?fields=*";
        URL url = new URL(instanceUrl.concat(path));
        HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
        String userCredentials = username + ":" + password;
        String basicAuth = "Basic " + Base64.getEncoder().encodeToString(userCredentials.getBytes());
        httpURLConnection.setRequestProperty("Authorization", basicAuth);
        httpURLConnection.setRequestMethod("GET");
        httpURLConnection.setRequestProperty("Content-Type", "application/json");
        StringBuilder responseContent = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                responseContent.append(line);
            }
        }
        JSONObject programObj = new JSONObject(responseContent.toString());
        Map<String, Object> allFields = jsonToMap(programObj);
        Map<String, Object> programStageSections = new HashMap<>();
        if (programObj.has("programStageSections")) {
            programStageSections.put("programStageSections", jsonToList(programObj.getJSONArray("programStageSections")));
        }
        // Save to entity
        Program program = new Program();
        program.setProgramId(programId);
        program.setDisplayName(programObj.optString("displayName"));
        program.setDisplayShortName(programObj.optString("displayShortName"));
        program.setDescription(programObj.optString("description"));
        program.setProgramFields(allFields);
        program.setProgramStageSections(programStageSections);
        program.setInstances(instance);
        return programRepository.save(program);
    }

    /**
     * Recursively converts a JSONObject or JSONArray to a Java Map or List.
     */
    private Map<String, Object> jsonToMap(JSONObject json) {
        Map<String, Object> retMap = new HashMap<>();
        for (String key : json.keySet()) {
            Object value = json.get(key);
            if (value instanceof JSONObject) {
                retMap.put(key, jsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                retMap.put(key, jsonToList((JSONArray) value));
            } else {
                retMap.put(key, value);
            }
        }
        return retMap;
    }

    private List<Object> jsonToList(JSONArray array) {
        List<Object> retList = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof JSONObject) {
                retList.add(jsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                retList.add(jsonToList((JSONArray) value));
            } else {
                retList.add(value);
            }
        }
        return retList;
    }
}
