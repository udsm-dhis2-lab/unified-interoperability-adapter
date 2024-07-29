package com.Adapter.icare.Services;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Repository.DatastoreRepository;
import javassist.NotFoundException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class DatastoreService {
    private final DatastoreRepository datastoreRepository;

    public DatastoreService(DatastoreRepository datastoreRepository) {
        this.datastoreRepository = datastoreRepository;
    }

    public Datastore saveDatastore(Datastore datastore) throws Exception {
        if (datastore.getUuid() == null) {
            UUID uuid = UUID.randomUUID();
            datastore.setUuid(uuid.toString());
        }
        return datastoreRepository.save(datastore);
    }

    public List<Datastore> getDatastore() throws Exception {
        return datastoreRepository.findAll();
    }

    public Datastore getDatastoreByUuid(String uuid) throws Exception {
        return  datastoreRepository.getDatastoreByUuid(uuid);
    }

    public Datastore getDatastoreByNamespaceAndKey(String namespace, String key) throws Exception {
        return  datastoreRepository.getDatastoreByNamespaceAndKey(namespace, key);
    }

    public Datastore updateDatastore(Datastore datastore) throws Exception {
        if (datastore.getUuid() != null) {
            String uuid = datastore.getUuid();
            Datastore datastoreToUpdate = datastoreRepository.getDatastoreByUuid(uuid);
            if (datastoreToUpdate != null) {
                datastore.setId(datastoreToUpdate.getId());
                return datastoreRepository.save(datastore);
            } else {
                throw new IllegalStateException("Datastore with uuid " + uuid + " does not exists");
            }
        } else {
            throw new IllegalStateException("Datastore uuid is not set");
        }

    }

    public void deleteDatastore(String uuid) throws NotFoundException {
        if (uuid == null) {
            throw new IllegalStateException("uuid is missing");
        } else {
            Datastore datastore = datastoreRepository.getDatastoreByUuid(uuid);
            if (datastore != null) {
                datastoreRepository.deleteById(datastore.getId());
            } else {
                throw new NotFoundException(
                        String.format("Datastore with uuid " + uuid + " does not exists"));
            }

        }
    }

    public List<Datastore> getDatastoreNamespaceDetails(String namespace) throws Exception {
        return datastoreRepository.getDatastoreByNamespace(namespace);
    }

    public List<Datastore> getClientsVisitsDataByNameSpace(String namespace) throws Exception {
        return datastoreRepository.getDatastoreClientsVisitsNamespaceDetails(namespace);
    }

    public List<Datastore> getClientsVisitsDataByKey(String key) throws Exception {
        return datastoreRepository.getDatastoreByDataKey(key);
    }

    public List<Datastore> getClientsVisits(String key, String ageType, Integer startAge, Integer endAge, String gender, String diagnosis) throws Exception {
        if (gender == null && diagnosis == null) {
            return datastoreRepository.getDatastoreByDataKeyAndAgeGroup(key, ageType,startAge, endAge);
        } else if (gender != null &&diagnosis == null) {
            return datastoreRepository.getDatastoreByDataKeyAndAgeGroupAndGender(key, ageType,startAge, endAge, gender);
        } else if (gender == null &&diagnosis != null) {
            return datastoreRepository.getDatastoreByDataKeyAndAgeGroupAndDiagnosis(key, ageType,startAge, endAge, diagnosis);
        } else if (gender != null &&diagnosis != null) {
            return datastoreRepository.getDatastoreByDataKeyAndAgeGroupAndGenderAndDiagnosis(key, ageType,startAge, endAge, gender, diagnosis);
        } else {
            return new ArrayList<Datastore>();
        }
    }

    public List<Map<String, Object>> getAggregatedData(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String mappingsNamespace, String mappingsKey) throws Exception {
        if (gender == null && mappingsNamespace == null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender != null &&mappingsNamespace == null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender == null &&mappingsNamespace != null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender != null && mappingsNamespace != null && mappingsKey != null) {
            return datastoreRepository.getDatastoreAggregateByDatesAndAgeGroupAndGenderAndDiagnosis( startDate,endDate, ageType,startAge, endAge, gender, mappingsNamespace, mappingsKey);
        } else {
            return new ArrayList<Map<String, Object>>();
        }
    }
}
