package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.ApiLogger;
import com.Adapter.icare.Domains.DynamicValidator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.ApiLoggerRepository;
import com.Adapter.icare.Repository.ValidatorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class ApiLoggerService {
    private final ApiLoggerRepository apiLoggerRepository;
    private final User authenticatedUser;

    public ApiLoggerService(ApiLoggerRepository ApiLoggerRepository, UserService userService) {
        this.apiLoggerRepository = ApiLoggerRepository;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
        }
    }

    public List<ApiLogger> getApiLogger(){
        return apiLoggerRepository.findAll();
    }

    public List<ApiLogger> getApiLogs(){
        return apiLoggerRepository.findAll();
    }

    public Page<ApiLogger> getApiLogsByPagination(Integer page, Integer pageSize, boolean paging) throws Exception {
        Pageable pageable = paging ? createPageable(page, pageSize): null;
        return this.apiLoggerRepository.getApiLogsListByPagination(pageable);
    }

    public ApiLogger getApiLogsByUuid(String uuid) {
        return apiLoggerRepository.findByUuid(uuid);
    }

    public CompletableFuture<Void> addNewApiLog(ApiLogger apiLog) {
        UUID uuid = UUID.randomUUID();
        apiLog.setUuid(uuid.toString());
        if (authenticatedUser != null) {
            apiLog.setCreatedBy(authenticatedUser);
        }
        apiLoggerRepository.save(apiLog);
        return CompletableFuture.completedFuture(null);
    }

    public void deleteApiLog(Long apiLogId) {

        boolean exists = apiLoggerRepository.existsById(apiLogId);
        if(!exists){
            throw new IllegalStateException("The api log with id "+apiLogId+ " does not exist");
        }
        apiLoggerRepository.deleteById(apiLogId);
    }

    private Pageable createPageable(Integer page, Integer pageSize) throws Exception {
        if (page < 1) {
            throw new Exception("Page can not be less than zero");
        } else {
            return PageRequest.of(page-1, pageSize);
        }
    }
}
