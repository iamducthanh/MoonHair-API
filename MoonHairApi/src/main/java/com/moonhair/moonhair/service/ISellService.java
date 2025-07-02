package com.moonhair.moonhair.service;

import com.moonhair.moonhair.dto.*;
import com.moonhair.moonhair.entities.ProductEntity;

import java.util.List;

public interface ISellService {
    List<ProductList> getAllProductToSell(Integer branchId);
    List<ProductEntity> getAllServiceToSell(Integer branchId);
    Sell saveSell(Sell sell);
    List<HoaDon> getSellList(SellFilterRequest getSellListDto);
    HoaDon getByMa(String maHoaDon);
    void updateInvoice(String maHoaDon, UpdateInvoice invoiceUpdate);
}
