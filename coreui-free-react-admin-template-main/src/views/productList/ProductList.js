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
    CFormSwitch, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import productApi from '../../api/productApi';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const ProductList = () => {
    const [expandedProductId, setExpandedProductId] = useState(null)
    const [products, setProducts] = useState([]);
    const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
    const [editMode, setEditMode] = useState(false)
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        priceOut: '',
        lotId: '',
        branchId: selectedBranchLocal
    });
    const [formEditErrors, setFormEditErrors] = useState({});

    const [visible, setVisible] = useState(false)

    const [formProductAdd, setFormProductAdd] = useState({
        name: '',
        quantity: '',
        price: '',
        size: '',
        note: '',
        active: 0,
        productType: 'SAN_PHAM',
        branchId: selectedBranchLocal
    })

    useEffect(() => {
        fetchProducts();
    }, [selectedBranchLocal]);

    const fetchProducts = async () => {
        if (selectedBranchLocal) {
            try {
                const response = await productApi.getAllProductListByBranch(selectedBranchLocal);
                setProducts(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải danh sách sản phẩm!');
            }
        }
    };

    const handleRowClick = (id) => {
        setExpandedProductId((prev) => (prev === id ? null : id))
    }

    const offEditMode = () => {
        setEditMode(false)
        setFormEditErrors({})
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value ?? ''
        }));
    }

    const handleUpdate = (product, editMode) => {
        setEditMode(editMode)
        setFormData(product)
    }

    const handleSave = async () => {
        if (!validateEditForm()) {
            return; // không gửi nếu có lỗi
        }
        await productApi.updateProductList(formData)
        setEditMode(false)
        fetchProducts();
        toast.success('Cập nhật sản phẩm thành công!');
    }

    const validateEditForm = () => {
        const errors = {};
        const { name, priceOut } = formData;

        if (!priceOut || isNaN(priceOut) || Number(priceOut) <= 0) {
            errors.priceOut = 'Giá bán phải là số lớn hơn 0';
        }

        setFormEditErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <CTable striped hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>STT</CTableHeaderCell>
                                    <CTableHeaderCell>Mã hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                                    <CTableHeaderCell>Kích thước</CTableHeaderCell>
                                    <CTableHeaderCell>Mã lô</CTableHeaderCell>
                                    <CTableHeaderCell>Giá vốn</CTableHeaderCell>
                                    <CTableHeaderCell>Giá bán</CTableHeaderCell>
                                    <CTableHeaderCell>Số lượng nhập</CTableHeaderCell>
                                    <CTableHeaderCell>Số lượng còn</CTableHeaderCell>
                                    <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {products.map((p, index) => (
                                    <React.Fragment key={index}>
                                        <CTableRow onClick={() => handleRowClick(index)} style={{ cursor: 'pointer' }}>
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>{p.productCode}</CTableDataCell>
                                            <CTableDataCell>{p.productName}</CTableDataCell>
                                            <CTableDataCell>{p.size}</CTableDataCell>
                                            <CTableDataCell>{p.lotCode}</CTableDataCell>
                                            <CTableDataCell>{p.costPrice ? p.costPrice.toLocaleString() : ''}</CTableDataCell>
                                            <CTableDataCell>{p.priceOut ? p.priceOut.toLocaleString() : ''}</CTableDataCell>
                                            <CTableDataCell>{p.quantityImported}</CTableDataCell>
                                            <CTableDataCell>{p.quantityRemaining}</CTableDataCell>
                                            <CTableDataCell>{p.status == true ? 'Mở bán' : 'Ngừng bán'}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={12} className="p-0">
                                                <CCollapse visible={expandedProductId === index}>
                                                    <CCardBody>
                                                        <CRow>
                                                            <CCol md={12}>
                                                        
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}><strong>Giá bán:</strong></CCol>
                                                                    <CCol md={5}>{editMode ? (
                                                                        <CFormInput name="priceOut" value={formData.priceOut ?? ''} invalid={!!formEditErrors.priceOut}
                                                                            onChange={handleChange} type="number" />
                                                                    ) : (
                                                                        <div>{p.priceOut ? p.priceOut.toLocaleString() : ''} VND</div>
                                                                    )}{formEditErrors.priceOut && <div className="text-danger">{formEditErrors.priceOut}</div>}
                                                                    </CCol>
                                                                    
                                                                </CRow>
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}><strong>Ngày nhập:</strong></CCol>
                                                                    <CCol md={5}>{new Date(p.importDate).toLocaleString()}</CCol>
                                                                </CRow>
                                                                <CRow>
                                                                    <CCol md={12} className="text-end">
                                                                        {editMode ? (
                                                                            <>
                                                                                <CButton color="success" className="me-2" onClick={handleSave}>Lưu</CButton>
                                                                                <CButton color="secondary" onClick={offEditMode}>Hủy</CButton>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <CButton style={{ marginRight: '10px' }} color="primary" onClick={() => handleUpdate(p, true)}>Cập nhật</CButton>
                                                                            </>
                                                                        )}
                                                                    </CCol>
                                                                </CRow>
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
    )
}

export default ProductList
