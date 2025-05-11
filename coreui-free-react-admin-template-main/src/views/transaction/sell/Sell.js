import {
  CRow, CCol, CCard, CCardBody, CButton, CFormInput, CFormSelect,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react'
import { cilTrash, cilPlus, cilMinus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState, useEffect } from 'react'

export default function BanHangScreen() {
  const [dichVuDaChon, setDichVuDaChon] = useState([])

  const handleThemDichVu = (item) => {
    const existed = dichVuDaChon.find(sp => sp.id === item.id)
    if (existed) {
      setDichVuDaChon(dichVuDaChon.map(sp =>
        sp.id === item.id ? { ...sp, soLuong: sp.soLuong + 1 } : sp
      ))
    } else {
      setDichVuDaChon([...dichVuDaChon, { ...item, soLuong: 1 }])
    }
  }

  const handleThayDoiSoLuong = (id, delta) => {
    setDichVuDaChon(prev =>
      prev.map(sp =>
        sp.id === id ? { ...sp, soLuong: Math.max(sp.soLuong + delta, 1) } : sp
      )
    )
  }

  const handleXoa = (id) => {
    setDichVuDaChon(prev => prev.filter(sp => sp.id !== id))
  }

  const tongTien = dichVuDaChon.reduce((sum, sp) => sum + sp.soLuong * sp.donGia, 0)

  const danhSachDichVu = [
    { id: 1, ten: 'Nhuộm tóc nữ ngắn', donGia: 650000 },
    { id: 2, ten: 'Gội đầu thảo dược', donGia: 100000 },
    // ... thêm dịch vụ mẫu khác
  ]

  return (
    <CRow>
      {/* DANH SÁCH DỊCH VỤ / SẢN PHẨM */}
      <CCol md={4}>
        <CFormInput className="mb-2" placeholder="Tìm tên, mã hàng (F3)" />
        <div className="d-flex gap-2 mb-2">
          <CButton size="sm" color="secondary">Dịch vụ</CButton>
          <CButton size="sm" color="secondary">Thẻ & Gói DV</CButton>
          <CButton size="sm" color="primary">Sản phẩm</CButton>
        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {danhSachDichVu.map((item) => (
            <CCard key={item.id} className="mb-2" onClick={() => handleThemDichVu(item)} style={{ cursor: 'pointer' }}>
              <CCardBody>
                <div><strong>{item.ten}</strong></div>
                <div>{item.donGia.toLocaleString()} đ</div>
              </CCardBody>
            </CCard>
          ))}
        </div>
      </CCol>

      {/* HÓA ĐƠN */}
      <CCol md={8}>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Dịch vụ</CTableHeaderCell>
              <CTableHeaderCell>Nhân viên</CTableHeaderCell>
              <CTableHeaderCell>Số lượng</CTableHeaderCell>
              <CTableHeaderCell>Đơn giá</CTableHeaderCell>
              <CTableHeaderCell>Thành tiền</CTableHeaderCell>
              <CTableHeaderCell></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {dichVuDaChon.map((sp, idx) => (
              <CTableRow key={sp.id}>
                <CTableDataCell>{idx + 1}</CTableDataCell>
                <CTableDataCell>{sp.ten}</CTableDataCell>
                <CTableDataCell>
                  <CFormSelect>
                    <option>Chọn nhân viên</option>
                    <option>Nhân viên A</option>
                  </CFormSelect>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, -1)}><CIcon icon={cilMinus} /></CButton>
                  <span className="mx-2">{sp.soLuong}</span>
                  <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, 1)}><CIcon icon={cilPlus} /></CButton>
                </CTableDataCell>
                <CTableDataCell>{sp.donGia.toLocaleString()}</CTableDataCell>
                <CTableDataCell>{(sp.donGia * sp.soLuong).toLocaleString()}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger" size="sm" onClick={() => handleXoa(sp.id)}>
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        <div className="text-end mt-3">
          <strong>Tổng cộng: </strong>
          <span className="text-success fs-5">{tongTien.toLocaleString()} đ</span>
        </div>

        <div className="text-end mt-2">
          <CButton color="success" size="lg">Thanh toán {tongTien.toLocaleString()} đ (F9)</CButton>
        </div>
      </CCol>
    </CRow>
  )
}
