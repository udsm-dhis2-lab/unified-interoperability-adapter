package com.Adapter.icare.Services;

import com.Adapter.icare.Domains.Datastore;
import com.Adapter.icare.Repository.DatastoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

    public void deleteDatastore(String uuid) throws Exception {
        if (uuid == null) {
            throw new IllegalStateException("uuid is missing");
        } else {
            Datastore datastore = datastoreRepository.getDatastoreByUuid(uuid);
            if (datastore != null) {
                datastoreRepository.deleteById(datastore.getId());
            } else {
                throw new IllegalStateException("Datastore with uuid " + uuid + " does not exists");
            }

        }
    }

    public List<Datastore> getDatastoreNamespaceDetails(String namespace) throws Exception {
        return  datastoreRepository.getDatastoreByNamespace(namespace);
    }
}
