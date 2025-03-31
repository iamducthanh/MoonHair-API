import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CCollapse, CFormTextarea,
    CButton,
    CFormInput, CForm,
    CFormSelect,
    CFormSwitch, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CCardHeader
} from '@coreui/react'
import productApi from '../../../api/productApi';
import { toast } from 'react-toastify';


const PurchaseOrderList = () => {
    const [phieuNhapList, setPhieuNhapList] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null)

    useEffect(() => {
        // Gọi API lấy danh sách phiếu nhập hàng
        fetchPhieuNhap();
    }, []);

    const fetchPhieuNhap = async () => {
        // Giả lập dữ liệu
        const fakeData = [
            {
                id: 'PN000050',
                thoiGian: '28/03/2025 22:41',
                nhaCungCap: 'ABC Pharma',
                canTra: 260000,
                trangThai: 'Đã nhập hàng',
                chiNhanh: 'Chi nhánh trung tâm',
                nhanVien: 'Minh Tuấn',
                sanPham: [
                    {
                        maHang: 'SP000027',
                        tenHang: 'Kem dưỡng ẩm Bioderma Sebium Pore Refiner',
                        soLuong: 1,
                        donGia: 260000,
                        giamGia: 0,
                        giaNhap: 260000,
                    },
                ],
            },
            {
                id: 'PN000051',
                thoiGian: '28/03/2025 22:41',
                nhaCungCap: 'ABC Pharma',
                canTra: 260000,
                trangThai: 'Đã nhập hàng',
                chiNhanh: 'Chi nhánh trung tâm',
                nhanVien: 'Minh Tuấn',
                sanPham: [
                    {
                        maHang: 'SP000027',
                        tenHang: 'Kem dưỡng ẩm Bioderma Sebium Pore Refiner',
                        soLuong: 1,
                        donGia: 260000,
                        giamGia: 0,
                        giaNhap: 260000,
                    },
                ],
            },
        ];

        setPhieuNhapList(fakeData);

        setExpandedProductId(fakeData[0].id);
    };

    const handleRowClick = (id) => {
        setExpandedProductId((prev) => (prev === id ? null : id))
    }

    function revertDateToInput(inputDate) {
        const [datePart, timePart] = inputDate.split(" ");
        const [day, month, year] = datePart.split("/");
        return `${year}-${month}-${day} ${timePart}`;
    }


    return (
        <CRow>
            <CCol style={{ textAlign: 'left', marginBottom: '10px' }} xs={6}>
                <h4>Danh sách phiếu nhập hàng</h4>
            </CCol>
            <CCol style={{ textAlign: 'right', marginBottom: '10px' }} xs={6}>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Thêm sản phẩm
                </CButton>
            </CCol>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <CTable striped>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Mã nhập hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Thời gian</CTableHeaderCell>
                                    <CTableHeaderCell>Nhà cung cấp</CTableHeaderCell>
                                    <CTableHeaderCell>Cần trả NCC</CTableHeaderCell>
                                    <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {phieuNhapList.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <CTableRow onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }}>
                                            <CTableDataCell>{item.id}</CTableDataCell>
                                            <CTableDataCell>{item.thoiGian}</CTableDataCell>
                                            <CTableDataCell>{item.nhaCungCap}</CTableDataCell>
                                            <CTableDataCell>{item.canTra.toLocaleString()}</CTableDataCell>
                                            <CTableDataCell>{item.trangThai}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={6} className="p-0">
                                                <CCollapse visible={expandedProductId === item.id}>
                                                    <CCardBody>
                                                        <CRow>
                                                            <CCol md={2}>
                                                                <strong>Mã nhập hàng:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <p>{item.id}</p>
                                                            </CCol>
                                                            <CCol md={2}>
                                                                <strong>Chi nhánh:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <p>{item.chiNhanh}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol md={2}>
                                                                <strong>Thời gian:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <CFormInput name="name" className='mb-1' type="datetime-local" value={revertDateToInput(item.thoiGian)}></CFormInput>
                                                            </CCol>
                                                            <CCol md={2}>
                                                                <strong>Nhân viên nhập:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <p>{item.nhanVien}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol md={2}>
                                                                <strong>Nhà cung cấp:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <CFormInput className='mb-1' name="name" type="text" value={item.nhaCungCap}></CFormInput>

                                                            </CCol>
                                                        </CRow>
                                                        <CRow className="mb-2">
                                                            <CCol md={2}><strong>Ghi chú:</strong></CCol>
                                                            <CCol md={7}>
                                                                <CFormTextarea name="note" rows={4} value='' />
                                                            </CCol>
                                                        </CRow>
                                                        <CTable>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell>Mã hàng hóa</CTableHeaderCell>
                                                                    <CTableHeaderCell>Tên hàng</CTableHeaderCell>
                                                                    <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                                                    <CTableHeaderCell>Đơn giá</CTableHeaderCell>
                                                                    <CTableHeaderCell>Giá nhập</CTableHeaderCell>
                                                                    <CTableHeaderCell>Thành tiền</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                {item.sanPham.map((sp, index) => (
                                                                    <CTableRow key={index}>
                                                                        <CTableDataCell>{sp.maHang}</CTableDataCell>
                                                                        <CTableDataCell>{sp.tenHang}</CTableDataCell>
                                                                        <CTableDataCell>{sp.soLuong}</CTableDataCell>
                                                                        <CTableDataCell>{sp.donGia.toLocaleString()}</CTableDataCell>
                                                                        <CTableDataCell>{sp.giaNhap.toLocaleString()}</CTableDataCell>
                                                                        <CTableDataCell style={{ textAlign: 'right' }}>{(sp.soLuong * sp.giaNhap).toLocaleString()}</CTableDataCell>
                                                                    </CTableRow>
                                                                ))}
                                                            </CTableBody>
                                                        </CTable>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Tổng số lượng:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.id}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Tổng số mặt hàng:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.id}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Tổng tiền hàng:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.id}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Tiền cần trả:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.id}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol md={12} className="text-end">
                                                                <CButton style={{ marginRight: '10px', color: 'white' }} color="success" >Lưu</CButton>
                                                                <CButton style={{ marginRight: '10px', color: 'white' }} color="danger">Hủy bỏ</CButton>
                                                            </CCol>
                                                        </CRow>
                                                    </CCardBody>
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


export default PurchaseOrderList
