package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.DatastoreRepository;
import com.google.common.collect.Maps;
import javassist.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.*;

@Service
public class DatastoreService {
    private final DatastoreRepository datastoreRepository;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public DatastoreService(DatastoreRepository datastoreRepository, UserService userService) {
        this.datastoreRepository = datastoreRepository;
        this.userService = userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public Datastore saveDatastore(Datastore datastore) throws Exception {
        if (datastore.getUuid() == null) {
            UUID uuid = UUID.randomUUID();
            datastore.setUuid(uuid.toString());
        }
        if (this.authenticatedUser != null) {
            datastore.setCreatedBy(authenticatedUser);
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
                if (authenticatedUser != null) {
                    datastore.setLastUpdatedBy(authenticatedUser);
                }
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


    public Page<Datastore> getDatastoreNamespaceDetailsUsingPagination(String namespace, Integer page, Integer pageSize, String key) throws Exception {
        Pageable pageable = createPageable(page, pageSize);
        return datastoreRepository.getDatastoreByNamespaceByPagination(namespace, pageable, key);
    }

    public Page<Datastore> getDatastoreNamespaceDetailsByPagination(String namespace,
                                                                    String category,
                                                                    String department,
                                                                    String q,
                                                                    String code,
                                                                    String group,
                                                                    Integer page,
                                                                    Integer pageSize,
                                                                    boolean paging) throws Exception {
        Pageable pageable = createPageable(page, pageSize);
        return datastoreRepository.getDatastoreByNamespaceWithPagination(namespace, category, department, q, code, group, paging ? pageable: null);
    }

    public Page<Datastore> getDatastoreMatchingNamespaceFilterByPagination(String namespaceFilter, String key, String q, String code, Integer page, Integer pageSize) throws Exception {
        Pageable pageable = createPageable(page, pageSize);
        return datastoreRepository.getDatastoreMatchingNamespaceFilterByPagination(namespaceFilter, key, q, code, pageable);
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

    public List<Map<String, Object>> getAggregatedDataByDiagnosisDetails(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String mappingsNamespace, String mappingsKey, String orgUnitCode) throws Exception {
        if (gender == null && mappingsNamespace == null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender != null &&mappingsNamespace == null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender == null &&mappingsNamespace != null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender != null && mappingsNamespace != null && mappingsKey != null) {
            return datastoreRepository.getDatastoreAggregateByDatesAndAgeGroupAndGenderAndDiagnosis( startDate,endDate, ageType,startAge, endAge, gender, mappingsNamespace, mappingsKey,orgUnitCode);
        } else {
            return new ArrayList<Map<String, Object>>();
        }
    }

    public List<Map<String, Object>> getAggregatedVisitsData(String startDate, String endDate,
                                                             String ageType, Integer startAge,
                                                             Integer endAge, String gender,
                                                             String orgUnitCode, String newThisYear) throws Exception {
        return datastoreRepository.getDatastoreAggregateVisitsByDatesAndAgeGroupAndGender( startDate,endDate, ageType,startAge, endAge, gender,orgUnitCode, newThisYear);
    }

    public List<Map<String, Object>> getAggregatedNewOrRepeatVisitsData(String startDate, String endDate,
                                                                        String ageType, Integer startAge,
                                                                        Integer endAge, String gender,
                                                                        String orgUnitCode, String isNewVisit) {
        return datastoreRepository.getDatastoreAggregateNewOrRepeatVisitsByDatesAndAgeGroupAndGender( startDate,endDate, ageType,startAge, endAge, gender,orgUnitCode, isNewVisit);
    }

    public List<Map<String, Object>> getAggregatedVisitsDataByPaymentCategory(String startDate, String endDate,
                                                                        String ageType, Integer startAge,
                                                                        Integer endAge, String gender,
                                                                        String orgUnitCode, String paymentCategory) {
        return datastoreRepository.getDatastoreAggregateVisitsByPaymentCategory( startDate,endDate, ageType,startAge, endAge, gender,orgUnitCode, paymentCategory);
    }

    public List<Map<String, Object>> getAggregatedVisitsDataByReferralDetails(String startDate, String endDate,
                                                                              String ageType, Integer startAge,
                                                                              Integer endAge, String gender,
                                                                              String orgUnitCode, String referred) {
        return datastoreRepository.getDatastoreAggregateVisitsByReferralDetails( startDate,endDate, ageType,startAge, endAge, gender,orgUnitCode, referred);
    }

    public List<Map<String, Object>> getAggregatedDeathDataByDiagnosisDetails(String startDate, String endDate, String ageType, Integer startAge, Integer endAge, String gender, String mappingsNamespace, String mappingsKey, String orgUnitCode) throws Exception {
        if (gender == null && mappingsNamespace == null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender != null &&mappingsNamespace == null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender == null &&mappingsNamespace != null) {
            return new ArrayList<Map<String, Object>>();
        } else if (gender != null && mappingsNamespace != null && mappingsKey != null) {
            return datastoreRepository.getDatastoreAggregateDeathsByDiagnosis( startDate,endDate, ageType,startAge, endAge, gender, mappingsNamespace, mappingsKey,orgUnitCode);
        } else {
            return new ArrayList<Map<String, Object>>();
        }
    }


    public List<Map<String, Object>> getAggregateDataFromDailyAggregatedData(String id, String startDate, String endDate) throws Exception {
        return datastoreRepository.getAggregateDataByStartDateAndEndDate(id,startDate,endDate);
    }

    public Page<Datastore> getDatastoreMatchingParams(String namespace, String key, String version,
                                                      String releaseYear, String code, String q, Integer page, Integer pageSize, String group) throws Exception {
        Pageable pageable = createPageable(page, pageSize);
        return datastoreRepository.findDatastoreDataBySpecifiedParams(namespace,key,version,releaseYear,code,q,pageable, group);
    }

    public Page<Datastore> getDatastoreICDDataByParams(String namespace, String key, String version,
                                                      String releaseYear, String chapter, String block, String category, String code,
                                                       String q, Integer page, Integer pageSize) throws Exception {
        Pageable pageable = createPageable(page, pageSize);
        return datastoreRepository.getDatastoreICDDataByParams(namespace,key,version,releaseYear,chapter, block, category, code,q,pageable);
    }

    public List<Datastore> getICDDataByChapter(String namespace, String chapter, String release, String version) throws Exception {
        return datastoreRepository.getICDDataByChapter(namespace,chapter,release,version);
    }

    public List<Datastore> getICDDataByBlock(String namespace, String block, String release, String version) throws Exception {
        return datastoreRepository.getICDDataByBlock(namespace,block,release,version);
    }

    public List<Datastore> getICDDataByCategory(String namespace, String category, String release, String version) throws Exception {
        return datastoreRepository.getICDDataByCategory(namespace,category,release,version);
    }

    private Pageable createPageable(Integer page, Integer pageSize) throws Exception {
        if (page < 1) {
            throw new Exception("Page can not be less than zero");
        } else {
            return PageRequest.of(page-1, pageSize);
        }
    }
}
