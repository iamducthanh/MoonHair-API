import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import branchApi from '../../../api/branchApi';
import { CRow, CCol, CCard, CCardBody, CForm, CFormLabel, CFormInput, CButton } from '@coreui/react';
import { toast } from 'react-toastify';

const BranchAdd = () => {
    const [branch, setBranch] = useState({ name: '', address: '', active: true });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBranch((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await branchApi.createBranch(branch);
            toast.success('Thêm chi nhánh thành công!', { position: "top-right" });
            navigate('/system/branch');
        } catch (error) {
            toast.error('Lỗi khi thêm chi nhánh!', { position: "top-right" });
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <h3>Thêm Chi Nhánh</h3>
                        <CForm onSubmit={handleSubmit}>
                            <CFormLabel htmlFor="name">Tên Chi Nhánh</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={branch.name} onChange={handleChange} required />
                            
                            <CFormLabel htmlFor="address">Địa Chỉ</CFormLabel>
                            <CFormInput type="text" id="address" name="address" value={branch.address} onChange={handleChange} required />
                            
                            <CButton type="submit" color="success" className="mt-3">Lưu</CButton>
                            <CButton type="button" color="secondary" className="mt-3 ms-2" onClick={() => navigate('/system/branch')}>Hủy</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
}

export default BranchAdd
