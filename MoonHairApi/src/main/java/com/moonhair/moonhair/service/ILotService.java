package com.moonhair.moonhair.service;

import com.moonhair.moonhair.entities.LotEntity;

public interface ILotService {
    LotEntity updateSellingPrice(Integer id, Double newPrice);
}
