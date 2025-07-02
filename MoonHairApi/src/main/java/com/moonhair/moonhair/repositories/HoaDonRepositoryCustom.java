package com.moonhair.moonhair.repositories;

import com.moonhair.moonhair.dto.SellFilterRequest;
import com.moonhair.moonhair.entities.HoaDonEntity;

import java.util.List;

public interface HoaDonRepositoryCustom {
    List<HoaDonEntity> findByFilter(SellFilterRequest request);

}
