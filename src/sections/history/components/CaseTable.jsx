import { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Box, Grid, Chip, TextField } from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { formatDateTime } from '../../../utils/dateUtils';

export default function CaseTable({ cases, totalPages, setCurrentPage }) {
  const [employees, setEmployees] = useState([]);
  const [receiveCases, setReceiveCases] = useState([]); // เก็บข้อมูล receivecase
  const [search, setSearch] = useState('');

  const baseURL = CONFIG.site.serverUrl;

  // ฟังก์ชันดึงข้อมูลพนักงาน
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance(`${baseURL}/Employee/GetEmployeesall`);
        if (response.status !== 200) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = response.data.result;
        setEmployees(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, [baseURL]);

  // ฟังก์ชันดึงข้อมูลเคสที่รับเรื่อง
  useEffect(() => {
    const fetchReceiveCase = async () => {
      try {
        const response = await axiosInstance(`${baseURL}/receivecase/getreceivecase`);
        console.log("🔥 Full API Response:", response.data); // Debug ตรงนี้ก่อน
        
        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = response.data.result; // ดึงข้อมูลจาก response
        
        if (data && Array.isArray(data)) {
          console.log("✅ Processed Data:", data); // ตรวจสอบข้อมูลที่ set เข้า state
          setReceiveCases(data);
        } else {
          console.error("❌ Data format is incorrect:", data);
          setReceiveCases([]); // ตั้งค่าเป็น array ว่างหากรูปแบบผิด
        }
      } catch (error) {
        console.error('❌ Error fetching ReceiveCase:', error);
      }
    };
  
    fetchReceiveCase();
  }, [baseURL]);
  

  // กรองข้อมูลตามการค้นหาจากช่องเดียว
  const filteredReceiveCases = receiveCases.filter((caseItem) => (
    (caseItem.branch?.branchName?.toLowerCase().includes(search.toLowerCase()) ||
    caseItem.employee?.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
    caseItem.urgentLevel?.levelUrgentName?.toLowerCase().includes(search.toLowerCase()) ||
    caseItem.status?.statusName?.toLowerCase().includes(search.toLowerCase()) ||
    formatDateTime(caseItem.createDate)?.toLowerCase().includes(search.toLowerCase()))
  ));

  // ฟังก์ชันกำหนดสีสถานะ
  const getStatusnameColor = (levelName) => {
    switch (levelName) {
      case 'ดำเนินการเสร็จสิ้น':
        return 'green';
      case 'กำลังดำเนินการ':
        return 'orange';
      case 'รอดำเนินการ':
        return 'black';
      default:
        return 'black';
    }
  };

  const getUrgentLevelColor = (levelName) => {
    switch (levelName) {
      case 'เร่งด่วน':
        return 'red';
      case 'ปานกลาง':
        return 'orange';
      case 'ไม่เร่งด่วน':
        return '#76ff03';
      default:
        return 'black';
    }
  };

  const columns = [
    { field: 'receiveCaseId', headerName: 'ไอดีเคส', width: 90 },
    { field: 'branchName', headerName: 'สาขา', width: 150 },
    {
      field: 'createDate',
      headerName: 'วันที่รับแจ้ง',
      width: 200,
      renderCell: (params) => formatDateTime(params.row?.createDate),
    },
    {
      field: 'startDate',
      headerName: 'วันที่ดำเนินการ',
      width: 200,
      renderCell: (params) => formatDateTime(params.row?.startDate),
    },
    {
      field: 'endDate',
      headerName: 'วันที่ดำเนินการสำเร็จ',
      width: 200,
      renderCell: (params) => formatDateTime(params.row?.endDate),
    },
    {
      field: 'duration',
      headerName: 'ระยะเวลาดำเนินการ',
      width: 250,
      renderCell: (params) => {
        const startDate = params.row?.startDate ? new Date(params.row.startDate) : null;
        const endDate = params.row?.endDate ? new Date(params.row.endDate) : null;
    
        // Check if either startDate or endDate is missing or invalid
        // eslint-disable-next-line no-restricted-globals
        if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
          return 'ยังดำเนินการไม่เสร็จ'; // Show "ยังดำเนินการไม่เสร็จ" if data is missing
        }
    
        const timeDiff = endDate - startDate;
        if (timeDiff < 0) {
          return 'ข้อมูลผิดพลาด'; // Handle case where the dates are invalid
        }
    
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
        return `${days} วัน ${hours} ชม. ${minutes} นาที`; // Display the calculated time difference
      },
    },
    {
      field: 'statusName',
      headerName: 'สถานะ',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          style={{
            backgroundColor: getStatusnameColor(params.value),
            color: '#fff',
          }}
          size="small"
        />
      ),
    },
    {
      field: 'levelUrgentName',
      headerName: 'ความเร่งด่วน',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          style={{
            backgroundColor: getUrgentLevelColor(params.value),
            color: '#fff',
          }}
          size="small"
        />
      ),
    },
    { field: 'problem', headerName: 'ปัญหา', width: 150 },
    {
      field: 'saev_em',
      headerName: 'พนักงานเข้าดำเนินการ',
      width: 200,
      renderCell: (params) => {
        const empId = params.row?.saev_em?.toString().trim();
        const employee = employees.find((emp) => String(emp.employeeId).trim() === empId);
        return employee ? employee.employeeName : 'ยังไม่เข้าดำเดินการ';
      },
    },    
    { field: 'correct', headerName: 'แนวทางแก้ไข', width: 200 },
    { field: 'mainCaseName', headerName: 'ประเภทปัญหา', width: 180 },
    { field: 'teamName', headerName: 'ทีมที่รับผิดชอบ', width: 180 },
    { field: 'employeeName', headerName: 'พนักงานที่รับผิดชอบ', width: 200 },
  ];

  return (
    <>
      <Box mb={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ค้นหา"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <DataGrid
       rows={receiveCases?.map((caseItem) => ({
        id: caseItem.receiveCaseId || 'N/A',
        receiveCaseId: caseItem.receiveCaseId || 'N/A',
        branchName: caseItem.branch?.branchName || 'ไม่ระบุ',
        createDate: caseItem.createDate || 'ไม่ระบุ',
        startDate: caseItem.startDate || 'ไม่ระบุ',
        endDate: caseItem.endDate || 'ไม่ระบุ',
        statusName: caseItem.status?.statusName || 'ไม่ระบุ',
        levelUrgentName: caseItem.urgentLevel?.levelUrgentName || 'ไม่ระบุ',
        problem: caseItem.problem || 'ไม่ระบุ',
        saev_em: caseItem.saevEm,
        correct: caseItem.correct || 'ไม่ระบุ',
        mainCaseName: caseItem.mainCase?.mainCaseName || 'ไม่ระบุ',
        teamName: caseItem.team?.teamName || 'ไม่ระบุ',
        employeeName: caseItem.employee?.employeeName || 'ไม่ระบุ',
      })) || []}
      
        columns={columns}
        pageSize={10}
        paginationMode="server"
        rowCount={totalPages * 10}
        getRowId={(row) => row.id}
        onPageChange={(params) => setCurrentPage(params.page + 1)}
      />
    </>
  );
}