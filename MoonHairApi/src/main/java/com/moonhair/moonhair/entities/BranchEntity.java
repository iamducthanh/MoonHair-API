package com.moonhair.moonhair.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chi_nhanh")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BranchEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "ten")
    private String name;
    @Column(name = "dia_chi")
    private String address;
    private Boolean active;
}
