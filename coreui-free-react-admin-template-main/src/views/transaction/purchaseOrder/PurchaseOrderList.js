import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import purchaseOrderApi from '../../../api/purchaseOrderApi';
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
import { useAppContext } from '../../../context/AppContext';


const PurchaseOrderList = () => {
    const [phieuNhapList, setPhieuNhapList] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null)
    const navigate = useNavigate();
    const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
    const { selectedBranchLocalName, setSelectedBranchLocalName } = useAppContext();

    useEffect(() => {
        // Gọi API lấy danh sách phiếu nhập hàng
        fetchPhieuNhap();
    }, [selectedBranchLocal]);

    const fetchPhieuNhap = async () => {
        const res = await purchaseOrderApi.getAllPurchaseOrder(selectedBranchLocal)
        setPhieuNhapList(res.data);
    };

    const handleRowClick = (id) => {
        setExpandedProductId((prev) => (prev === id ? null : id))
    }

    return (
        <CRow>
            <CCol style={{ textAlign: 'left', marginBottom: '10px' }} xs={6}>
                <h4>Phiếu nhập hàng</h4>
            </CCol>
            <CCol style={{ textAlign: 'right', marginBottom: '10px' }} xs={6}>
                <CButton color="primary" onClick={() => navigate('/transaction/purchaseOrder/add')}>
                    + Nhập hàng
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
                                            <CTableDataCell>{item.code}</CTableDataCell>
                                            <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                                            <CTableDataCell>{item.supplierName}</CTableDataCell>
                                            <CTableDataCell>{item.finalAmount.toLocaleString()}</CTableDataCell>
                                            <CTableDataCell>{item.status}</CTableDataCell>
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
                                                                <p>{item.code}</p>
                                                            </CCol>
                                                            <CCol md={2}>
                                                                <strong>Chi nhánh:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <p>{selectedBranchLocalName}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol md={2}>
                                                                <strong>Thời gian:</strong>
                                                            </CCol>
                                                            <CCol md={4}>
                                                                <CFormInput name="name" className='mb-1' type="datetime-local" 
                                                                value={item.createdAt}
                                                                ></CFormInput>
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
                                                                <CFormInput className='mb-1' name="name" type="text" value={item.supplierName}></CFormInput>

                                                            </CCol>
                                                        </CRow>
                                                        <CRow className="mb-2">
                                                            <CCol md={2}><strong>Ghi chú:</strong></CCol>
                                                            <CCol md={7}>
                                                                <CFormTextarea name="note" rows={4} value={item.note} />
                                                            </CCol>
                                                        </CRow>
                                                        <CTable>
                                                            <CTableHead>
                                                                <CTableRow>
                                                                    <CTableHeaderCell>Mã hàng hóa</CTableHeaderCell>
                                                                    <CTableHeaderCell>Tên hàng</CTableHeaderCell>
                                                                    <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                                                    <CTableHeaderCell>Giá nhập</CTableHeaderCell>
                                                                    <CTableHeaderCell style={{textAlign: 'right'}}>Thành tiền</CTableHeaderCell>
                                                                </CTableRow>
                                                            </CTableHead>
                                                            <CTableBody>
                                                                {item.details.map((sp, index) => (
                                                                    <CTableRow key={index}>
                                                                        <CTableDataCell>{sp.maHang}</CTableDataCell>
                                                                        <CTableDataCell>{sp.productName}</CTableDataCell>
                                                                        <CTableDataCell>{sp.quantity}</CTableDataCell>
                                                                        <CTableDataCell>{sp.importPrice.toLocaleString()}</CTableDataCell>
                                                                        <CTableDataCell style={{ textAlign: 'right' }}>{(sp.quantity * sp.importPrice).toLocaleString()}</CTableDataCell>
                                                                    </CTableRow>
                                                                ))}
                                                            </CTableBody>
                                                        </CTable>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Tổng số mặt hàng:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.details.length}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Tổng tiền hàng:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.totalAmount.toLocaleString()}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Giảm giá:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.discount ? item.discount.toLocaleString():0}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Chi phí khác:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.otherCost ? item.otherCost.toLocaleString():0}</p>
                                                            </CCol>
                                                        </CRow>
                                                        <CRow>
                                                            <CCol style={{ textAlign: 'right' }} md={10}>
                                                                <strong>Số tiền thanh toán:</strong>
                                                            </CCol>
                                                            <CCol style={{ textAlign: 'right', paddingRight: '20px' }} md={2}>
                                                                <p>{item.finalAmount ? item.finalAmount.toLocaleString():0}</p>
                                                                
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
