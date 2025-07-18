import classNames from 'classnames'
import React, { useState, useEffect, useRef } from "react";

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CWidgetStatsA, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem

} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import dashboardApi from '../../api/dashboard';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [dataChart, setDataChart] = useState([]);

    const widgetChartRef1 = useRef(null)
    const widgetChartRef2 = useRef(null)

    useEffect(() => {
        document.documentElement.addEventListener('ColorSchemeChange', () => {
            if (widgetChartRef1.current) {
                setTimeout(() => {
                    widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
                    widgetChartRef1.current.update()
                })
            }

            if (widgetChartRef2.current) {
                setTimeout(() => {
                    widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
                    widgetChartRef2.current.update()
                })
            }
        })
    }, [widgetChartRef1, widgetChartRef2])

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await dashboardApi.getDashboard();
            console.log(dashboardApi.getDashboard())
            console.log(res.data)
            setData(res.data);

            const fullData = Array.from({ length: 12 }, (_, i) => {
                const item = res.data.monthlyRevenues.find(d => d.month === i + 1);
                return {
                    month: `Th${i + 1}`,
                    revenue: item ? item.revenue : 0
                };
            });
            setDataChart(fullData);
        } catch (error) {
            console.error("Lỗi khi fetch dashboard:", error);
        }
    };



    return (
        <>
            <CRow className="" xs={{ gutter: 4 }}>
                <CCol sm={3}>
                    <CWidgetStatsA
                        color="primary"
                        value={
                            <>
                                {data ? data.todayRevenue.toLocaleString('vi-VN') + ' ₫' : 0}
                                <span className="fs-6 fw-normal">
                                    ({data ? data.percentChange : 0}% <CIcon icon={data && data.percentChange < 0 ? cilArrowBottom : cilArrowTop} />)
                                </span>
                            </>
                        }
                        title="Doanh thu hôm nay"
                        chart={
                            <CChartLine
                                ref={widgetChartRef1}
                                className="mt-3 mx-3"
                                style={{ height: '70px' }}
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'My First dataset',
                                            backgroundColor: 'transparent',
                                            borderColor: 'rgba(255,255,255,.55)',
                                            pointBackgroundColor: getStyle('--cui-primary'),
                                            data: [65, 59, 84, 84, 51, 55, 40],
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            border: {
                                                display: false,
                                            },
                                            grid: {
                                                display: false,
                                                drawBorder: false,
                                            },
                                            ticks: {
                                                display: false,
                                            },
                                        },
                                        y: {
                                            min: 30,
                                            max: 89,
                                            display: false,
                                            grid: {
                                                display: false,
                                            },
                                            ticks: {
                                                display: false,
                                            },
                                        },
                                    },
                                    elements: {
                                        line: {
                                            borderWidth: 1,
                                            tension: 0.4,
                                        },
                                        point: {
                                            radius: 4,
                                            hitRadius: 10,
                                            hoverRadius: 4,
                                        },
                                    },
                                }}
                            />
                        }
                    />
                </CCol>
                <CCol sm={3}>
                    <CWidgetStatsA
                        color="info"
                        value={
                            <>
                                {data ? data.totalInvoicesToday + ' ' : 0}
                                <span className="fs-6 fw-normal">
                                    ({data ? data.invoiceCountPercentChange : 0}% <CIcon icon={data && data.invoiceCountPercentChange < 0 ? cilArrowBottom : cilArrowTop} />)
                                </span>
                            </>
                        }
                        title="Đơn trong ngày"
                        chart={
                            <CChartLine
                                ref={widgetChartRef2}
                                className="mt-3 mx-3"
                                style={{ height: '70px' }}
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'My First dataset',
                                            backgroundColor: 'transparent',
                                            borderColor: 'rgba(255,255,255,.55)',
                                            pointBackgroundColor: getStyle('--cui-info'),
                                            data: [1, 18, 9, 17, 34, 22, 11],
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            border: {
                                                display: false,
                                            },
                                            grid: {
                                                display: false,
                                                drawBorder: false,
                                            },
                                            ticks: {
                                                display: false,
                                            },
                                        },
                                        y: {
                                            min: -9,
                                            max: 39,
                                            display: false,
                                            grid: {
                                                display: false,
                                            },
                                            ticks: {
                                                display: false,
                                            },
                                        },
                                    },
                                    elements: {
                                        line: {
                                            borderWidth: 1,
                                        },
                                        point: {
                                            radius: 4,
                                            hitRadius: 10,
                                            hoverRadius: 4,
                                        },
                                    },
                                }}
                            />
                        }
                    />
                </CCol>
                <CCol sm={3}>
                    <CWidgetStatsA
                        color="warning"
                        value={
                            <>
                                {data ? data.doanhThu.toLocaleString('vi-VN') + ' ₫' : 0}
                                <span className="fs-6 fw-normal">
                                    (ngày {data ? data.ngay : ' '})
                                </span>
                            </>
                        }
                        title="Doanh thu cao nhất tháng"
                        chart={
                            <CChartLine
                                className="mt-3"
                                style={{ height: '70px' }}
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'My First dataset',
                                            backgroundColor: 'rgba(255,255,255,.2)',
                                            borderColor: 'rgba(255,255,255,.55)',
                                            data: [78, 81, 80, 45, 34, 12, 40],
                                            fill: true,
                                        },
                                    ],
                                }}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            display: false,
                                        },
                                        y: {
                                            display: false,
                                        },
                                    },
                                    elements: {
                                        line: {
                                            borderWidth: 2,
                                            tension: 0.4,
                                        },
                                        point: {
                                            radius: 0,
                                            hitRadius: 10,
                                            hoverRadius: 4,
                                        },
                                    },
                                }}
                            />
                        }
                    />
                </CCol>

                <CCol sm={3}>
                    <CWidgetStatsA
                        color="danger"
                        value={
                            <>
                                {data ? data.doanhThuHoaChat.toLocaleString('vi-VN') + ' ₫' : 0}
                                <span className="fs-6 fw-normal">
                                </span>
                            </>
                        }
                        title="Doanh thu hóa chất tháng này"
                        chart={
                            <CChartBar
                                className="mt-3 mx-3"
                                style={{ height: '70px' }}
                                data={{
                                    labels: [
                                        'January',
                                        'February',
                                        'March',
                                        'April',
                                        'May',
                                        'June',
                                        'July',
                                        'August',
                                        'September',
                                        'October',
                                        'November',
                                        'December',
                                        'January',
                                        'February',
                                        'March',
                                        'April',
                                    ],
                                    datasets: [
                                        {
                                            label: 'My First dataset',
                                            backgroundColor: 'rgba(255,255,255,.2)',
                                            borderColor: 'rgba(255,255,255,.55)',
                                            data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                                            barPercentage: 0.6,
                                        },
                                    ],
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                display: false,
                                                drawTicks: false,
                                            },
                                            ticks: {
                                                display: false,
                                            },
                                        },
                                        y: {
                                            border: {
                                                display: false,
                                            },
                                            grid: {
                                                display: false,
                                                drawBorder: false,
                                                drawTicks: false,
                                            },
                                            ticks: {
                                                display: false,
                                            },
                                        },
                                    },
                                }}
                            />
                        }
                    />
                </CCol>
            </CRow>

            <div style={{ width: '100%', height: 400, marginBottom: '50px', marginTop: '20px' }}>
                <h5 className="mb-3">Top thợ có doanh thu cao nhất tháng này</h5>
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical"
                        data={data && data.top5nv ?data.top5nv :[]}
                        margin={{ top: 20, right: 30, left: 100, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => value.toLocaleString()} />
                        <YAxis dataKey="tenTho" type="category" />
                        <Tooltip formatter={(value) => value.toLocaleString() + ' đ'} />
                        <Legend />
                        <Bar dataKey="tongDoanhThu" name="Doanh thu" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <CRow>
            <h5 className="mb-3">Bảng thống kê doanh thu tháng này</h5>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={dataChart}
                            width={600}
                            height={300}
                            margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month"

                            />
                            <YAxis
                                tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}

                            />
                            <Tooltip
                                formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`}
                            />
                            <Bar dataKey="revenue" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CRow>
        </>
    )
}

export default Dashboard
