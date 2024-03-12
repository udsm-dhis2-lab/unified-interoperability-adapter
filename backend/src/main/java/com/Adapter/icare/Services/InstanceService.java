package com.Adapter.icare.Services;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Repository.InstancesRepository;

@Service
public class InstanceService {

    private final InstancesRepository instancesRepository;

    public InstanceService(InstancesRepository instancesRepository) {
        this.instancesRepository = instancesRepository;
    }

    public List<Instances> getInstances(){
       return instancesRepository.findAll();
    }

    public Instances getInstanceByUuid(String uuid) {
        return instancesRepository.getInstanceUuid(uuid);
    }

    public Instances AddNewInstance(Instances instances) {
        UUID uuid = UUID.randomUUID();
        instances.setUuid(uuid);
        return instancesRepository.save(instances);
    }

    public void deleteInstance(Long instanceId) {

        boolean exists = instancesRepository.existsById(instanceId);
        if(!exists){
            throw new IllegalStateException("The instance with id "+instanceId+ " does not exist");
        }
        instancesRepository.deleteById(instanceId);
    }

    public Instances updateInstances(Instances instances) {
        return instancesRepository.save(instances);
    }

}
