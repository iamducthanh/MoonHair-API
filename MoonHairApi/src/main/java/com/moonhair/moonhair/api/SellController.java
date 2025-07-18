package com.moonhair.moonhair.api;

import com.moonhair.moonhair.dto.*;
import com.moonhair.moonhair.entities.HoaDonEntity;
import com.moonhair.moonhair.entities.ProductEntity;
import com.moonhair.moonhair.repositories.HoaDonRepository;
import com.moonhair.moonhair.service.ISellService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sell")
public class SellController {
    private final ISellService sellService;
    private final HoaDonRepository hoaDonRepository;

    public SellController(ISellService sellService, HoaDonRepository hoaDonRepository) {
        this.sellService = sellService;
        this.hoaDonRepository = hoaDonRepository;
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

    @PostMapping("get-sell-list")
    public ResponseEntity<?> getSellList(@RequestBody SellFilterRequest sell) {
        return ResponseEntity.ok(sellService.getSellList(sell));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateInvoice(@PathVariable String id, @RequestBody UpdateInvoice request) {
        sellService.updateInvoice(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hoa-don/{maHoaDon}")
    public ResponseEntity<?> getByMa(@PathVariable String maHoaDon) {
        HoaDon hoaDon = sellService.getByMa(maHoaDon);
        return ResponseEntity.ok(hoaDon);
    }

    @GetMapping("/thang-nam")
    public List<Map<String, Integer>> getDanhSachThangNam() {
        return sellService.getDistinctMonthAndYear();
    }

}
