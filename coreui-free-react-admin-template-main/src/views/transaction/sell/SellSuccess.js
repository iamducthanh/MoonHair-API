import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CCard, CCardBody, CCardTitle, CCardText, CButton, CRow, CCol } from '@coreui/react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import sellApi from '../../../api/sellApi';

function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export default function PaymentResultScreen() {
    const query = useQuery()
    const navigate = useNavigate()

    const vnp_Amount = query.get('vnp_Amount')
    const vnp_ResponseCode = query.get('vnp_ResponseCode')
    const vnp_TxnRef = query.get('vnp_TxnRef')
    const vnp_OrderInfo = query.get('vnp_OrderInfo')
    const vnp_PayDate = query.get('vnp_PayDate')

    const isSuccess = vnp_ResponseCode === '00'
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';

    sellApi.paymentResult(queryString)

    const handleBack = () => {
        navigate('/transaction/sell') // hoặc trang bạn muốn về
    }

    return (
        <CRow className="justify-content-center mt-5">
            <CCol md={6}>
                <CCard className="text-center shadow-lg p-4 bg-body rounded">
                    <CCardBody>
                        <CIcon
                            icon={isSuccess ? cilCheckCircle : cilXCircle}
                            size="xxl"
                            className={`mb-3 ${isSuccess ? 'text-success' : 'text-danger'}`}
                        />
                        <CCardTitle className="h3 mb-3">
                            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                        </CCardTitle>
                        <CCardText>
                            <strong>Mã đơn hàng:</strong> {vnp_TxnRef} <br />
                            <strong>Số tiền:</strong> {(parseInt(vnp_Amount) / 100).toLocaleString()} đ <br />
                            <strong>Ghi chú:</strong> {vnp_OrderInfo} <br />
                            <strong>Thời gian:</strong> {formatVnpDate(vnp_PayDate)}
                        </CCardText>
                        <CButton color="primary" onClick={handleBack}>
                            Quay lại
                        </CButton>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

function formatVnpDate(dateString) {
    if (!dateString) return ''
    // Format: yyyyMMddHHmmss => dd/MM/yyyy HH:mm
    const yyyy = dateString.substring(0, 4)
    const MM = dateString.substring(4, 6)
    const dd = dateString.substring(6, 8)
    const hh = dateString.substring(8, 10)
    const mm = dateString.substring(10, 12)
    return `${dd}/${MM}/${yyyy} ${hh}:${mm}`
}
