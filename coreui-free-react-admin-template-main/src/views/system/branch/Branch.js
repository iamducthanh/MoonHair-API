import React from 'react'
import { useEffect, useState } from 'react';
import branchApi from '../../../api/branchApi';
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
    CButton, CModal, CModalBody, CModalFooter
} from '@coreui/react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Branch = () => {
    const [branches, setBranches] = useState([]);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const response = await branchApi.getAllBranches();
            setBranches(response.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await branchApi.updateBranch(selectedBranch.id, { ...selectedBranch, active: false });
            setBranches(branches.map(b => b.id === selectedBranch.id ? { ...b, active: false } : b));
            toast.success('Chi nhánh đã bị vô hiệu hóa!');
            fetchBranches();
            setVisible(false);
        } catch (error) {
            toast.error('Lỗi khi xóa chi nhánh!');
        }
    };

    const handleRestore = async (branch) => {
        try {
            await branchApi.updateBranch(branch.id, { ...branch, active: true });
            setBranches(branches.map(b => b.id === branch.id ? { ...b, active: true } : b));
            toast.success('Chi nhánh đã được khôi phục!');
        } catch (error) {
            toast.error('Lỗi khi khôi phục chi nhánh!');
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard >
                    <CCardBody>
                        <CTable striped>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">STT</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Tên</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Địa chỉ</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">
                                        <CButton style={{ marginRight: '10px' }}
                                            color='success'
                                            variant="outline" onClick={() => navigate('/system/branch/add')}
                                        >
                                            + Thêm chi nhánh
                                        </CButton>
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {branches.map((branch, index) => (
                                    <CTableRow key={branch.id}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{branch.name}</CTableDataCell>
                                        <CTableDataCell>{branch.address}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton style={{ marginRight: '10px' }}
                                                color='info'
                                                variant="outline"
                                                onClick={() => navigate('/system/branch/' + branch.id)}
                                            > Sửa </CButton>
                                            {branch.active ? (
                                                <CButton color="danger" variant="outline" className="ms-2" onClick={() => { setSelectedBranch(branch); setVisible(true); }}>
                                                    Xóa
                                                </CButton>
                                            ) : (
                                                <CButton color="success" variant="outline" className="ms-2" onClick={() => handleRestore(branch)}>
                                                    Khôi phục
                                                </CButton>
                                            )}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
            {/* Popup xác nhận xóa */}
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalBody>Bạn có chắc chắn muốn vô hiệu hóa chi nhánh này?</CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={handleDelete}>Xác nhận</CButton>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Hủy</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    )
}

export default Branch
