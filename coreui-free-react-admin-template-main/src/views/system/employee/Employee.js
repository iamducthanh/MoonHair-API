import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeApi from '../../../api/employeeApi';
import branchApi from '../../../api/branchApi';
import { CRow, CCol, CCard, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormSelect, CModal, CModalHeader, CModalBody, CModalFooter } from '@coreui/react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await branchApi.getAllBranches();
                setBranches(response.data);
                if (response.data.length > 0) {
                    setSelectedBranch(response.data[0].id);
                }
            } catch (error) {
                toast.error('Lỗi khi tải danh sách chi nhánh!');
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchEmployees();
        }
    }, [selectedBranch]);

    const fetchEmployees = async () => {
        try {
            const response = await employeeApi.getEmployeesByBranch(selectedBranch);
            setEmployees(response.data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách nhân viên!');
        }
    };
    const handleBranchChange = (e) => {        
        setSelectedBranch(e.target.value);
    };

    const handleDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await employeeApi.deleteEmployee(employeeToDelete.id);
            setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
            toast.success('Nhân viên đã bị vô hiệu hóa!');
        } catch (error) {
            toast.error('Lỗi khi vô hiệu hóa nhân viên!');
        }
        setShowDeleteModal(false);
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <CRow className="mb-3">
                            <CCol md={6}>
                                <CFormSelect value={selectedBranch} onChange={handleBranchChange}>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6} className="text-end">
                                <CButton color="primary" onClick={() => navigate('/system/employee/add')}>
                                    Thêm Nhân Viên
                                </CButton>
                            </CCol>
                        </CRow>
                        <CTable striped>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>STT</CTableHeaderCell>
                                    <CTableHeaderCell>Tên</CTableHeaderCell>
                                    <CTableHeaderCell>Mức Lương</CTableHeaderCell>
                                    <CTableHeaderCell>Ngày thêm</CTableHeaderCell>
                                    <CTableHeaderCell>Ngày sửa</CTableHeaderCell>
                                    <CTableHeaderCell>Hành động</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {employees.map((employee, index) => (
                                    <CTableRow key={employee.id}>
                                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                                        <CTableDataCell>{employee.name}</CTableDataCell>
                                        <CTableDataCell>{employee.salaryRate}</CTableDataCell>
                                        <CTableDataCell>{employee.createdDate ? format(new Date(employee.createdDate), 'dd/MM/yyyy') : ''}</CTableDataCell>
                                        <CTableDataCell>{employee.modifiedDate ? format(new Date(employee.modifiedDate), 'dd/MM/yyyy') : ''}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton style={{ marginRight: '10px' }} color="info" variant="outline" onClick={() => navigate(`/system/employee/${employee.id}`)}>
                                                Sửa
                                            </CButton>
                                            <CButton color='danger' variant="outline" onClick={() => { setEmployeeToDelete(employee); setShowDeleteModal(true); }}>Xóa</CButton>

                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>Xác nhận xóa</CModalHeader>
                <CModalBody>Bạn có chắc chắn muốn vô hiệu hóa nhân viên này?</CModalBody>
                <CModalFooter>
                    <CButton color='danger' onClick={handleDelete}>Xác nhận</CButton>
                    <CButton color='secondary' onClick={() => setShowDeleteModal(false)}>Hủy</CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    );
};

export default Employee;
