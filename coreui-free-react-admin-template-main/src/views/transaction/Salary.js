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
import sellApi from '../../api/sellApi';
import autoTable from "jspdf-autotable";
import employeeApi from '../../api/employeeApi';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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

const formatCurrency = (num) => num.toLocaleString("vi-VN") + " ₫";

const LuongNhanVien = () => {
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [options, setOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);

  useEffect(() => {
    fetchSalary()
    fetchThangNam()
  }, [month, year]);

  const fetchSalary = async () => {
    try {
      const response = await employeeApi.getAllSalary(month, year, 1);
      setData(response.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách lương nhân viên!');
    }
  };

  const fetchThangNam = async () => {
    try {
      const response = await sellApi.getThangNam();
      const data = response.data;

      const years = [...new Set(data.map(item => item.year))];
      const months = [...new Set(data.map(item => item.month))];

      setUniqueYears(years);
      setUniqueMonths(months);

      console.log(years)
      console.log(months)

    } catch (error) {
      console.log(error)
      toast.error('Lỗi khi tải danh sách tháng năm!');
    }
  };

  const exportPDF = () => {
    const content = [];

    data.forEach((nv) => {
      content.push(
        { text: `Nhân viên: ${nv.tenNhanVien}`, bold: true, margin: [0, 10, 0, 2] },
        { text: `Tổng doanh thu: ${nv.doanhThu?.toLocaleString()} đ` },
        { text: `Tổng lương: ${nv.tongLuong?.toLocaleString()} đ` },
      );

      if (nv.hoaDons?.length > 0) {
        content.push({
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*"],
            body: [
              ["Mã HĐ", "Ngày", "Khách", "Vai trò", "Tổng tiền", "Hoa hồng"],
              ...nv.hoaDons.map((hd) => [
                hd.maHoaDon,
                hd.ngay,
                hd.tenKhach,
                hd.vaiTro,
                `${hd.tongTien?.toLocaleString()} đ`,
                `${hd.hoaHong?.toLocaleString()} đ`,
              ]),
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 5, 0, 10],
        });
      }
    });

    const docDefinition = {
      content: [
        { text: "BẢNG LƯƠNG NHÂN VIÊN", style: "header", alignment: "center" },
        ...content,
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        tableExample: { margin: [0, 5, 0, 15] },
      },
      defaultStyle: {
        font: "Roboto",
      },
    };

    pdfMake.createPdf(docDefinition).download("bang-luong.pdf");
  };

  return (
    <CCard>
      <CCardBody>
        <CForm className="mb-3">
          <CRow>
            <CCol md={3}>
              <CFormLabel>Tháng</CFormLabel>
              <CFormSelect
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                <option value="">-- Chọn tháng --</option>
                {uniqueMonths.map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, "0")}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={3}>
              <CFormLabel>Năm</CFormLabel>
              <CFormSelect
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                <option value="">-- Chọn năm --</option>
                {uniqueYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={3}>
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
              <CTableHeaderCell>Doanh thu</CTableHeaderCell>
              <CTableHeaderCell>Hoa hồng</CTableHeaderCell>
              <CTableHeaderCell>Tổng lương</CTableHeaderCell>
              <CTableHeaderCell>Chi tiết</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((nv, idx) => (
              <React.Fragment key={nv.maNhanVien}>
                <CTableRow>
                  <CTableDataCell>{idx + 1}</CTableDataCell>
                  <CTableDataCell>{nv.tenNhanVien}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.doanhThu)}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.tongHoaHong)}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(nv.tongLuong)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      onClick={() => setExpandedRow(expandedRow === nv.maNhanVien ? null : nv.maNhanVien)}
                    >
                      {expandedRow === nv.id ? "Ẩn" : "Xem"}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                <CTableRow>
                  <CTableDataCell colSpan={8} className="p-0 border-0">
                    <CCollapse visible={expandedRow === nv.maNhanVien}>
                      <CTable small bordered className="mb-3">
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell>Mã HĐ</CTableHeaderCell>
                            <CTableHeaderCell>Ngày</CTableHeaderCell>
                            <CTableHeaderCell>Khách</CTableHeaderCell>
                            <CTableHeaderCell>Vai trò</CTableHeaderCell>
                            <CTableHeaderCell>Tổng tiền</CTableHeaderCell>
                            <CTableHeaderCell>Tỷ lệ</CTableHeaderCell>
                            <CTableHeaderCell>Hoa hồng</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {nv.hoaDons.map((hd, idx) => (
                            <CTableRow key={idx}>
                              <CTableDataCell>{hd.maHoaDon}</CTableDataCell>
                              <CTableDataCell>{hd.ngay}</CTableDataCell>
                              <CTableDataCell>{hd.tenKhach}</CTableDataCell>
                              <CTableDataCell>{hd.vaiTro}</CTableDataCell>
                              <CTableDataCell>{formatCurrency(hd.tongTien ? hd.tongTien : 0)}</CTableDataCell>
                              <CTableDataCell>{hd.phanTram}%</CTableDataCell>
                              <CTableDataCell>{formatCurrency(hd.hoaHong ? hd.hoaHong : 0)}</CTableDataCell>
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
