import axios from 'axios';
import { saveAs } from 'file-saver';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import '../css/Dashboard.css';

const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [startDate, setStartDate] = useState(getYesterdayDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [vendorId, setVendorId] = useState("");

    useEffect(() => {
        const storedDataVendor = localStorage.getItem("dataVendor");
        if (storedDataVendor) {
            const vendor = JSON.parse(storedDataVendor);
            setVendorId(vendor.id); 
        } else {
            toast.error("Vui lòng đăng nhập lại");
        }
    }, []);

    const fetchTotalRevenue = useCallback(async (vendorId, startDate, endDate) => {
        if (!vendorId || !startDate || !endDate) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/api/total-revenue`,
                {
                    params: { vendorId, startDate, endDate },
                }
            );

            if (response.data && response.data.totalRevenue !== undefined) {
                setTotalRevenue(response.data.totalRevenue);
            }
        } catch (error) {
            console.error("Error fetching total revenue:", error);
        }
    }, []);

    useEffect(() => {
        if (vendorId) {
            fetchTotalRevenue(vendorId, startDate, endDate);
        }
    }, [startDate, endDate, vendorId, fetchTotalRevenue]);

    const exportToExcel = () => {
        const data = [
            { "Ngày bắt đầu": startDate, "Ngày kết thúc": endDate, "Doanh thu tổng (VND)": totalRevenue },
        ];

        // Tạo worksheet từ dữ liệu
        const ws = XLSX.utils.json_to_sheet(data);

        // Tạo workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");

        // Lưu tệp Excel
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { bookType: "xlsx", type: "application/octet-stream" });
        saveAs(file, "doanh_thu.xlsx");
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Dashboard Doanh Thu</h2>
            <div className="dashboard-content">
                <div className="revenue-info">
                    <h3>Doanh thu tổng: <span className="revenue-amount">{totalRevenue} VND</span></h3>
                </div>

                <div className="date-filter">
                    <label htmlFor="start-date">Ngày bắt đầu:</label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <label htmlFor="end-date">Ngày kết thúc:</label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button className="apply-button" onClick={() => fetchTotalRevenue(vendorId, startDate, endDate)}>
                        Áp dụng
                    </button>
                    <button className="export-button" onClick={exportToExcel}>
                        Xuất Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();
    return `${yyyy}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;
};

const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm = yesterday.getMonth() + 1;
    const dd = yesterday.getDate();
    return `${yyyy}-${mm < 10 ? '0' + mm : mm}-${dd < 10 ? '0' + dd : dd}`;
};

export default Dashboard;
