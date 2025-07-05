import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormSelect,
  CFormLabel,
  CForm,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCollapse,
  CFormInput,
} from "@coreui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const fakeData = [
  {
    id: 1,
    ten: "Nguyễn Văn A",
    loai: "Thợ chính",
    luongCoBan: 6000000,
    doanhThu: 28000000,
    hoaHong: 2800000,
    tongLuong: 8800000,
    hoaDon: [
      {
        maHoaDon: "HD001",
        ngay: "2025-07-02",
        vaiTro: "Thợ chính",
        tongTien: 800000,
        phanTram: 10,
        hoaHong: 80000,
      },
    ],
  },
];

const formatCurrency = (num) => num.toLocaleString("vi-VN") + "₫";

const LuongNhanVien = () => {
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    setData(fakeData); // Thay bằng gọi API thật sau này
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("BẢNG LƯƠNG NHÂN VIÊN - 07/2025", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Tên", "Loại", "Lương cơ bản", "Doanh thu", "Hoa hồng", "Tổng lương"]],
      body: data.map((nv) => [
        nv.ten,
        nv.loai,
        formatCurrency(nv.luongCoBan),
        formatCurrency(nv.doanhThu),
        formatCurrency(nv.hoaHong),
        formatCurrency(nv.tongLuong),
      ]),
    });
    doc.save("bang-luong.pdf");
  };

  return (
    <CCard>
      <CCardBody>
        <CForm className="mb-3">
          <CRow>
            <CCol md={3}>
              <CFormLabel>Tháng</CFormLabel>
              <CFormSelect>
                <option value="7">07/2025</option>
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Chi nhánh</CFormLabel>
              <CFormSelect>
                <option>MoonHair Hà Nội</option>
              </CFormSelect>
            </CCol>
            <CCol md={3} className="d-flex align-items-end">
              <CButton color="primary">Lọc</CButton>
            </CCol>
            <CCol md={3} className="d-flex align-items-end justify-content-end">
              <CButton color="success" onClick={exportPDF}>Xuất PDF</CButton>
            </CCol>
          </CRow>
        </CForm>

        <CTable bordered hover>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>Tên</CTableHeaderCell>
              <CTableHeaderCell>Loại</CTableHeaderCell>
              <CTableHeaderCell>Lương cơ bản</CTableHeaderCell>
              <CTableHeaderCell>Doanh thu</CTableHeaderCell>
              <CTableHeaderCell>Hoa hồng</CTableHeaderCell>
              <CTableHeaderCell>Tổng lương</CTableHeaderCell>
              <CTableHeaderCell>Chi tiết</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((nv, idx) => (
              <React.Fragment key={nv.id}>
                <CTableRow>
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell>{nv.ten}</CTableDataCell>
                  <CTableDataCell>{nv.loai}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.luongCoBan)}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.doanhThu)}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.hoaHong)}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.tongLuong)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      onClick={() => setExpandedRow(expandedRow === nv.id ? null : nv.id)}
                    >
                      {expandedRow === nv.id ? "Ẩn" : "Xem"}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell colSpan={8} className="p-0 border-0">
                    <CCollapse visible={expandedRow === nv.id}>
                      <CTable small bordered className="mb-3">
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>Mã HĐ</CTableHeaderCell>
                            <CTableHeaderCell>Ngày</CTableHeaderCell>
                            <CTableHeaderCell>Vai trò</CTableHeaderCell>
                            <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                            <CTableHeaderCell>Tỷ lệ</CTableHeaderCell>
                            <CTableHeaderCell>Hoa hồng</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {nv.hoaDon.map((hd, idx) => (
                            <CTableRow key={idx}>
                              <CTableDataCell>{hd.maHoaDon}</CTableDataCell>
                              <CTableDataCell>{hd.ngay}</CTableDataCell>
                              <CTableDataCell>{hd.vaiTro}</CTableDataCell>
                              <CTableDataCell>{formatCurrency(hd.tongTien)}</CTableDataCell>
                              <CTableDataCell>{hd.phanTram}%</CTableDataCell>
                              <CTableDataCell>{formatCurrency(hd.hoaHong)}</CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCollapse>
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default LuongNhanVien;
