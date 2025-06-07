import {
  CRow, CCol, CCard, CCardBody, CButton, CFormInput, CFormSelect,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck
} from '@coreui/react'
import { cilTrash, cilPlus, cilMinus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState, useEffect } from 'react'
import sellApi from '../../../api/sellApi';
import { useAppContext } from '../../../context/AppContext';
import employeeApi from '../../../api/employeeApi';

export default function BanHangScreen() {
  const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
  const { selectedBranchLocalName, setSelectedBranchLocalName } = useAppContext();
  const [danhSachSanPham, setDanhSachSanPham] = useState([])
  const [danhSachDichVu, setDanhSachDichVu] = useState([])
  const [expandedProductId, setExpandedProductId] = useState([])
  const [giamGia, setGiamGia] = useState(0);
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('tienmat'); // 'tienmat' hoặc 'chuyenkhoan'
  const [dichVuDaChon, setDichVuDaChon] = useState([])
  const nhanVienList = [
    { id: 'NV001', tenNhanVien: 'Nguyễn Văn A' },
    { id: 'NV002', tenNhanVien: 'Trần Thị B' },
    { id: 'NV003', tenNhanVien: 'Lê Văn C' },
    { id: 'NV004', tenNhanVien: 'Phạm Thị D' },
  ];
  const tongTien = dichVuDaChon.reduce((sum, sp) => sum + sp.soLuong * sp.donGia, 0)
  const tongTienSauGiamGia = Math.max(tongTien - giamGia, 0);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách phiếu nhập hàng
    fetchProduct();
    fetchEmployee();
  }, [selectedBranchLocal]);

  const fetchProduct = async () => {
    const products = await sellApi.getAllProductSell(selectedBranchLocal)
    setDanhSachSanPham(products.data)
    const services = await sellApi.getAllServiceSell(selectedBranchLocal)
    setDanhSachDichVu(services.data)
    console.log(services.data)
  };

  const fetchEmployee = async () => {
    const response = await employeeApi.getEmployeesByBranch(selectedBranchLocal);
    setEmployees(response.data);
  };

  const handleThemDichVu = (item) => {
    const existed = dichVuDaChon.find(sp => sp.id === item.id)

    let price = 0;
    let name = "";
    if (loaiTab === 'sanpham') {
      price = item.priceOut;
      name = item.productName;
    } else {
      name = item.name;
      price = item.price;
    }
    console.log(name)
    if (existed) {
      setDichVuDaChon(dichVuDaChon.map(sp =>
        sp.id === item.id ? { ...sp, soLuong: sp.soLuong + 1, donGia: price, name: name } : sp
      ))
    } else {
      setDichVuDaChon([...dichVuDaChon, { ...item, soLuong: 1, donGia: price, name: name }])
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

  const [loaiTab, setLoaiTab] = useState('sanpham') // hoặc 'dichvu'

  const handleThemSanPham = () => {
    const sanPhamMoi = {
      id: generateUUIDv4(),
      productCode: 'SPM000',
      name: '',
      kyc: false,
      soLuongNhap: 1,
      donGia: ''
    };

    setDichVuDaChon([...dichVuDaChon, { ...sanPhamMoi, soLuong: 1 }])
  };

  const handleChangeNhanVien = (index, field, value) => {
    const newList = [...dichVuDaChon];
    newList[index][field] = value;
    setDichVuDaChon(newList);
  };

  function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  

  const saveSell = () => {
    console.log('Chi tiết:', dichVuDaChon)
    console.log('Giảm giá:', giamGia)
    console.log('Phương thức:', phuongThucThanhToan)
    handlePayment()
  }

  const handlePayment = async () => {
    const res = await sellApi.paymentVnpay("237492439998", 5000);
    console.log(res.data.url);
    window.location.href = res.data.url; // chuyển hướng đến trang thanh toán VNPAY
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
          {/* Danh sách sản phẩm */}
          <div style={{ display: loaiTab === 'sanpham' ? 'block' : 'none' }}>
            {danhSachSanPham.map((item) => (
              <CCard
                key={item.lotCode}
                className="mb-2"
                onClick={() => handleThemDichVu(item)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody>
                  <div><strong>{item.productName} - {item.size}</strong></div>
                  <div>{item.priceOut.toLocaleString()} đ - Tồn {item.quantityRemaining}</div>
                </CCardBody>
              </CCard>
            ))}
          </div>

          {/* Danh sách dịch vụ */}
          <div style={{ display: loaiTab === 'dichvu' ? 'block' : 'none' }}>
            {danhSachDichVu.map((item) => (
              <CCard
                key={item.id}
                className="mb-2"
                onClick={() => handleThemDichVu(item)}
                style={{ cursor: 'pointer' }}
              >
                <CCardBody>
                  <div><strong>{item.name}</strong></div>
                  <div>{item.price.toLocaleString()} đ</div>
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
              <CTableHeaderCell>Sản phẩm/khách hàng</CTableHeaderCell>
              <CTableHeaderCell>Nhân viên</CTableHeaderCell>
              <CTableHeaderCell>SL</CTableHeaderCell>
              <CTableHeaderCell>KYC</CTableHeaderCell>
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
                    value={sp.name} size="sm"

                    onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    placeholder="Nhập tên khách hàng"
                  />
                </CTableDataCell>
                <CTableDataCell>
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
                  {/* <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, -1)}><CIcon icon={cilMinus} /></CButton> */}
                  <span className="mx-2">{sp.soLuong}</span>
                  {/* <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, 1)}><CIcon icon={cilPlus} /></CButton> */}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center' }}>
                  <CFormCheck
                    type="checkbox"
                    checked={sp.kyc}
                    onChange={(e) => handleChange(idx, 'kyc', e.target.checked)}
                  />
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

        <CCard>
          <CCardBody style={{paddingTop: '0px'}}>
            <CRow>
              <CCol md={12}>
                <div className="text-end mt-3">
                  <div className="mb-2 d-inline-block">
                    <strong>Giảm giá: </strong>
                    <CFormInput
                      style={{ width: '150px', display: 'inline-block' }}
                      size="sm"
                      type="number"
                      value={giamGia}
                      onChange={(e) => setGiamGia(parseFloat(e.target.value) || '')}
                      placeholder="Nhập giảm giá"
                    />
                  </div>
                  <div className="mt-2">
                    <CFormCheck
                      inline
                      type="radio"
                      name="pttt"
                      label="Tiền mặt"
                      value="tienmat"
                      checked={phuongThucThanhToan === 'tienmat'}
                      onChange={(e) => setPhuongThucThanhToan(e.target.value)}
                    />
                    <CFormCheck
                      inline
                      type="radio"
                      name="pttt"
                      label="Chuyển khoản"
                      value="chuyenkhoan"
                      checked={phuongThucThanhToan === 'chuyenkhoan'}
                      onChange={(e) => setPhuongThucThanhToan(e.target.value)}
                    />
                  </div>
                </div>

              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        <div className="text-end mt-3">
          <strong>Tổng cộng: </strong>
          <span className="text-success fs-5">{tongTien.toLocaleString()} đ</span>
        </div>

        <div className="text-end mt-2">
          {/* <CButton onClick={() => console.log(dichVuDaChon)} color="success" style={{ color: 'white' }} size="lg">Thanh toán {tongTien.toLocaleString()} đ</CButton> */}
          <CButton
            onClick={() => 
              saveSell()
            }
            color="success"
            style={{ color: 'white' }}
            size="lg"
          >
            Thanh toán {tongTienSauGiamGia.toLocaleString()} đ
          </CButton>

        </div>
      </CCol>
    </CRow>
  )
}
