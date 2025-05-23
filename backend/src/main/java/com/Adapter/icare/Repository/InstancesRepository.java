/**BSD 3-Clause License

 Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.

 * Neither the name of the copyright holder nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package com.Adapter.icare.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Adapter.icare.Domains.Instance;

@Repository
public interface InstancesRepository extends JpaRepository<Instance,Long> {

    List<Instance> findAll();

    @Query(value = "SELECT * FROM instances WHERE uuid=:uuid",nativeQuery = true)
    Instance getInstanceByUuid(String uuid);

    @Query(value = "SELECT * FROM instances WHERE (:code IS NULL OR code=:code) " +
            " AND (:url IS NULL OR url=:url) " +
            " AND (:ouUid IS NULL OR organisation_unit_id=:ouUid) " +
            " AND (:q IS NULL OR name LIKE CONCAT('%',:q,'%'))",
            countQuery = "SELECT COUNT(*) FROM instances WHERE (:code IS NULL OR code =:code ) " +
                    " AND (:url IS NULL OR url=:url) " +
                    " AND (:ouUid IS NULL OR organisation_unit_id=:ouUid) " +
                    " AND (:q IS NULL OR name LIKE CONCAT('%',:q,'%'))",nativeQuery = true)
    Page<Instance> getInstancesListByPagination(String code, String ouUid, String url, String q, Pageable pageable);
}
