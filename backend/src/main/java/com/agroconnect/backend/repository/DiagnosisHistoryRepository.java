package com.agroconnect.backend.repository;

import com.agroconnect.backend.model.DiagnosisHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisHistoryRepository extends JpaRepository<DiagnosisHistory, String> {
    List<DiagnosisHistory> findByUserIdOrderByTimestampDesc(String userId);
}
