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
import dayjs from "dayjs";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import employeeApi from '../../../api/employeeApi';

const AccountingBookList = () => {
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const [invoice, setInvoice] = useState([]);
  const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
  const [isTodayChecked, setIsTodayChecked] = useState(true);
  const navigate = useNavigate();
  const [editStates, setEditStates] = useState({});
  const [employees, setEmployees] = useState([]);

  const [filters, setFilters] = useState({
    isToday: true,
    fromDate: "",
    toDate: "",
    trangThais: {
      hoanThanh: false,
      choChuyenKhoan: false,
    },
    phuongThucs: {
      tienMat: false,
      chuyenKhoan: false,
    },
    customerName: '', // 👈 thêm dòng này
  });

  const [invoiceUpdate, setInvoiceUpdate] = useState({
    trangThai: "",
  });
  const [sellUpdate, setSellUpdate] = useState({
    thoChinh: "",
    thoPhu: "",
    maSell: "",
  });



  useEffect(() => {
    fetchFilteredInvoice();
    fetchEmployee();

  }, [filters, selectedBranchLocal]);

  const fetchFilteredInvoice = async () => {
    try {
      const payload = buildFilterPayload();
      if (payload.fromDate) {
        payload.fromDate = dayjs(payload.fromDate).format("DD/MM/YYYY");
      }
      if (payload.toDate) {
        payload.toDate = dayjs(payload.toDate).format("DD/MM/YYYY");
      }
      const res = await sellApi.getSellList(payload);
      setInvoice(res.data);
    } catch (error) {
      console.error("Lỗi khi fetch hóa đơn:", error);
    }
  };
  const fetchEmployee = async () => {
    const response = await employeeApi.getEmployeesByBranch(selectedBranchLocal);
    setEmployees(response.data);
  };
  const toggleDetail = (id) => {
    setActiveInvoiceId((prev) => (prev === id ? null : id));
  };

  const buildFilterPayload = () => {
    return {
      isToday: filters.isToday,
      customerName: filters.customerName,
      fromDate: !filters.isToday ? filters.fromDate : null,
      toDate: !filters.isToday ? filters.toDate : null,
      trangThaiList: Object.entries(filters.trangThais)
        .filter(([_, value]) => value)
        .map(([key]) => {
          if (key === "hoanThanh") return "100";
          if (key === "choChuyenKhoan") return "82";
          return key;
        }),
      phuongThucList: Object.entries(filters.phuongThucs)
        .filter(([_, value]) => value)
        .map(([key]) => {
          if (key === "tienMat") return "tienmat";
          if (key === "chuyenKhoan") return "chuyenkhoan";
          return key;
        }),
    };
  };

  const updateInvoiceStatus = async (maHoaDon, invoiceUpdate) => {
    try {
      const res = await sellApi.updateInvoice(maHoaDon, invoiceUpdate);

      console.log(res);
      if (res.status != 200) {
        throw new Error("Lỗi khi cập nhật trạng thái hóa đơn");
      }
      fetchFilteredInvoice();
      console.log("Cập nhật thành công hóa đơn:", maHoaDon);
    } catch (error) {
      console.error("Cập nhật lỗi:", error);
    }
  };

  const handleCancelInvoice = (invoiceId) => {
    Swal.fire({
      title: 'Xác nhận hủy đơn hàng?',
      text: "Bạn sẽ không thể hoàn tác thao tác này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hủy đơn!',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Gọi API hủy đơn ở đây
        const res = await sellApi.updateInvoice(invoiceId, { isDelete: true });
        if (res.status != 200) {
          throw new Error("Lỗi khi cập nhật trạng thái hóa đơn");
        }
        fetchFilteredInvoice();
        // TODO: gọi API thật
        // fetch(`/api/invoice/${invoiceId}/cancel`, { method: 'PUT' })
        //   .then(() => {
        //     Swal.fire('Đã hủy!', 'Hóa đơn đã bị hủy.', 'success');
        //   })
        //   .catch(() => {
        //     Swal.fire('Lỗi!', 'Không thể hủy hóa đơn.', 'error');
        //   });
      }
    });
  };


  const handleCopyInvoice = (maHoaDon) => {
    if (!maHoaDon) return;
    navigate(`/transaction/sell?maHoaDon=${maHoaDon}`);
  };
  return (
    <CRow>
      {/* Sidebar Filter */}
      <CCol md={3}>
        <CCard>
          <CCardBody>
            <h5>Tìm kiếm</h5>
            <CFormInput
              placeholder="Theo tên khách..."
              className="mb-3"
              value={filters.customerName}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, customerName: e.target.value }))
              }
            />
            <h6>Thời gian</h6>
            <CFormCheck
              label="Hôm nay"
              name="time"
              checked={filters.isToday}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, isToday: e.target.checked }))
              }
            />

            <CFormInput
              disabled={filters.isToday}
              type="date"
              className="mt-2 mb-3"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, fromDate: e.target.value }))
              }
            />

            <CFormInput
              disabled={filters.isToday}
              type="date"
              className="mt-2 mb-3"
              value={filters.toDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, toDate: e.target.value }))
              }
            />

            <h6>Trạng thái</h6>
            <CFormCheck
              label="Hoàn thành"
              checked={filters.trangThais.hoanThanh}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  trangThais: { ...prev.trangThais, hoanThanh: e.target.checked },
                }))
              }
            />
            <CFormCheck
              label="Chờ chuyển khoản"
              checked={filters.trangThais.choChuyenKhoan}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  trangThais: { ...prev.trangThais, choChuyenKhoan: e.target.checked },
                }))
              }
            />

            <h6>Phương thức</h6>
            <CFormCheck
              label="Tiền mặt"
              checked={filters.phuongThucs.tienMat}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  phuongThucs: { ...prev.phuongThucs, tienMat: e.target.checked },
                }))
              }
            />
            <CFormCheck
              label="Chuyển khoản"
              checked={filters.phuongThucs.chuyenKhoan}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  phuongThucs: { ...prev.phuongThucs, chuyenKhoan: e.target.checked },
                }))
              }
            />
          </CCardBody>
        </CCard>
      </CCol>

      {/* Main Content */}
      <CCol md={9}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Hóa đơn</h4>
          <div className="d-flex gap-2">
            <CButton style={{ color: 'white' }} color="success" onClick={() => navigate('/transaction/sell')}>+ Tạo hóa đơn</CButton>
            {/* <CButton color="info">📄 Xuất file</CButton> */}
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
                {invoice
                  .filter((inv) => inv.maHoaDon != null)
                  .map((invoice) => (
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
                                    {editStates[invoice.id]?.isEdit ? (
                                      <div>
                                        <strong>Trạng thái:</strong>
                                        <CFormSelect
                                          value={editStates[invoice.id].selectedTrangThai}
                                          onChange={(e) => {
                                            setEditStates((prev) => ({
                                              ...prev,
                                              [invoice.id]: {
                                                ...prev[invoice.id],
                                                selectedTrangThai: e.target.value,
                                              },
                                            }));
                                            setSellUpdate((prev) => ({ ...prev, thoChinh: e.target.value }))
                                          }
                                          }
                                          className="mt-2">
                                          <option value="100">Hoàn thành</option>
                                          <option value="82">Chờ chuyển khoản</option>
                                        </CFormSelect>
                                      </div>
                                    ) : (
                                      <p><strong>Trạng thái:</strong> {invoice.trangThai}</p>
                                    )}
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


                                        {editStates[invoice.id]?.isEdit ? (
                                          <div>
                                            <CFormSelect
                                              size="sm"
                                              value={editStates[item.idHoaDonChiTiet] }
                                              onChange={(e) => {
                                                setEditStates((prev) => ({
                                                  ...prev,
                                                  [item.idHoaDonChiTiet]: {
                                                    ...prev[item.idHoaDonChiTiet],
                                                    thoChinh: e.target.value,
                                                  },
                                                }));
                                                setInvoiceUpdate((prev) => ({ ...prev, thoChinh: e.target.value }))
                                              }}
                                            >
                                              <option value="">Thợ chính</option>
                                              {employees.filter((nv) => nv.type !== '')
                                                .map((nv) => (
                                                  <option key={nv.id} value={nv.id}>
                                                    {nv.name}
                                                  </option>
                                                ))}
                                            </CFormSelect>
                                          </div>
                                        ) : (
                                          <CTableDataCell>{item.thoChinh}</CTableDataCell>
                                        )}



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
                                  {editStates[invoice.id]?.isEdit ? (
                                    <CButton
                                      color="success"
                                      onClick={() => {
                                        const updatedStatus = editStates[invoice.id].selectedTrangThai;
                                        console.log("Lưu trạng thái mới:", invoiceUpdate);
                                        console.log("Lưu trạng thái mới:", invoice.maHoaDon);
                                        updateInvoiceStatus(invoice.maHoaDon, invoiceUpdate);
                                        setEditStates((prev) => ({
                                          ...prev,
                                          [invoice.id]: {
                                            ...prev[invoice.id],
                                            isEdit: false,
                                          },
                                        }));
                                      }}
                                    >
                                      💾 Lưu thay đổi
                                    </CButton>
                                  ) : (
                                    <CButton
                                      color="warning"
                                      onClick={() => {
                                        setEditStates((prev) => ({
                                          ...prev,
                                          [invoice.id]: {
                                            isEdit: true,
                                            selectedTrangThai: invoice.status === 'Hoàn thành' ? '100' : '82',
                                          },
                                        }))
                                        setInvoiceUpdate((prev) => ({ ...prev, trangThai: invoice.status === 'Hoàn thành' ? '100' : '82' }))

                                      }
                                      }
                                    >
                                      ✏️ Cập nhật
                                    </CButton>

                                  )}
                                  {/* <CButton
                                    color="warning"
                                    onClick={() => handleCopyInvoice(invoice.maHoaDon)}
                                  >
                                    📋 Sao chép đơn
                                  </CButton> */}
                                  <CButton color="danger" onClick={() => handleCancelInvoice(invoice.maHoaDon)}>❌ Hủy bỏ</CButton>
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
          <React.Fragment>
            {invoice.length > 1 && (
              <div className="pl-4" style={{ paddingLeft: '20px' }}>
                <p><strong>Tổng doanh thu:</strong> {invoice[invoice.length - 1].tongDoanhThu.toLocaleString()} đ</p>
                <p><strong>Tổng tiền mặt:</strong> {invoice[invoice.length - 1].tongTienMat.toLocaleString()} đ</p>
                <p><strong>Tổng chuyển khoản:</strong> {invoice[invoice.length - 1].tongChuyenKhoan.toLocaleString()} đ</p>
              </div>
            )}
          </React.Fragment>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AccountingBookList;
