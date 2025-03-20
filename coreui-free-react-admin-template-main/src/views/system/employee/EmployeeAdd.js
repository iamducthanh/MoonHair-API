import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import employeeApi from '../../../api/employeeApi';
import branchApi from '../../../api/branchApi';
import { CRow, CCol, CCard, CCardBody, CForm, CFormLabel, CFormInput, CFormSelect, CButton } from '@coreui/react';
import { toast } from 'react-toastify';
import Employee from './Employee';

const EmployeeAdd = () => {
    const [employee, setEmployee] = useState({ name: '', salaryRate: '', branchId: '' });
    const [branches, setBranches] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await branchApi.getAllBranches();
                setBranches(response.data);
                if (response.data.length > 0) {
                    setEmployee((prev) => ({ ...prev, branchId: response.data[0].id }));
                }
            } catch (error) {
                toast.error('Lỗi khi tải danh sách chi nhánh!');
            }
        };
        fetchBranches();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let tempErrors = {};
        if (!employee.name.trim()) tempErrors.name = 'Tên nhân viên không được để trống';
        if (!employee.salaryRate.trim()) tempErrors.salaryRate = 'Mức lương không được để trống';
        if (!employee.branchId) tempErrors.branchId = 'Vui lòng chọn chi nhánh';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await employeeApi.createEmployee(employee);
            toast.success('Thêm nhân viên thành công!');
            navigate('/system/employee');
        } catch (error) {
            toast.error('Lỗi khi thêm nhân viên!');
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard>
                    <CCardBody>
                        <h3>Thêm Nhân Viên</h3>
                        <CForm onSubmit={handleSubmit}>
                            <CFormLabel htmlFor="name">Tên Nhân Viên</CFormLabel>
                            <CFormInput type="text" id="name" name="name" value={employee.name} onChange={handleChange} />
                            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

                            <CFormLabel htmlFor="salaryRate">Mức Lương</CFormLabel>
                            <CFormInput type="text" id="salaryRate" name="salaryRate" value={employee.salaryRate} onChange={handleChange} />
                            {errors.salaryRate && <p style={{ color: 'red' }}>{errors.salaryRate}</p>}

                            <CFormLabel htmlFor="branchId">Chi Nhánh</CFormLabel>
                            <CFormSelect id="branchId" name="branchId" value={employee.branchId} onChange={handleChange}>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                ))}
                            </CFormSelect>
                            {errors.branchId && <p style={{ color: 'red' }}>{errors.branchId}</p>}

                            <CButton type="submit" color="success" className="mt-3">Lưu</CButton>
                            <CButton type="button" color="secondary" className="mt-3 ms-2" onClick={() => navigate('/system/employee')}>Hủy</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default EmployeeAdd;