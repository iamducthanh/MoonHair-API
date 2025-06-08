package com.moonhair.moonhair.api;

import com.moonhair.moonhair.dto.ProductList;
import com.moonhair.moonhair.dto.Sell;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.service.ISellService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sell")
public class SellController {
    private final ISellService sellService;

    public SellController(ISellService sellService) {
        this.sellService = sellService;
    }

    @GetMapping("product-list")
    public List<ProductList> getAllProductToSell(@RequestParam Integer branchId) {
        return sellService.getAllProductToSell(branchId);
    }

    @GetMapping("service-list")
    public List<ProductEntity> getAllServiceToSell(@RequestParam Integer branchId) {
        return sellService.getAllServiceToSell(branchId);
    }

    @PostMapping("save")
    public ResponseEntity<?> saveSell(@RequestBody Sell sell) {
        sellService.saveSell(sell);
        return ResponseEntity.ok(sell);
    }

}
