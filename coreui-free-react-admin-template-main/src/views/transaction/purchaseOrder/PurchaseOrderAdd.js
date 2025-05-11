import React, { useState } from 'react'
import {
    CRow, CCol, CCard, CCardBody,
    CFormInput, CFormSelect, CButton,
    CTable, CTableHead, CTableBody,
    CTableRow, CTableDataCell, CTableHeaderCell,
    CInputGroup, CInputGroupText, CFormTextarea, CForm
} from '@coreui/react'
import { useNavigate } from 'react-router-dom';
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import productApi from '../../../api/productApi';
import purchaseOrderApi from '../../../api/purchaseOrderApi';
import { useAppContext } from '../../../context/AppContext';
import { toast } from 'react-toastify';

const PurchaseOrderAdd = () => {
    const navigate = useNavigate();
    const [sanPham, setSanPham] = useState([])
    const [phieuNhap, setPhieuNhap] = useState({
        giamGia: 0,
        nhaCungCap: ''
    })
    const [keyword, setKeyword] = useState('');
    const [nhaCungCap, setNhaCungCap] = useState('')
    const [ngayNhap, setNgayNhap] = useState(new Date().toISOString().slice(0, 16))
    const tinhThanhTien = (sp) => sp.soLuongNhap * sp.donGia
    const tongTienHang = sanPham.reduce((total, sp) => total + tinhThanhTien(sp), 0)
    const [showDropdown, setShowDropdown] = useState(false);
    const { selectedBranchLocal, setSelectedBranchLocal } = useAppContext();
    const { selectedBranchLocalName, setSelectedBranchLocalName } = useAppContext();

    const [sanPhamSearch, setSanPhamSearch] = useState([
        {
            id: 1,
            maHang: 'SP000026',
            tenHang: 'Nước hoa hồng TONER BIODERMA HYDRABIO',
            soLuong: 1,
            donGia: 25000000,
            giamGia: 0,
        }
    ])

    const handleFocus = async () => {
        setShowDropdown(true)
        try {
            const res = await productApi.searchProductByKey(keyword, selectedBranchLocal)
            setSanPhamSearch(res.data)
        } catch (err) {
            console.error('Lỗi tìm sản phẩm:', err)
        }
    }
    const handleBlur = () => {
        // Delay để click được item trong dropdown
        setTimeout(() => setShowDropdown(false), 200)
    }
    const handleSelect = (item) => {
        // Delay để click được item trong dropdown
        setTimeout(() => setShowDropdown(false), 200)
        item.soLuongNhap = 0;
        item.donGia = 0;
        item.thanhTien = 0;
        setSanPham((prev) => [...prev, item]);

        console.log(item);

    }

    const handleSoLuongChange = (index, value) => {
        const newSanPham = [...sanPham];
        newSanPham[index].soLuongNhap = parseInt(value) || 0;
        newSanPham[index].thanhTien = newSanPham[index].soLuongNhap * newSanPham[index].donGia
        setSanPham(newSanPham);
    };

    const handleDonGiaChange = (index, value) => {
        const newSanPham = [...sanPham];
        newSanPham[index].donGia = value || 0;
        newSanPham[index].thanhTien = newSanPham[index].soLuongNhap * newSanPham[index].donGia
        setSanPham(newSanPham);
    };

    const handleSearch = async (e) => {
        const value = e.target.value
        setKeyword(value)
        try {
            const res = await productApi.searchProductByKey(keyword, selectedBranchLocal)
            setSanPhamSearch(res.data)
        } catch (err) {
            console.error('Lỗi tìm sản phẩm:', err)
        }
    }

    const handleRemove = (index) => {
        const newSanPham = [...sanPham];
        newSanPham.splice(index, 1); // xoá phần tử tại vị trí index
        setSanPham(newSanPham);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nhaCungCap.trim()) {
            toast.error('Vui lòng nhập nhà cung cấp');
            return;
        }
        phieuNhap.ngayNhap = ngayNhap
        phieuNhap.branchId = selectedBranchLocal
        phieuNhap.nhaCungCap = nhaCungCap
        phieuNhap.tongTienHang = tongTienHang
        phieuNhap.product = sanPham
        // Gửi dữ liệu

        try {
            const response = await purchaseOrderApi.createPurchaseOrder(phieuNhap);
            toast.success('Thêm phiếu nhập thành công!');
            navigate('/transaction/purchaseOrder');
        } catch (error) {
            toast.error('Lỗi khi tạo phiếu nhập!');
        }
        console.log(phieuNhap);
    };


    return (
        <CRow>
            <CCol xs={8}>
                <div className="position-relative">
                    <CFormInput className="mb-3" onChange={handleSearch}
                        onFocus={handleFocus}
                        onBlur={handleBlur} placeholder="Tìm mã hoặc tên sản phẩm" />

                    {showDropdown && (
                        <div className="dropdown-menu show w-100" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {sanPhamSearch.length > 0 ? (
                                sanPhamSearch.map((item) => (
                                    <div
                                        key={item.id}
                                        className="dropdown-item"
                                        onClick={() => handleSelect(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <div><strong>{item.productName}</strong></div>
                                                <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                    {item.productCode} – Kích thước: {item.size}<br />
                                                    Tồn: {item.quantityRemaining}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="dropdown-item text-muted" style={{ fontStyle: 'italic' }}>
                                    Không tìm thấy sản phẩm nào
                                </div>
                            )}
                        </div>
                    )}

                </div>
                <CCard>
                    <CCardBody>
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>STT</CTableHeaderCell>
                                    <CTableHeaderCell>Mã sản phẩm</CTableHeaderCell>
                                    <CTableHeaderCell>Tên hàng</CTableHeaderCell>
                                    <CTableHeaderCell>Số lượng</CTableHeaderCell>
                                    <CTableHeaderCell>Đơn giá</CTableHeaderCell>
                                    <CTableHeaderCell>Thành tiền</CTableHeaderCell>
                                    <CTableHeaderCell></CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {sanPham.map((sp, index) => (
                                    <CTableRow key={index} style={{ verticalAlign: 'middle' }}>
                                        <CTableDataCell>{index + 1}</CTableDataCell>
                                        <CTableDataCell>{sp.productCode}</CTableDataCell>
                                        <CTableDataCell>{sp.productName}</CTableDataCell>
                                        <CTableDataCell><CFormInput style={{ width: '80px' }} onChange={(e) => handleSoLuongChange(index, e.target.value)} type="number" value={sp.soLuongNhap} /></CTableDataCell>
                                        <CTableDataCell><CFormInput style={{ width: '120px' }} onChange={(e) => handleDonGiaChange(index, e.target.value)} type="number" value={sp.donGia.toLocaleString()} /></CTableDataCell>
                                        <CTableDataCell>{sp.thanhTien.toLocaleString()}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="danger" size="sm" onClick={() => handleRemove(index)}>
                                                <CIcon icon={cilTrash} />
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>

            <CCol xs={4}>
                <CCard>
                    <CForm onSubmit={handleSubmit}>
                        <CCardBody>
                            <CRow className="mb-2">
                                <CCol xs={6}>
                                    <CFormInput readOnly disabled value={selectedBranchLocalName} className="mb-2" />
                                </CCol>
                                <CCol xs={6}>
                                    <CFormInput
                                        type="datetime-local"
                                        value={ngayNhap}
                                        onChange={(e) => setNgayNhap(e.target.value)}
                                        required
                                    />
                                </CCol>
                            </CRow>

                            <CFormInput
                                placeholder="Nhập tên nhà cung cấp"
                                className="mb-2"
                                value={nhaCungCap}
                                onChange={(e) => setNhaCungCap(e.target.value)}
                                required
                            />
                            <CFormInput disabled placeholder="Mã phiếu tự động" className="mb-2" />
                            <div className="mb-2"><strong>Trạng thái:</strong> Nhập hàng</div>
                            <div className="mb-2"><strong>Tổng tiền hàng:</strong> {tongTienHang.toLocaleString()}</div>

                            <CFormInput
                                label="Giảm giá"
                                type="number"
                                value={phieuNhap.giamGia}
                                onChange={(e) =>
                                    setPhieuNhap({ ...phieuNhap, giamGia: parseFloat(e.target.value) || 0 })
                                }
                                className="mb-2"
                            />

                            <div className="mb-2 text-danger">
                                <strong>Cần trả nhà cung cấp:</strong> {(tongTienHang - phieuNhap.giamGia).toLocaleString()}
                            </div>

                            <CFormInput
                                label="Tiền trả nhà cung cấp"
                                className="mb-2"
                                value={phieuNhap.tienTra}
                                onChange={(e) =>
                                    setPhieuNhap({ ...phieuNhap, tienTra: parseFloat(e.target.value) || 0 })
                                }
                                required
                            />

                            <CFormInput
                                label="Chi phí khác"
                                className="mb-2"
                                value={phieuNhap.chiPhiKhac}
                                onChange={(e) =>
                                    setPhieuNhap({ ...phieuNhap, chiPhiKhac: parseFloat(e.target.value) || 0 })
                                }
                            />

                            <CFormTextarea
                                label="Ghi chú"
                                name="note"
                                rows={4}
                                value={phieuNhap.ghiChu}
                                onChange={(e) =>
                                    setPhieuNhap({ ...phieuNhap, ghiChu: e.target.value })
                                }
                            />

                            <div className="mt-3" style={{ textAlign: 'right' }}>
                                <CButton type="submit" style={{color: 'white'}} color="success">Hoàn thành</CButton>
                            </div>
                        </CCardBody>
                    </CForm>

                </CCard>
            </CCol>
        </CRow>
    )
}

export default PurchaseOrderAdd
