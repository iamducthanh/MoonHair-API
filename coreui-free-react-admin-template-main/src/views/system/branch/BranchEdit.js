import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import branchApi from '../../../api/branchApi';
import { CRow, CCol, CCard, CCardBody, CForm, CFormLabel, CFormInput, CButton } from '@coreui/react';
import { toast } from 'react-toastify';

const BranchEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [branch, setBranch] = useState({ name: '', address: '', active: true });

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await branchApi.getBranchById(id);
                setBranch(response.data);
            } catch (error) {
                toast.error('Lỗi khi tải dữ liệu chi nhánh!');
            }
        };
        fetchBranch();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBranch((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await branchApi.updateBranch(id, branch);
            toast.success('Cập nhật chi nhánh thành công!');
            navigate('/system/branch');
        } catch (error) {
            toast.error('Lỗi khi cập nhật chi nhánh!');
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <h3>Chỉnh Sửa Chi Nhánh</h3>
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
};

export default BranchEdit;