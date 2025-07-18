package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.SellFilterRequest;
import com.moonhair.moonhair.entities.HoaDonEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class HoaDonRepositoryImpl implements HoaDonRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<HoaDonEntity> findByFilter(SellFilterRequest request) {
        StringBuilder sql = new StringBuilder("SELECT h FROM HoaDonEntity h WHERE 1=1 and h.isDelete IS NULL ");

        Map<String, Object> params = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        if (request.getCustomerName() != null && !request.getCustomerName().isEmpty()) {
            sql.append(" AND LOWER(h.tenKhach) LIKE :customerName");
            params.put("customerName", "%" + request.getCustomerName().toLowerCase() + "%");
        }

        if (request.getIsToday() != null && request.getIsToday()) {
            sql.append(" AND DATE(h.ngayHoaDon) = :getDate");
            params.put("getDate", LocalDate.now());
        } else if (request.getFromDate() != null && !request.getFromDate().isEmpty() && request.getToDate() != null && !request.getToDate().isEmpty()) {
            sql.append(" AND DATE(h.ngayHoaDon) BETWEEN :fromDate AND :toDate");
            params.put("fromDate", LocalDate.parse(request.getFromDate(), formatter));
            params.put("toDate", LocalDate.parse(request.getToDate(), formatter));
        }

        if (request.getTrangThaiList() != null && !request.getTrangThaiList().isEmpty()) {
            sql.append(" AND h.trangThaiThanhToan IN :trangThais");
            params.put("trangThais", request.getTrangThaiList());
        }

        if (request.getPhuongThucList() != null && !request.getPhuongThucList().isEmpty()) {
            sql.append(" AND h.phuongThuc IN :phuongThucs");
            params.put("phuongThucs", request.getPhuongThucList());
        }

        TypedQuery<HoaDonEntity> query = em.createQuery(sql.toString(), HoaDonEntity.class);
        params.forEach(query::setParameter);

        return query.getResultList();
    }
}
