package com.Adapter.icare.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.Adapter.icare.Domains.User;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT * FROM users u WHERE u.username=:username", nativeQuery = true)
    User findByUsername(String username);

    @Query(value = "SELECT * FROM users u WHERE u.uuid =:uuid ", nativeQuery = true)
    User findByUuid(String uuid);
    
    // Methods to find non-retired users only
    @Query(value = "SELECT * FROM users u WHERE u.retired IS NULL OR u.retired = false", nativeQuery = true)
    List<User> findAllActiveUsers();
    
    @Query(value = "SELECT * FROM users u WHERE (u.retired IS NULL OR u.retired = false)", 
           countQuery = "SELECT count(*) FROM users u WHERE (u.retired IS NULL OR u.retired = false)",
           nativeQuery = true)
    Page<User> findAllActiveUsers(Pageable pageable);
}
