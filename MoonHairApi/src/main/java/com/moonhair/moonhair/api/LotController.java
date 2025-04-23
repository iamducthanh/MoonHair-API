package com.moonhair.moonhair.api;

import com.moonhair.moonhair.entities.LotEntity;
import com.moonhair.moonhair.service.ILotService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lots")
public class LotController {

    private final ILotService lotService;

    public LotController(ILotService lotService) {
        this.lotService = lotService;
    }

    @PutMapping("/{id}/selling-price")
    public LotEntity updateSellingPrice(@PathVariable Integer id, @RequestBody UpdateSellingPriceRequest request) {
        return lotService.updateSellingPrice(id, request.getPriceOut());
    }

    @Data
    public static class UpdateSellingPriceRequest {
        private Double priceOut;
    }
}
