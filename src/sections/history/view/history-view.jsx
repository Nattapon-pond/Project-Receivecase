'use client';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';
import { Bar, XAxis, YAxis, Tooltip, BarChart, ResponsiveContainer } from 'recharts';

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
    '', // index 0 (ไม่ใช้งาน)
    'Jockey', // index 1
    'Oat', // index 2
    'Poogun', // index 3
    'Kai', // index 4
    'Tent', // index 5
    'Pooh', // index 6
    'Nack', // index 7
    'Boy', // index 8
    'Kung', // index 9
    'Pai', // index 10
    'Jiw', // index 11
    'Title', // index 12
    'Aof', // index 13
  ];

  const formatDateTime = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'ข้อมูลผิดพลาด';
    const day = date.getDate().toString().padStart(2, '0'); // เติม 0 ข้างหน้า
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // เดือนเริ่มจาก 0
    const year = (date.getFullYear() + 543).toString().slice(-2); // เปลี่ยนเป็น พ.ศ. และเอาเฉพาะ 2 หลักท้าย
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const exportToExcel = async () => {
    try {
      setLoadingExcel(true);

      // Fetch the first page data
      const firstResponse = await apiService.get('/receivecase/getreceivecase', {
        params: { page: 1, limit: 10 },
      });
      console.log('First response:', firstResponse.data);

      const pageCount = firstResponse.data.totalPages || 1;
      const pageRequests = [];

      // Fetch all pages
      for (let page = 1; page <= pageCount; page += 1) {
        pageRequests.push(
          apiService.get('/receivecase/getreceivecase', { params: { page, limit: 10 } })
        );
      }

      const responses = await Promise.all(pageRequests);
      console.log('All responses:', responses);

      const allCases = responses.flatMap((response) => {
        if (response.data && response.data.result) {
          return response.data.result; // Use 'result' instead of 'cases'
        }
        return []; // If no result, return empty array
      });

      console.log('All cases:', allCases);

      if (allCases.length === 0) {
        alert('ไม่มีข้อมูลให้ส่งออก');
        return;
      }

      // Mapping the cases to the desired format for Excel export
      const excelData = allCases.map((row) => ({
        'ID case.': row.receiveCaseId,
        สาขา: row.branchName || 'ไม่ระบุ', // Ensure branch name is present
        วันที่รับแจ้ง: formatDateTime(row.createDate),
        วันที่เข้าดำเนินการ: formatDateTime(row.startDate),
        วันที่ดำเนินการสำเร็จ: formatDateTime(row.endDate),
        สถานะ: row.statusName || 'ไม่ระบุ', // Ensure status is present
        ความเร่งด่วน: row.levelUrgentName || 'ไม่ระบุ', // Ensure urgency level is present
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

      console.log('Formatted Excel Data:', excelData);

      // Generate Excel
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

  // Handle year change
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setCurrentPage(1); // Reset to the first page whenever the year changes
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Receive Case History
      </Typography>

      {/* Year Selection */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl sx={{ width: '150px' }}>
          <InputLabel>Year</InputLabel>
          <Select value={selectedYear} onChange={handleYearChange}>
            {/* Adjust the years here if needed */}
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

      {/* Chart Display */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Receive Case History by Month</Typography>
        {loading ? (
          <CircularProgress />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#4caf50" />
              <Bar dataKey="pending" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body1">No data available for this year.</Typography>
        )}
      </Card>

      {/* Case Table */}
      <CaseTable cases={cases} totalPages={totalPages} setCurrentPage={setCurrentPage} />

      {/* Pagination */}
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
