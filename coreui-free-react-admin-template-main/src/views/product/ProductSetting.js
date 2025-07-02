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
import Swal from 'sweetalert2';

const ProductSetting = () => {
    const [expandedProductId, setExpandedProductId] = useState(null)
    const [products, setProducts] = useState([]);
    const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
    const [editMode, setEditMode] = useState(false)
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        size: '',
        note: '',
        active: 0,
        productType: 'SAN_PHAM',
        branchId: selectedBranchLocal
    });
    const [formEditErrors, setFormEditErrors] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const loaiSanPhamMap = {
        SAN_PHAM: "Sản phẩm",
        HOA_CHAT: "Hóa chất",
        DICH_VU: "Dịch vụ",
    };

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
                const response = await productApi.getAllProductByBranch(selectedBranchLocal);
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

    const handleToggle = () => {
        setFormData(prev => ({ ...prev, active: !prev.active }))
    }

    const handleSave = async () => {
        if (!validateEditForm()) {
            return; // không gửi nếu có lỗi
        }
        await productApi.updateProduct(formData)
        setEditMode(false)
        fetchProducts();
        toast.success('Cập nhật sản phẩm thành công!');
    }

    const handleChangeAddProduct = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        setFormProductAdd({ ...formProductAdd, [name]: value })
    }

    const handleSubmitAddProduct = async () => {
        if (!validateForm()) {
            return; // có lỗi thì không gọi API
        }
        await productApi.createProduct(formProductAdd)
        setVisible(false)
        fetchProducts();

        setFormProductAdd({
            name: '',
            quantity: '',
            price: '',
            size: '',
            note: '',
            active: 0,
            productType: 'SAN_PHAM',
            branchId: selectedBranchLocal
        });
        toast.success('Thêm sản phẩm thành công!');
    }

    const handleToggleAddProduct = () => {
        setFormProductAdd(prev => ({ ...prev, active: !prev.active }))
    }
    const validateForm = () => {
        const errors = {};
        const { name, price, quantity } = formProductAdd;

        if (!name || name.trim() === '') {
            errors.name = 'Tên sản phẩm không được để trống';
        }

        if (!price || isNaN(price) || Number(price) <= 0) {
            errors.price = 'Giá bán phải là số lớn hơn 0';
        }

        if (!quantity || isNaN(quantity) || Number(quantity) < 0) {
            errors.quantity = 'Số lượng phải là số không âm';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateEditForm = () => {
        const errors = {};
        const { name, price } = formData;

        if (!name || name.trim() === '') {
            errors.name = 'Tên sản phẩm không được để trống';
        }

        if (!price || isNaN(price) || Number(price) <= 0) {
            errors.price = 'Giá bán phải là số lớn hơn 0';
        }

        setFormEditErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDelete = async () => {
        try {
          await productApi.deleteProduct(productToDelete.id); // API xoá
          toast.success("Xóa sản phẩm thành công!");
          fetchProducts(); // load lại danh sách
        } catch (error) {
            console.log(error);
            
          toast.error("Xóa sản phẩm thất bại!");
        }
        setShowDeleteModal(false)
      };


    return (
        <CRow>
            <CCol style={{ textAlign: 'right', marginBottom: '10px' }} xs={12}>
                <CButton color="primary" onClick={() => setVisible(true)}>
                    + Thêm sản phẩm
                </CButton>
            </CCol>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <CTable striped hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>STT</CTableHeaderCell>
                                    <CTableHeaderCell>Mã hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Loại hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Tên hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Giá bán</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {products.map((p, index) => (
                                    <React.Fragment key={p.id}>
                                        <CTableRow onClick={() => handleRowClick(p.id)} style={{ cursor: 'pointer' }}>
                                            <CTableDataCell>{index + 1}</CTableDataCell>
                                            <CTableDataCell>SP0{p.id}</CTableDataCell>
                                            <CTableDataCell>{loaiSanPhamMap[p.productType]}</CTableDataCell>
                                            <CTableDataCell>{p.name}</CTableDataCell>
                                            <CTableDataCell>{p.price ? p.price.toLocaleString() : ''}</CTableDataCell>
                                        </CTableRow>
                                        <CTableRow>
                                            <CTableDataCell colSpan={6} className="p-0">
                                                <CCollapse visible={expandedProductId === p.id}>
                                                    <CCardBody>
                                                        <CRow>
                                                            <CCol md={12}>
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}>
                                                                        <strong>Tên:</strong>

                                                                    </CCol>
                                                                    <CCol md={5}>
                                                                        {editMode ? (
                                                                            <CFormInput name="name" value={formData.name || ''}
                                                                                onChange={handleChange} invalid={!!formEditErrors.name}
                                                                            />
                                                                        ) : (
                                                                            <div>{p.name}</div>
                                                                        )}
                                                                        {formEditErrors.name && <div className="text-danger">{formEditErrors.name}</div>}

                                                                    </CCol>
                                                                    <CCol md={1}><strong>Loại:</strong></CCol>
                                                                    <CCol md={5}>
                                                                        {editMode ? (
                                                                            <CFormSelect name="productType" value={formData.productType} onChange={handleChange}>
                                                                                <option value="SAN_PHAM">Sản phẩm</option>
                                                                                <option value="HOA_CHAT">Hóa chất</option>
                                                                                <option value="DICH_VU">Dịch vụ</option>
                                                                            </CFormSelect>
                                                                        ) : (
                                                                            <div>{loaiSanPhamMap[p.productType]}</div>
                                                                        )}</CCol>
                                                                </CRow>
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}><strong>Giá bán:</strong></CCol>
                                                                    <CCol md={5}>{editMode ? (
                                                                        <CFormInput name="price" value={formData.price ?? ''} invalid={!!formEditErrors.price}
                                                                            onChange={handleChange} type="number" />
                                                                    ) : (
                                                                        <div>{p.price ? p.price.toLocaleString() : ''} VND</div>
                                                                    )}{formEditErrors.price && <div className="text-danger">{formEditErrors.price}</div>}
                                                                    </CCol>
                                                                    
                                                                </CRow>
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}><strong>Ngày tạo:</strong></CCol>
                                                                    <CCol md={5}>{new Date(p.ngayTao).toLocaleString()}</CCol>
                                                                    <CCol md={1}><strong>Active:</strong></CCol>
                                                                    <CCol md={5}>{editMode ? (
                                                                        <CFormSwitch checked={formData.active} onChange={handleToggle} label={formData.active ? "Mở bán" : "Không mở bán"} />
                                                                    ) : (
                                                                        <div>{p.active ? "✔️ Có" : "❌ Không"}</div>
                                                                    )}</CCol>
                                                                </CRow>
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}><strong>Ngày sửa:</strong></CCol>
                                                                    <CCol md={5}>{new Date(p.ngaySua).toLocaleString()}</CCol>
                                                                    <CCol md={1}><strong>Dung tích:</strong></CCol>
                                                                    <CCol md={4}>{editMode ? (
                                                                        <CFormInput name="size" value={formData.size} onChange={handleChange} />
                                                                    ) : (
                                                                        <div>{p.size}</div>
                                                                    )}</CCol>

                                                                </CRow>
                                                                <CRow className="mb-2">
                                                                    <CCol md={1}><strong>Ghi chú:</strong></CCol>
                                                                    <CCol md={7}>{editMode ? (
                                                                        <CFormTextarea name="note" rows={4} value={formData.note || ''} onChange={handleChange} />
                                                                    ) : (
                                                                        <div>{p.note}</div>
                                                                    )}</CCol>
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
                                                                                <CButton color="danger" onClick={() => { setProductToDelete(p); setShowDeleteModal(true); }}>Xóa</CButton>
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
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>Xác nhận xóa</CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn xóa sản phẩm này?</CModalBody>
                <CModalFooter>
                    <CButton color='danger' onClick={handleDelete}>Xác nhận</CButton>
                    <CButton color='secondary' onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                </CModalFooter>
            </CModal>
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Thêm sản phẩm</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3">
                            <CCol>
                                <CFormInput
                                    label="Tên sản phẩm"
                                    name="name"
                                    value={formProductAdd.name}
                                    onChange={handleChangeAddProduct}
                                    invalid={!!formErrors.name}
                                />
                                {formErrors.name && <div className="text-danger">{formErrors.name}</div>}

                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol>
                                <CFormInput
                                    label="Giá bán"
                                    type="number"
                                    name="price"
                                    value={formProductAdd.price}
                                    onChange={handleChangeAddProduct}
                                    invalid={!!formErrors.price}
                                />
                                {formErrors.price && <div className="text-danger">{formErrors.price}</div>}
                            </CCol>
                        </CRow>

                        <CRow className="mb-3">
                            <CCol>
                                <CFormInput
                                    label="Kích thước"
                                    name="size"
                                    value={formProductAdd.size}
                                    onChange={handleChangeAddProduct}
                                />
                            </CCol>
                            <CCol>
                                <CFormSelect
                                    label="Loại"
                                    name="productType"
                                    value={formProductAdd.productType}
                                    onChange={handleChangeAddProduct}
                                >
                                    <option value="SAN_PHAM">Sản phẩm</option>
                                    <option value="HOA_CHAT">Hóa chất</option>
                                    <option value="DICH_VU">Dịch vụ</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormSwitch checked={formProductAdd.active} onChange={handleToggleAddProduct} label={formProductAdd.active ? "Mở bán" : "Không mở bán"} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormTextarea
                                    label="Ghi chú"
                                    name="note"
                                    value={formProductAdd.note}
                                    onChange={handleChangeAddProduct}
                                    rows={3}
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Hủy
                    </CButton>
                    <CButton color="primary" onClick={handleSubmitAddProduct}>
                        Lưu
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    )
}

export default ProductSetting
