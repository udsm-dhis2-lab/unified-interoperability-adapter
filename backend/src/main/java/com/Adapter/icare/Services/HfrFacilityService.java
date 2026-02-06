package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.ApiLogger;
import com.Adapter.icare.Domains.HfrFacility;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Dtos.HfrApiResponseDTO;
import com.Adapter.icare.Dtos.HfrMetaData;
import com.Adapter.icare.Repository.ApiLoggerRepository;
import com.Adapter.icare.Repository.HfrFacilityRepository;
import com.Adapter.icare.Utils.MapUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class HfrFacilityService {
    private final HfrFacilityRepository hfrFacilityRepository;
    private final User authenticatedUser;
    private final RestTemplate restTemplate;

    @Value("${integration.hfr.url}")
    private String HFR_URL;

    public HfrFacilityService(HfrFacilityRepository hfrFacilityRepository, UserService userService,  RestTemplate restTemplate) {
        this.hfrFacilityRepository = hfrFacilityRepository;
        this.restTemplate =  restTemplate;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
        }
    }

    public List<HfrFacility> getHfrFacilities(){
        return hfrFacilityRepository.findAll();
    }

    public Page<HfrFacility> getHfrFacilityListByPagination(Integer page, Integer pageSize, boolean paging, String fac_id_number, String name, String region, String district, String council) throws Exception {
        Pageable pageable = paging ? createPageable(page, pageSize): null;
        return this.hfrFacilityRepository.getHfrFacilityListByPagination(pageable, fac_id_number, name, region, district, council);
    }

    public HfrFacility getHfrFacilityByUuid(String uuid) {
        return hfrFacilityRepository.findByUuid(uuid);
    }

    public HfrFacility getHfrFacilityById(String facIdNumber) { return hfrFacilityRepository.findByFacIdNumber(facIdNumber); }

    public void createHfrFacilities(List<HfrFacility> hfrFacilities) {
        try {
            if (hfrFacilities != null && !hfrFacilities.isEmpty()) {
                this.hfrFacilityRepository.saveAll(hfrFacilities);
            } else {
                throw new IllegalStateException("Cannot add empty facilities");
            }
        }  catch (IllegalStateException e) {
            throw new IllegalStateException(e);
        }
    }

    public HfrFacility createHfrFacility(HfrFacility hfrFacility) {
        if (authenticatedUser != null) {
            hfrFacility.setCreatedBy(authenticatedUser);
        }
        UUID uuid = UUID.randomUUID();
        hfrFacility.setUuid(uuid.toString());
        return this.hfrFacilityRepository.save(hfrFacility);
    }

    public Boolean synchronizeHfrFacilities(Integer pageNo, Integer pageSize, Boolean forceSync){

        try {

            String baseUrl = this.HFR_URL + "/get-health-facilities-from-hfr";
            UriComponentsBuilder url = UriComponentsBuilder.fromHttpUrl(baseUrl).queryParam("search_query", "operating")
                    .queryParam("r", "api/health-facility/health-facility-list");

            if(pageNo == null){
                pageNo = 1;
            }

            int totalPages = 1;
            int totalRecords = 0;
            if(!forceSync){
                String finalUrl = url.queryParam("pageSize", 1).toUriString();
                HfrApiResponseDTO response = restTemplate.getForObject(finalUrl, HfrApiResponseDTO.class);

                if (response != null && response.getMetaData() != null) {
                    HfrMetaData metadata = response.getMetaData();
                    totalRecords = metadata.getTotalCount();
                }
                var existingTotalRecords = this.hfrFacilityRepository.count();
                if ( existingTotalRecords == totalRecords) return true;
            }

            do {
                String finalUrl = url.queryParam("page", pageNo).queryParam("pageSize", pageSize).toUriString();
                HfrApiResponseDTO response = restTemplate.getForObject(finalUrl, HfrApiResponseDTO.class);

                if (response != null && response.getMetaData() != null) {
                    HfrMetaData metadata = response.getMetaData();
                    totalPages = metadata.getPageCount();
                }

                if (response != null && response.getData() != null) {
                    List<HfrFacility> apiFacilities = response.getData();

                    for( HfrFacility facility : apiFacilities){
                        this.updateOrCreateHfrFacility(facility);
                    }
                }
                pageNo++;
            } while (pageNo <= totalPages);
            return true;
        } catch (Exception e) {
            System.out.println("HFR DATA SYNCHRONIZATION FAILED: " + e);
            return false;
        }
    }

    public HfrFacility updateOrCreateHfrFacility(HfrFacility hfrFacility) {


        HfrFacility existingFacility = getHfrFacilityById(hfrFacility.getFacIdNumber());
        if (existingFacility != null) {

            if (authenticatedUser != null) {
                hfrFacility.setLastUpdatedBy(authenticatedUser);
            }

            BeanUtils.copyProperties(hfrFacility, existingFacility, MapUtils.getNullPropertyNames(hfrFacility));
            return this.hfrFacilityRepository.save(existingFacility);
        }

        if (authenticatedUser != null) {
            hfrFacility.setCreatedBy(authenticatedUser);
        }

        UUID uuid = UUID.randomUUID();
        hfrFacility.setUuid(uuid.toString());

        return this.hfrFacilityRepository.save(hfrFacility);
    }

    private Pageable createPageable(Integer page, Integer pageSize) throws Exception {
        if (page < 1) {
            throw new Exception("Page can not be less than zero");
        } else {
            return PageRequest.of(page-1, pageSize);
        }
    }
}
