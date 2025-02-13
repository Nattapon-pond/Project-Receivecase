'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import {
  Box,
  Card,
  Button,
  Select,
  MenuItem,
  Typography,
  Pagination,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { CONFIG } from 'src/config-global';
import { apiService } from 'src/services/apiService';

import CaseTable from '../components/CaseTable';
import { useCases } from '../../../utils/useCases';

export default function ReceiveCaseHistoryPage() {
  const baseURL = CONFIG.site.serverUrl;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { cases, chartData, loading, totalPages } = useCases(currentPage, selectedYear);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const names = [
    '',
    'Jockey',
    'Oat',
    'Poogun',
    'Kai',
    'Tent',
    'Pooh',
    'Nack',
    'Boy',
    'Kung',
    'Pai',
    'Jiw',
    'Title',
    'Aof',
  ];

  const formatDateTime = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'ข้อมูลผิดพลาด';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() + 543).toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const exportToExcel = async () => {
    try {
      setLoadingExcel(true);

      const firstResponse = await apiService.get('/receivecase/getreceivecase', {
        params: { page: 1, limit: 10 },
      });
      const pageCount = firstResponse.data.totalPages || 1;
      const pageRequests = [];

      for (let page = 1; page <= pageCount; page += 1) {
        pageRequests.push(
          apiService.get('/receivecase/getreceivecase', { params: { page, limit: 10 } })
        );
      }

      const responses = await Promise.all(pageRequests);

      const allCases = responses.flatMap((response) => {
        if (response.data && response.data.result) {
          return response.data.result;
        }
        return [];
      });

      if (allCases.length === 0) {
        alert('ไม่มีข้อมูลให้ส่งออก');
        return;
      }

      const excelData = allCases.map((row) => ({
        'ID case.': row.receiveCaseId,
        สาขา: row.branchName || 'ไม่ระบุ',
        วันที่รับแจ้ง: formatDateTime(row.createDate),
        วันที่เข้าดำเนินการ: formatDateTime(row.startDate),
        วันที่ดำเนินการสำเร็จ: formatDateTime(row.endDate),
        สถานะ: row.statusName || 'ไม่ระบุ',
        ความเร่งด่วน: row.levelUrgentName || 'ไม่ระบุ',
        ปัญหา: row.problem,
        พนักงานเข้าดำเนินการ: names[Number(row.saev_em)] || 'Unknown',
        แนวทางแก้ไข: row.correct,
        สาเหตุหลัก: row.mainCaseName,
        ทีมที่รับผิดชอบ: row.teamName,
        พนักงานที่รับผิดชอบ: row.employeeName,
        ระยะเวลาดำเนินการ:
          row.startDate && row.endDate
            ? `${Math.floor((new Date(row.endDate) - new Date(row.startDate)) / (1000 * 60 * 60 * 24))} วัน`
            : 'ไม่ระบุ',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Receive Case History');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true,
      });
      const data = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      });
      saveAs(data, 'receive_case_history.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    } finally {
      setLoadingExcel(false);
    }
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setCurrentPage(1);
  };

  // Chart data transformation
  const chartOptions = {
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: chartData.map((item) => item.month),
    },
    yaxis: {
      title: {
        text: 'Number of Cases',
      },
    },
    colors: ['#4caf50', '#ff9800'], // สีเขียวสำหรับ completed และสีส้มสำหรับ pending
    series: [
      {
        name: 'Completed',
        data: chartData.map((item) => item.completed),
      },
      {
        name: 'Pending',
        data: chartData.map((item) => item.pending),
      },
    ],
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Receive Case History
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl sx={{ width: '150px' }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange}>
            {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          {loadingExcel ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </Box>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Receive Case History by Month</Typography>
        {loading ? (
          <CircularProgress />
        ) : chartData.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="bar"
            height={300}
          />
        ) : (
          <Typography variant="body1">No data available for this year.</Typography>
        )}
      </Card>

      <CaseTable cases={cases} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
