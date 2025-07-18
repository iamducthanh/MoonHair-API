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
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs'

export default function BanHangScreen() {
  const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
  const { selectedBranchLocalName, setSelectedBranchLocalName } = useAppContext();
  const [danhSachSanPham, setDanhSachSanPham] = useState([])
  const [danhSachDichVu, setDanhSachDichVu] = useState([])
  const [expandedProductId, setExpandedProductId] = useState([])
  const [giamGia, setGiamGia] = useState(0);
  const [ngayBan, setNgayBan] = useState(dayjs().format('YYYY-MM-DDTHH:mm'))
  const [tenKhachHang, setTenKhachHang] = useState('');
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('tienmat'); // 'tienmat' hoặc 'chuyenkhoan'
  const [dichVuDaChon, setDichVuDaChon] = useState([])
  const tongTien = dichVuDaChon.reduce((sum, sp) => sum + sp.soLuong * sp.donGia, 0)
  const tongTienSauGiamGia = Math.max(tongTien - tongTien / 100 * giamGia, 0);
  const [employees, setEmployees] = useState([]);

  const [searchParams] = useSearchParams();
  const maHoaDon = searchParams.get('maHoaDon');

  useEffect(() => {
    // Gọi API lấy danh sách phiếu nhập hàng
    fetchProduct();
    fetchEmployee();

    if (maHoaDon) {
      fetchInvoiceByMa(maHoaDon);
    }
  }, [selectedBranchLocal, maHoaDon]);

  const fetchProduct = async () => {
    const products = await sellApi.getAllProductSell(selectedBranchLocal)
    setDanhSachSanPham(products.data)
    const services = await sellApi.getAllServiceSell(selectedBranchLocal)
    setDanhSachDichVu(services.data)
    console.log(services.data)
  };

  const fetchInvoiceByMa = async (ma) => {
    try {
      const res = await sellApi.getInvoiceByMa(ma); // 👉 API trả về chi tiết hóa đơn
      const data = res.data;

      const list = data.hoaDonChiTiets.map((item) => ({
        ...item,
        soLuong: item.soLuong,
        donGia: parseFloat(item.donGia),
        name: item.tenHang,
        kyc: false,
        thoChinh: '',
        thoPhu: ''
      }));

      setDichVuDaChon(list);
      setTenKhachHang(data.tenKhachHang);
      setGiamGia(parseFloat(data.giamGia));
      setPhuongThucThanhToan("tienmat");
    } catch (error) {
      console.log(error)
      toast.error("Không lấy được thông tin hóa đơn gốc");
    }
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

  const [loaiTab, setLoaiTab] = useState('dichvu') // hoặc 'dichvu'

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


  const saveSell = async () => {
    let obj = {};
    obj.productList = dichVuDaChon
    obj.phuongThucThanhToan = phuongThucThanhToan;
    obj.tongTien = tongTien;
    obj.tongTienThanhToan = tongTienSauGiamGia;
    obj.idChiNhanh = selectedBranchLocal
    obj.giamGia = tongTien / 100 * giamGia;
    obj.tenKhachHang = tenKhachHang;
    obj.ngayHoaDon = ngayBan
    console.log(obj)
    let validate = true;
    for (const product of obj.productList) {
      if (!product.name || product.name.trim() === "") {
        validate = false;
        toast.error("Thông tin sản phẩm dịch vụ không được để trống!");
      }
    }

    if (validate == true) {
      try {
        const sell = await sellApi.saveSell(obj);
        if (obj.phuongThucThanhToan == 'chuyenkhoan') {
          let idHoaDon = sell.data.idHoaDon
          const res = await sellApi.paymentVnpay(sell.data.idHoaDon, sell.data.tongTienThanhToan);
          window.open(res.data.url, '_blank');
        } else {
        }
        // 👉 Reset sau khi lưu
        toast.success("Thành công!");
        resetForm();
        fetchProduct();
  
        console.log(sell);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }



  }

  const handlePayment = async () => {

  };

  const resetForm = () => {
    setDichVuDaChon([]);
    setTenKhachHang('');
    setGiamGia(0);
    setPhuongThucThanhToan('tienmat');
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
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
              <CTableHeaderCell>Sản phẩm/Dịch vụ</CTableHeaderCell>
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
                  {true && (
                    <CFormInput
                      value={sp.name}
                      size="sm"
                      onChange={(e) => handleChange(idx, 'name', e.target.value)}
                      placeholder="Nhập sản phẩm/ dịch vụ"
                    />
                  )}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex gap-2">
                    <CFormSelect
                      size="sm"
                      value={sp.thoChinh || ''}
                      onChange={(e) => handleChangeNhanVien(idx, 'thoChinh', e.target.value)}
                    >
                      <option value="">Thợ chính</option>
                      {employees.filter((nv) => nv.type !== '')
                        .map((nv) => (
                          <option key={nv.id} value={nv.id}>
                            {nv.name}
                          </option>
                        ))}
                    </CFormSelect>
                    <CFormSelect
                      size="sm"
                      value={sp.thoPhu || ''}
                      onChange={(e) => handleChangeNhanVien(idx, 'thoPhu', e.target.value)}
                    >
                      <option value="">Thợ phụ</option>
                      {employees.filter((nv) => nv.type !== '')
                        .map((nv) => (
                          <option key={nv.id} value={nv.id}>
                            {nv.name}
                          </option>
                        ))}
                    </CFormSelect>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  {/* <CButton size="sm" onClick={() => handleThayDoiSoLuong(sp.id, -1)}><CIcon icon={cilMinus} /></CButton> */}
                  {sp.productCode !== 'SPM000' && (

                    <span className="mx-2">{sp.soLuong}</span>
                  )}
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
          <CCardBody style={{ paddingTop: '0px' }}>
            <CRow>
              <CCol md={12}>
                <div className="text-end mt-3">
                  <div className="mb-2 d-inline-block">
                    <strong>Ngày bán: </strong>
                    <CFormInput
                      style={{ width: '250px', height: '40px', display: 'inline-block' }}
                      type="datetime-local"
                      value={ngayBan}
                      onChange={(e) => setNgayBan(e.target.value)}
                      required
                    />
                  </div> <br />
                  <div className="mb-2 d-inline-block">
                    <strong>Giảm giá (%): </strong>
                    <CFormInput
                      style={{ width: '250px', height: '40px', display: 'inline-block' }}
                      size="sm"
                      type="number"
                      max="100" min="0"
                      value={giamGia}
                      onChange={(e) => setGiamGia(parseFloat(e.target.value) || '')}
                      placeholder="Nhập giảm giá"
                    />
                  </div> <br />
                  <div className="mb-2 d-inline-block">
                    <strong>Tên khách hàng: </strong>
                    <CFormInput
                      style={{ width: '250px', height: '40px', display: 'inline-block' }}
                      size="sm"
                      type="text"
                      value={tenKhachHang}
                      onChange={(e) => setTenKhachHang(e.target.value || '')}
                      placeholder="Nhập tên khách hàng"
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
