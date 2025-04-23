package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.entities.LotEntity;
import com.moonhair.moonhair.repositories.LotRepository;
import com.moonhair.moonhair.service.ILotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LotServiceImpl implements ILotService {
    @Autowired
    private LotRepository lotRepository;

    public LotEntity updateSellingPrice(Integer id, Double newPrice) {
        Optional<LotEntity> optionalLot = lotRepository.findById(id);
        if (optionalLot.isEmpty()) {
            throw new RuntimeException("Lot with id " + id + " not found");
        }

        LotEntity lot = optionalLot.get();
        lot.setSellingPrice(newPrice);
        return lotRepository.save(lot);
    }
}
