import {
  CRow, CCol, CCard, CCardBody, CButton, CFormInput, CFormSelect,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from '@coreui/react'
import { cilTrash, cilPlus, cilMinus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState, useEffect } from 'react'

export default function BanHangScreen() {
  const [dichVuDaChon, setDichVuDaChon] = useState([])
  const nhanVienList = [
    { id: 'NV001', tenNhanVien: 'Nguyễn Văn A' },
    { id: 'NV002', tenNhanVien: 'Trần Thị B' },
    { id: 'NV003', tenNhanVien: 'Lê Văn C' },
    { id: 'NV004', tenNhanVien: 'Phạm Thị D' },
  ];


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

  const handleChange = (index, field, value) => {
    const newList = [...dichVuDaChon];
    newList[index][field] = value;
    setDichVuDaChon(newList);
  };

  const tongTien = dichVuDaChon.reduce((sum, sp) => sum + sp.soLuong * sp.donGia, 0)

  const [loaiTab, setLoaiTab] = useState('sanpham') // hoặc 'dichvu'

  const danhSachSanPham = [
    { id: 1, ten: 'Sản phẩm dưỡng tóc', ma: 'SP001', donGia: 300000 },
    { id: 2, ten: 'Tinh dầu gội đầu', ma: 'SP002', donGia: 250000 },
  ]

  const danhSachDichVu = [
    { id: 3, ten: 'Nhuộm tóc nữ ngắn', ma: 'DV001', donGia: 650000 },
    { id: 4, ten: 'Gội đầu thảo dược', ma: 'DV002', donGia: 100000 },
  ]

  const handleThemSanPham = () => {
    const sanPhamMoi = {
      id: Date.now(),
      productCode: 'SPM000',
      name: 'Sản phẩm mới',
      soLuongNhap: 1,
      donGia: 0
    };

    setDichVuDaChon([...dichVuDaChon, { ...sanPhamMoi, soLuong: 1 }])
  };

  const handleChangeNhanVien = (index, field, value) => {
    const newList = [...dichVuDaChon];
    newList[index][field] = value;
    setDichVuDaChon(newList);
  };

  return (
    <CRow>
      {/* DANH SÁCH DỊCH VỤ / SẢN PHẨM */}
      <CCol md={3}>
        <CFormInput className="mb-2" placeholder="Tìm tên, mã hàng" />
        <div className="mb-3 d-flex gap-2">
          <CButton size="sm"
            color={loaiTab === 'dichvu' ? 'primary' : 'secondary'}
            onClick={() => setLoaiTab('dichvu')}
          >
            Dịch vụ
          </CButton>
          <CButton size="sm"
            color={loaiTab === 'sanpham' ? 'primary' : 'secondary'}
            onClick={() => setLoaiTab('sanpham')}
          >
            Sản phẩm
          </CButton>
          <CButton onClick={handleThemSanPham}
            size="sm" color="success" style={{ color: 'white' }}>+ Thêm</CButton>

        </div>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <div>
            {(loaiTab === 'sanpham' ? danhSachSanPham : danhSachDichVu).map((item) => (
              <CCard key={item.id} className="mb-2" onClick={() => handleThemDichVu(item)} style={{ cursor: 'pointer' }}>
                <CCardBody>
                  <div><strong>{item.ten}</strong></div>
                  <div>{item.donGia.toLocaleString()} đ</div>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </div>
      </CCol>

      {/* HÓA ĐƠN */}
      <CCol md={9}>
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
                <CTableDataCell>
                  <CFormInput
                    value={sp.ten} size="sm"

                    onChange={(e) => handleChange(idx, 'ten', e.target.value)}
                    placeholder="Nhập tên dịch vụ"
                  />
                </CTableDataCell>                <CTableDataCell>
                  <div className="d-flex gap-2">
                    <CFormSelect
                      size="sm"
                      value={sp.nhanVien1 || ''}
                      onChange={(e) => handleChangeNhanVien(idx, 'nhanVien1', e.target.value)}
                    >
                      <option value="">Thợ chính</option>
                      {nhanVienList.map((nv) => (
                        <option key={nv.id} value={nv.id}>
                          {nv.tenNhanVien}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormSelect
                      size="sm"
                      value={sp.nhanVien2 || ''}
                      onChange={(e) => handleChangeNhanVien(idx, 'nhanVien2', e.target.value)}
                    >
                      <option value="">Thợ phụ</option>
                      {nhanVienList.map((nv) => (
                        <option key={nv.id} value={nv.id}>
                          {nv.tenNhanVien}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CTableDataCell>

                <CTableDataCell>
                  <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, -1)}><CIcon icon={cilMinus} /></CButton>
                  <span className="mx-2">{sp.soLuong}</span>
                  <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, 1)}><CIcon icon={cilPlus} /></CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormInput size="sm"
                    type="number"
                    value={sp.donGia}
                    onChange={(e) => handleChange(idx, 'donGia', parseFloat(e.target.value) || 0)}
                    placeholder="Nhập đơn giá"
                  />
                </CTableDataCell>                
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
          <CButton onClick={() => console.log(dichVuDaChon)} color="success" style={{ color: 'white' }} size="lg">Thanh toán {tongTien.toLocaleString()} đ</CButton>
        </div>
      </CCol>
    </CRow>
  )
}
