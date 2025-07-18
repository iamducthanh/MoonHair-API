import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilCalculator,
  cilChartPie,
  cilDescription,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const getNav = (perms = []) => {
  const hasPerm = (perm) => perms.includes(perm)

  return [
    {
      component: CNavItem,
      name: 'Trang chủ',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    hasPerm('PERM_ADMIN') && {
      component: CNavGroup,
      name: 'Quản trị hệ thống',
      to: '/system',
      icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Quản lý chi nhánh',
          to: '/system/branch',
        },
        {
          component: CNavItem,
          name: 'Quản lý nhân viên',
          to: '/system/employee',
        },
      ],
    },
    hasPerm('PERM_ADMIN') && {
      component: CNavGroup,
      name: 'Sản phẩm',
      to: '/product',
      icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Thiết lập sản phẩm',
          to: '/product/setting',
        },
        {
          component: CNavItem,
          name: 'Danh sách sản phẩm',
          to: '/product/list',
        },
      ],
    },
    {
      component: CNavGroup,
      name: 'Giao dịch',
      to: '/transaction',
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
      items: [
        ...(
          hasPerm('PERM_ADMIN')
            ? [{
                component: CNavItem,
                name: 'Nhập hàng',
                to: '/transaction/purchaseOrder',
              }]
            : []
        ),
        {
          component: CNavItem,
          name: 'Bán hàng',
          to: '/transaction/sell',
        },
      ],
    },
  
    {
      component: CNavGroup,
      name: 'Báo cáo',
      to: '/transaction',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
      items: [
        {
          component: CNavItem,
          name: 'Sổ',
          to: '/transaction/accountingBooks',
        },
        ...(
          hasPerm('PERM_ADMIN')
            ? [        {
              component: CNavItem,
              name: 'Lương nhân viên',
              to: '/salary',
            },]
            : []
        ),
      ],
    },
  ].filter(Boolean) // Xoá các mục "false" nếu không có quyền
}

export default getNav
