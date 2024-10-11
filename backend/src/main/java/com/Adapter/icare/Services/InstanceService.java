package com.Adapter.icare.Services;

import java.util.List;
import java.util.UUID;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.Adapter.icare.Domains.Instance;
import com.Adapter.icare.Repository.InstancesRepository;

@Service
public class InstanceService {

    private final InstancesRepository instancesRepository;
    private final UserService userService;
    private final Authentication authentication;
    private final User authenticatedUser;

    public InstanceService(InstancesRepository instancesRepository,
                           UserService userService) {
        this.instancesRepository = instancesRepository;
        this.userService =  userService;
        this.authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = this.userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
            // TODO: Redirect to login page
        }
    }

    public List<Instance> getInstances(){
       return instancesRepository.findAll();
    }

    public Page<Instance> getInstancesByPagination(Integer page, Integer pageSize, String code, String url, String ouUid, String q) throws Exception {
        Pageable pageable = PageRequest.of(page, pageSize);
        return instancesRepository.getInstancesListByPagination(code,ouUid,url,q,pageable);
    }

    public Instance getInstanceByUuid(String uuid) {
        return instancesRepository.getInstanceByUuid(uuid);
    }

    public Instance AddNewInstance(Instance instance) {
        UUID uuid = UUID.randomUUID();
        instance.setUuid(uuid.toString());
        if (authenticatedUser != null) {
            instance.setCreatedBy(authenticatedUser);
        }
        return instancesRepository.save(instance);
    }

    public void deleteInstance(Long instanceId) {

        boolean exists = instancesRepository.existsById(instanceId);
        if(!exists){
            throw new IllegalStateException("The instance with id "+instanceId+ " does not exist");
        }
        instancesRepository.deleteById(instanceId);
    }

    public Instance updateInstances(Instance instance) {
        return instancesRepository.save(instance);
    }

}
