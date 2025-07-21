package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.DynamicValidator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Repository.ValidatorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ValidatorService {
    private final ValidatorRepository validatorRepository;

    private final User authenticatedUser;

    public ValidatorService(ValidatorRepository validatorRepository, UserService userService) {
        this.validatorRepository = validatorRepository;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            this.authenticatedUser = userService.getUserByUsername(((CustomUserDetails) authentication.getPrincipal()).getUsername());
        } else {
            this.authenticatedUser = null;
        }
    }

    public List<DynamicValidator> getValidators(){
        return validatorRepository.findAll();
    }

    public Page<DynamicValidator> getValidatorsByPagination(Integer page, Integer pageSize, boolean paging, String code, String name) throws Exception {
        Pageable pageable = paging ? createPageable(page, pageSize): null;
        return validatorRepository.getValidatorsListByPagination(code, name, pageable);
    }

    public DynamicValidator getValidatorByUuid(String uuid) {
        return validatorRepository.findByUuid(uuid);
    }

    public DynamicValidator addNewValidator(DynamicValidator dynamicValidator) {
        UUID uuid = UUID.randomUUID();
        dynamicValidator.setUuid(uuid.toString());
        if (authenticatedUser != null) {
            dynamicValidator.setCreatedBy(authenticatedUser);
        }
        return validatorRepository.save(dynamicValidator);
    }

    public void deleteValidator(Long validatorId) {

        boolean exists = validatorRepository.existsById(validatorId);
        if(!exists){
            throw new IllegalStateException("The validator with id "+validatorId+ " does not exist");
        }
        validatorRepository.deleteById(validatorId);
    }

    public DynamicValidator updateValidator(DynamicValidator dynamicValidator) {
        if (authenticatedUser != null) {
            dynamicValidator.setLastUpdatedBy(authenticatedUser);
        }
        DynamicValidator dynamicValidatorToUpdate = validatorRepository.findByUuid(dynamicValidator.getUuid());
        if (dynamicValidatorToUpdate != null) {
            dynamicValidatorToUpdate.setName(dynamicValidator.getName() == null ? dynamicValidatorToUpdate.getName() : dynamicValidator.getName());
            dynamicValidatorToUpdate.setCode(dynamicValidator.getCode() == null ? dynamicValidatorToUpdate.getCode() : dynamicValidator.getCode());
            dynamicValidatorToUpdate.setRuleExpression(dynamicValidator.getRuleExpression() == null ? dynamicValidatorToUpdate.getRuleExpression() : dynamicValidator.getRuleExpression());
            dynamicValidatorToUpdate.setErrorMessage(dynamicValidator.getErrorMessage() == null ? dynamicValidatorToUpdate.getErrorMessage() : dynamicValidator.getErrorMessage());
            dynamicValidatorToUpdate.setDescription(dynamicValidator.getDescription() == null ? dynamicValidatorToUpdate.getDescription() : dynamicValidator.getDescription());

            return validatorRepository.save(dynamicValidatorToUpdate);
        } else {
            throw new IllegalStateException("Validator with uuid " + dynamicValidator.getUuid() + " does not exists");
        }
    }

    private Pageable createPageable(Integer page, Integer pageSize) throws Exception {
        if (page < 1) {
            throw new Exception("Page can not be less than zero");
        } else {
            return PageRequest.of(page-1, pageSize);
        }
    }
}
