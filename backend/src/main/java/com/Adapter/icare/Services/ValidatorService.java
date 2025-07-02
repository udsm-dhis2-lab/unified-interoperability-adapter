package com.Adapter.icare.Services;

import com.Adapter.icare.Configurations.CustomUserDetails;
import com.Adapter.icare.Domains.Mediator;
import com.Adapter.icare.Domains.User;
import com.Adapter.icare.Domains.Validator;
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

    public List<Validator> getValidators(){
        return validatorRepository.findAll();
    }

    public Page<Validator> getValidatorsByPagination(Integer page, Integer pageSize, boolean paging, String code, String name) throws Exception {
        Pageable pageable = paging ? createPageable(page, pageSize): null;
        return validatorRepository.getValidatorsListByPagination(code, name, pageable);
    }

    public Validator getValidatorsByUuid(String uuid) {
        return validatorRepository.findByUuid(uuid);
    }

    public Validator addNewValidator(Validator validator) {
        UUID uuid = UUID.randomUUID();
        validator.setUuid(uuid.toString());
        if (authenticatedUser != null) {
            validator.setCreatedBy(authenticatedUser);
        }
        return validatorRepository.save(validator);
    }

    public void deleteValidator(Long validatorId) {

        boolean exists = validatorRepository.existsById(validatorId);
        if(!exists){
            throw new IllegalStateException("The validator with id "+validatorId+ " does not exist");
        }
        validatorRepository.deleteById(validatorId);
    }

    public Validator updateValidator(Validator validator) {
        if (authenticatedUser != null) {
            validator.setLastUpdatedBy(authenticatedUser);
        }
        if (validator.getUuid() != null) {
            String uuid = validator.getUuid();
            Validator validatorToUpdate = validatorRepository.findByUuid(uuid);
            if (validatorToUpdate != null) {
                return validatorRepository.save(validator);
            } else {
                throw new IllegalStateException("Validator with uuid " + uuid + " does not exists");
            }
        } else {
            throw new IllegalStateException("Validator uuid is not set");
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
