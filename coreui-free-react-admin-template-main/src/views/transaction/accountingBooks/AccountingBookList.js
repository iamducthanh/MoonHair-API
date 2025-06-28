import React, { useState, useEffect } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
  CCollapse,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from "@coreui/react";
import sellApi from '../../../api/sellApi';
import { useAppContext } from '../../../context/AppContext';

const AccountingBookList = () => {
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const [invoice, setInvoice] = useState([]);
  const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();

  useEffect(() => {
    fetchInvoice();
  }, [selectedBranchLocal]);

  const fetchInvoice = async () => {
    const res = await sellApi.getSellList({ getDate: '28/06/2025' });
    setInvoice(res.data)
  };


  const toggleDetail = (id) => {
    setActiveInvoiceId((prev) => (prev === id ? null : id));
  };

  return (
    <CRow>
      {/* Sidebar Filter */}
      <CCol md={3}>
        <CCard>
          <CCardBody>
            <h5>Tìm kiếm</h5>
            <CFormInput placeholder="Theo mã, tên khách..." className="mb-3" />

            <h6>Thời gian</h6>
            <CFormCheck label="Hôm nay" name="time" defaultChecked />
            <h6>Từ ngày</h6>
            <CFormInput type="date" className="mt-2 mb-3" />
            <h6>Đến ngày</h6>
            <CFormInput type="date" className="mt-2 mb-3" />
            <h6>Trạng thái</h6>
            <CFormCheck label="Hoàn thành" defaultChecked />
            <CFormCheck label="Chờ chuyển khoản" />

            <h6>Phương thức</h6>
            <CFormCheck label="Tiền mặt" defaultChecked />
            <CFormCheck label="Chuyển khoản" />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Main Content */}
      <CCol md={9}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Hóa đơn</h4>
          <div className="d-flex gap-2">
            <CButton color="success">+ Tạo hóa đơn</CButton>
            <CButton color="info">📄 Xuất file</CButton>
          </div>
        </div>
        <CCard>
          <CCardBody>
            <CTable striped>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Thời gian</CTableHeaderCell>
                  <CTableHeaderCell>Khách hàng</CTableHeaderCell>
                  <CTableHeaderCell>Phương thức</CTableHeaderCell>
                  <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                  <CTableHeaderCell>Giảm giá</CTableHeaderCell>
                  <CTableHeaderCell>Khách đã trả</CTableHeaderCell>
                  <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {invoice.map((invoice) => (
                  <React.Fragment key={invoice.maHoaDon}>
                    <CTableRow active={invoice.maHoaDon === activeInvoiceId} onClick={() => toggleDetail(invoice.maHoaDon)} style={{ marginBottom: 0 }}>
                      <CTableDataCell>{invoice.maHoaDon}</CTableDataCell>
                      <CTableDataCell>{invoice.thoiGian}</CTableDataCell>
                      <CTableDataCell>{invoice.tenKhachHang}</CTableDataCell>
                      <CTableDataCell>{invoice.phuongThuc}</CTableDataCell>
                      <CTableDataCell>{invoice.tongTien ? invoice.tongTien.toLocaleString() : ''}</CTableDataCell>
                      <CTableDataCell>{invoice.giamGia ? invoice.giamGia.toLocaleString() : ''}</CTableDataCell>
                      <CTableDataCell>{invoice.khachDaTra ? invoice.khachDaTra.toLocaleString() : ''}</CTableDataCell>
                      <CTableDataCell>{invoice.trangThai}</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell colSpan={12} className="p-0">
                        <CCollapse visible={activeInvoiceId === invoice.maHoaDon}>
                          <CCard className="mt-1">
                            <CCardBody>
                              <CRow>
                                <CCol md={6}>
                                  <p><strong>Mã hóa đơn:</strong> {invoice.maHoaDon}</p>
                                  <p><strong>Thời gian:</strong> {invoice.thoiGian}</p>
                                  <p><strong>Khách hàng:</strong> {invoice.tenKhachHang}</p>
                                </CCol>
                                <CCol md={6}>
                                  <p><strong>Tài khoản tạo:</strong> {invoice.nguoiTao}</p>
                                  <p><strong>Trạng thái:</strong> {invoice.trangThai}</p>
                                  <p><strong>Chi nhánh:</strong> {invoice.maChiNhanh}</p>
                                </CCol>
                              </CRow>

                              <CTable bordered className="mt-4">
                                <CTableHead>
                                  <CTableRow>
                                    <CTableHeaderCell>Mã hàng hóa</CTableHeaderCell>
                                    <CTableHeaderCell>Tên hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Thợ chính</CTableHeaderCell>
                                    <CTableHeaderCell>Thợ phụ</CTableHeaderCell>
                                    <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                    <CTableHeaderCell>Giá bán</CTableHeaderCell>
                                    <CTableHeaderCell>Thành tiền</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {invoice.hoaDonChiTiets.map((item, index) => (
                                    <CTableRow key={index}>
                                      <CTableDataCell>{item.maHangHoa}</CTableDataCell>
                                      <CTableDataCell>{item.tenHang}</CTableDataCell>
                                      <CTableDataCell>{item.thoChinh}</CTableDataCell>
                                      <CTableDataCell>{item.thoPhu}</CTableDataCell>
                                      <CTableDataCell>{item.soLuong}</CTableDataCell>
                                      <CTableDataCell>{item.donGia ? item.donGia.toLocaleString() : ''}</CTableDataCell>
                                      <CTableDataCell>{item.thanhTien ? item.thanhTien.toLocaleString() : ''}</CTableDataCell>
                                    </CTableRow>
                                  ))}
                                </CTableBody>
                              </CTable>

                              <div className="text-end mt-4">
                                <p>Tổng số lượng: <strong>{invoice.hoaDonChiTiets.reduce((sum, i) => sum + i.soLuong, 0)}</strong></p>
                                <p>Tổng tiền hàng: <strong>{invoice.tongTien ? invoice.tongTien.toLocaleString() : ''}</strong></p>
                                <p>Giảm giá hóa đơn: <strong>{invoice.giamGia ? invoice.giamGia.toLocaleString() : ''}</strong></p>
                                <p>Khách cần trả: <strong>{invoice.khachDaTra ? invoice.khachDaTra.toLocaleString() : ''}</strong></p>
                                <p>Khách đã trả: <strong>{invoice.khachDaTra ? invoice.khachDaTra.toLocaleString() : ''}</strong></p>
                              </div>

                              <div className="d-flex justify-content-end gap-2 mt-3">
                                <CButton color="success">💾 Lưu</CButton>
                                <CButton color="secondary">🖨 In</CButton>
                                <CButton color="info">📄 Xuất file</CButton>
                                <CButton color="warning">📋 Sao chép</CButton>
                                <CButton color="danger">❌ Hủy bỏ</CButton>
                              </div>
                            </CCardBody>
                          </CCard>
                        </CCollapse>
                      </CTableDataCell>
                    </CTableRow>

                  </React.Fragment>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>

        </CCard>
      </CCol>
    </CRow>
  );
};

export default AccountingBookList;
