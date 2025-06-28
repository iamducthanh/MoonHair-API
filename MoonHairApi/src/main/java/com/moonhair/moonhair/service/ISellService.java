package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.GetSellListDto;
import com.moonhair.moonhair.dto.HoaDon;
import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.Sell;
import com.moonhair.moonhair.entities.ProductEntity;

import java.util.List;

public interface ISellService {
    List<ProductList> getAllProductToSell(Integer branchId);
    List<ProductEntity> getAllServiceToSell(Integer branchId);
    Sell saveSell(Sell sell);
    List<HoaDon> getSellList(GetSellListDto getSellListDto);
}
