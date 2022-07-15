package com.Adapter.icare.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Services.InstanceService;

@RestController
@RequestMapping("api/v1/instance")
public class InstancesController {
    
    private final InstanceService instanceService;
    
    public InstancesController(InstanceService instanceService) {
        this.instanceService = instanceService;
    }

    @GetMapping
    public List<Instances> getInstances(){
        return instanceService.getInstances();
    }

    @PostMapping
    public void addInstances(@RequestBody Instances instances){
        instanceService.AddNewInstance(instances);
    }

    @DeleteMapping("/deleteInstances/{instanceId}")
    public void deleteInstance(@PathVariable("instanceId") Long instanceId){
        instanceService.deleteInstance(instanceId);

    }

    @PutMapping("/updateInstances/{instanceId}")
    public void updateInstances(@PathVariable("instanceId") Long instanceId,@RequestParam(required = false) String url){
        instanceService.updateInstances(instanceId,url);
    }
}
