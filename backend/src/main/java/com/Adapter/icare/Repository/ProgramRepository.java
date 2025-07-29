package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    Program findByProgramId(String programId);
    Program findByUuid(String uuid);
}

