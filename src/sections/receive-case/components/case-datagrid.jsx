/* eslint-disable import/no-extraneous-dependencies */
import * as XLSX from 'xlsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';
import { Icon } from '@iconify/react';
import React, { useRef, useState, useEffect } from 'react';

import { DataGrid, GridToolbar, GridPagination, GridFooterContainer } from '@mui/x-data-grid';
import {
  Box,
  Grid,
  Chip,
  Button,
  Switch,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';
import { formatDateTime } from 'src/utils/dateUtils';
// eslint-disable-next-line perfectionist/sort-imports

import axios from 'axios';
import Swal from 'sweetalert2';

import { CONFIG } from 'src/config-global';

import TakeacitonModal from './takeaction-modal';
import EditactionModal from './editaction-modal';
import AddCaseModal from './FunctionAddCase/add-case-modal';

const CaseDataGrid = ({
  Case,
  CaseLoading,
  CaseError,
  mainCase,
  subCaseData,
  branchs,
  levelUrgencies,
  teams,
  employees,
  status,
  handleRefresh,
  handleCloseModal,
}) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openTakeAction, setOpenTakeAction] = useState(false);
  const [openEditactionModal, setOpenEditactionModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const mainCases = mainCase;
  const subcasedata = subCaseData;

  const levelurgent = levelUrgencies;
  const employee = employees;

  const team = teams;
  const files = [];

  const [isDense, setIsDense] = useState(false);

  const handleDenseToggle = () => {
    setIsDense((prev) => !prev);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const CustomFooter = () => (
    <GridFooterContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #dee2e6',
      }}
    >
      {/* Dense Toggle Section */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          Dense
        </Typography>
        <Switch
          checked={isDense}
          onChange={handleDenseToggle}
          inputProps={{ 'aria-label': 'Dense mode toggle' }}
        />
      </Box>

      {/* Default Pagination */}
      <GridPagination />
    </GridFooterContainer>
  );

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFormData((prev) => {
      const currentFiles = prev.files || [];
      const totalFiles = currentFiles.length + uploadedFiles.length;
      if (totalFiles > 3) {
        alert(`${'You can upload a maximum of 3 files.'}`);
        return prev;
      }
      return {
        ...prev,
        files: [...currentFiles, ...uploadedFiles],
      };
    });
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const baseURL = CONFIG.site.serverUrl;

  // AddCase ---------------------------------------------------------------------------------------------------------------------------------------------------

  const [formData, setFormData] = useState({
    receive_case_id: '',
    create_date: new Date().toISOString(),
    branch_id: null,
    sub_case_id: [],
    urgent_level_id: null,
    employee_id: null,
    team_id: null,
    main_case_id: null,
    problem: '',
    details: '',
    status_id: 1,
    img_id: [],
    saev_em: '',
    correct: '',
    start_date: null,
    end_date: null,
    files: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputEditChange = (event) => {
    const { name, value } = event.target;
    setFormDataUpdateEdit((prevState) => ({
      ...prevState,
      [name]: value, // อัปเดตค่าที่ถูกป้อน
    }));
  };

  const resetData = () => {
    setFormData({
      receive_case_id: '',
      create_date: new Date().toISOString(),
      branch_id: null,
      sub_case_id: [],
      urgent_level_id: null,
      employee_id: null,
      team_id: null,
      main_case_id: null,
      problem: '',
      details: '',
      status_id: 1,
      img_id: [],
      saev_em: '',
      correct: '',
      start_date: null,
      end_date: null,
      files: [],
    });
  };

  const handlePostData = async () => {
    const requiredFields = [
      { key: 'branch_id', label: 'สาขา' },
      { key: 'sub_case_id', label: 'สาเหตุย่อย' },
      { key: 'urgent_level_id', label: 'ระดับความเร่งด่วน' },
      { key: 'employee_id', label: 'พนักงาน' },
      { key: 'team_id', label: 'ทีม' },
      { key: 'main_case_id', label: 'เคสหลัก' },
      { key: 'problem', label: 'ปัญหา' },
      { key: 'details', label: 'รายละเอียด' },
      { key: 'create_date', label: 'วันที่รับ case' },
    ];

    const missingFields = requiredFields.filter((field) => !formData[field.key]);

    if (missingFields.length > 0) {
      alert(`กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.map((field) => field.label).join(', ')}`);
      return;
    }

    const numericSubCaseIds = formData.sub_case_id.map((id) => parseInt(id, 10));

    const dataToSend = {
      main_case_id: formData.main_case_id,
      branch_id: formData.branch_id,
      urgent_level_id: formData.urgent_level_id,
      status_id: '1',
      create_date: formData.create_date || new Date().toISOString(),
      problem: formData.problem,
      team_id: formData.team_id,
      employee_id: formData.employee_id,
      correct: formData.correct || '',
      details: formData.details,
      sub_case_ids: numericSubCaseIds,
    };

    try {
      const response = await axiosInstance.post(
        `${baseURL}/receivecase/insert`,
        JSON.stringify(dataToSend),
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (response.status === 200) {
        handleRefresh();

        Swal.fire({
          title: 'สำเร็จ!',
          text: 'บันทึกข้อมูลสำเร็จ!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          handleRefresh();
        });
      } else {
        handleRefresh();
        console.log(response);
        alert(`ไม่สามารถบันทึกข้อมูลได้: ${response.data.message || 'ไม่ทราบสาเหตุ'}`);
      }
    } catch (error) {
      console.error('Error posting data:', error);
      handleRefresh();
      if (error.response) {
        console.log(error);
        alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.message}`);
      } else if (error.request) {
        alert('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
      } else {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------------

  const [unreadableData, setUnreadbleData] = useState({})

  const handleOpenModal = (row) => {
    console.log('Row: ', row);
    setFormDataUpdate({ ...row });
    setUnreadbleData(row)
    setOpenTakeAction(true);
  };

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const [formDataUpdate, setFormDataUpdate] = useState({
    receive_case_id: '',
    status_id: '',
    saev_em: '',
    correct: '',
    start_date: null,
    end_date: null,
  });

  // ฟังชั่น อัพเดท ข้อมูล เข้าดำเนินการ

  const handleInputChangeUpdate = (event) => {
    const { name, value } = event.target;

    if (name === 'status') {
      console.log('Status :', status);
      console.log('Value : ', value);

      // ตรวจสอบสถานะที่เลือก
      const selectedStatus = status.find((statusItem) => statusItem.statusName === value);
      console.log('Selected Status:', selectedStatus);

      if (selectedStatus?.statusId === 3) {
        // ถ้าเลือกสถานะ 'ดำเนินการเสร็จสิ้น' (statusId === 3)
        setFormDataUpdate((prevState) => ({
          ...prevState,
          status: selectedStatus.statusName,
          statusId: selectedStatus.statusId,
          end_date: new Date().toISOString(), // กำหนด end_date ตอนที่เลือกสถานะเสร็จสิ้น
        }));
      } else {
        // ถ้าเลือกสถานะอื่น (1 หรือ 2)
        setFormDataUpdate((prevState) => ({
          ...prevState,
          status: selectedStatus?.statusName || value,
          statusId: selectedStatus?.statusId || null,
          end_date: null, // ล้าง end_date หากไม่ใช่สถานะเสร็จสิ้น
        }));
      }
    } else if (name === 'saev_em') {
      // จัดการกรณีเลือกพนักงานจาก dropdown
      const selectedEmployee = employee.find((emp) => emp.employee_id === value);

      if (selectedEmployee) {
        setFormDataUpdate((prevState) => ({
          ...prevState,
          [name]: selectedEmployee.employee_id,
        }));
      }
    } else {
      // อัพเดตข้อมูลในกรณีอื่น ๆ
      setFormDataUpdate((prev) => ({
        ...prev,
        [name]: value,
      }));
      console.log(formDataUpdate?.status_id); // ตรวจสอบค่า
    }
  };

  // ปุ่มบันทึก การเข้าดำเนินการ ----------------------------------------------------------------------------------------------------------------------------------------

  const handleUpdateClick = async () => {
    try {
      const { receiveCaseId, status_id, saev_em, correct, start_date } = formDataUpdate;
      console.log('saev_em value:', saev_em);
      if (saev_em === '-' || !saev_em) {
        alert('กรุณาเลือกพนักงาน');
        return;
      }

      // ตรวจสอบให้แน่ใจว่า saev_em มีค่าก่อน
      if (
        !receiveCaseId ||
        status_id === '' ||
        status_id === null ||
        !saev_em ||
        !correct ||
        !start_date
      ) {
        alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        return;
      }

      const isCompleted = String(status_id) === '3';
      const end_date = isCompleted ? new Date().toISOString() : '';

      const data = {
        receiveCaseId,
        status_id,
        saev_em,
        correct,
        start_date,
        ...(isCompleted && { end_date }),
      };

      console.log('Data being sent to server:', JSON.stringify(data, null));

      const response = await fetch(`${baseURL}/receivecase/updatecase/${receiveCaseId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`ไม่สามารถบันทึกข้อมูลได้: ${errorData.error}`);
        return;
      }

      const result = await response.json();
      console.log('Server response:', result);

      setHasSubmitted(true);
      alert(result.success || 'อัปเดตข้อมูลสำเร็จ');
      handleRefresh();
      setDialogMessage(result.success || 'อัปเดตข้อมูลสำเร็จ');
      setOpenTakeAction(false);
    } catch (error) {
      console.error('Error in saving data:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  //-------------------------------------------------------------------------------------------------------------------------------

  const [combinedSubCaseNames, setCombinedSubCaseNames] = useState('');

  const [formDataUpdateEdit, setFormDataUpdateEdit] = useState({
    receive_case_id: '',
    caseDate: '',
    correct: '',
    status_id: '',
    problem: '',
    details: '',
    selectedMainCase: '',
    selectedcombinedSubCaseNames: '',
    selectedLevelUrgent: '',
    selectedEmployee: '',
    selectedTeam: '',
    selectedBranch: '',
    create_date: '',
    files: [],
    employee_id: '',
    save_em: '2',
  });

  const handleSave = async () => {
    try {
      console.log('formDataUpdateEdit:', formDataUpdateEdit);

      if (!formDataUpdateEdit) {
        alert('ไม่พบข้อมูลฟอร์ม');
        return;
      }

      // ✅ ใช้ receiveCaseId เพื่อให้ตรงกับ API
      // eslint-disable-next-line prefer-destructuring
      const receiveCaseId = formDataUpdateEdit.receiveCaseId;
      const updatedDetails = formDataUpdateEdit.details;

      if (!receiveCaseId) {
        alert('ไม่พบรหัสเคส (receiveCaseId)');
        return;
      }
      if (!updatedDetails) {
        alert('กรุณากรอกรายละเอียด');
        return;
      }

      console.log('กำลังส่งข้อมูลไปยัง API:', { receiveCaseId, details: updatedDetails });

      const response = await fetch(
        `${baseURL}/receivecase/updateEitd-receivecase/${receiveCaseId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: receiveCaseId,
            details: updatedDetails,
          }),
        }
      );

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating case:', errorData);
        alert('ไม่สามารถบันทึกข้อมูลได้');
        return;
      }

      const updatedCase = await response.json();
      console.log('Updated case:', updatedCase);

      handleClose();
      handleRefresh();
      setOpenEditactionModal(false);
      alert('ข้อมูลถูกบันทึกแล้ว');
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleClose = () => {
    setFormDataUpdateEdit({});
  };

  const handleOpenEditCaseModal = (row) => {
    console.log('Selected Case Data:', row); // ตรวจสอบข้อมูลที่ได้รับ
    setFormDataUpdateEdit({ ...row });
    setOpenEditactionModal(true);
  };

  const handleEditCaseClick = async (caseItem) => {
    try {
      // เรียกข้อมูล sub_case_names ที่ตรงกับ receive_case_id
      const response = await axios.get(`${baseURL}/receive-case`);
      // let combinedSubCaseNames = '';

      if (response.status === 200) {
        const selectedCase = response.data.body.find(
          (item) => item.receive_case_id === caseItem.receive_case_id
        );
        if (selectedCase) {
          // combinedSubCaseNames = selectedCase.combined_sub_case_names || '';
        }
      }

      // ตั้งค่า formDataUpdateEdit ด้วยข้อมูลที่มีอยู่
      setFormDataUpdateEdit({
        receive_case_id: caseItem.receive_case_id || '',
        caseDate: caseItem.caseDate || '', // ดึงจาก caseItem ถ้ามี
        correct: caseItem.correct || '', // ดึงจาก caseItem ถ้ามี
        status_id: caseItem.status_id || '', // ดึงจาก caseItem ถ้ามี
        problem: caseItem.problem || '',
        details: caseItem.details || '',
        selectedMainCase: caseItem.main_case_name || '',
        selectedcombinedSubCaseNames: combinedSubCaseNames, // ใช้ค่าที่ได้จาก API
        selectedLevelUrgent: caseItem.level_urgent_name || '',
        selectedEmployee: caseItem.employee_name || '',
        selectedTeam: caseItem.team_name || '',
        selectedBranch: caseItem.branch_name || '',
        create_date: caseItem.create_date || '',
        files: caseItem.files || [],
        employee_id: caseItem.employee_id || '', // สามารถกำหนดค่าให้เปลี่ยนได้
        save_em: '2', // ค่าคงที่
      });
    } catch (error) {
      console.error('Failed to fetch sub case names or set form data:', error);
    }
  };

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    mainCaseId: '',
    search: '',
  });

  // eslint-disable-next-line no-shadow
  const exportToExcelUTF8 = (rows, columns) => {
    const data = rows.map((row) => {
      const rowData = {};
      columns.forEach((column) => {
        rowData[column.headerName] = row[column.field] || '';
      });
      return rowData;
    });

    // สร้าง Worksheet และ Workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Define header styles
    const headerStyle = {
      fill: { fgColor: { rgb: 'FFFF00' } }, // Yellow background
      font: { bold: true, color: { rgb: '000000' } }, // Black text
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    // Define column data styles
    const columnStyle = {
      fill: { fgColor: { rgb: 'D3D3D3' } }, // Light gray background
      font: { color: { rgb: '000000' } }, // Black text
    };

    const range = XLSX.utils.decode_range(worksheet['!ref']);

    for (let col = range.s.c; col <= range.e.c; col += 1) {
      const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
      if (!worksheet[cellRef]) worksheet[cellRef] = {};
      worksheet[cellRef].s = headerStyle;
    }

    // Apply styles to data rows
    for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellRef]) worksheet[cellRef] = {};
        worksheet[cellRef].s = columnStyle;
      }
    }

    // เขียนไฟล์ Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'Report Data Case.xlsx');
  };

  //----------------------------------------------------------------------------------------------

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
  const columns = [
    {
      field: 'actions',
      headerName: 'จัดการข้อมูล',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: '4px',
            justifyContent: 'center',
            gap: isDense ? 0.5 : 2, // Reduce the gap in Dense Mode
          }}
        >
          {/* ปุ่มสีเขียว */}
          <Button
            variant="contained"
            size={isDense ? 'small' : 'medium'} // ขนาดเล็กลงใน Dense Mode
            sx={{
              backgroundColor: '#2cff43',
              color: 'black',
              padding: isDense ? '4px 8px' : '4px 8px', // Reduce padding in Dense Mode
              fontSize: isDense ? '0.75rem' : '1rem', // Adjust font size
              '&:hover': {
                backgroundColor: '#00be00'
              },
            }}
            onClick={() => {
              handleOpenModal(params.row);
              console.log(params.row);
            }}
          >
            <Icon
              icon="akar-icons:person-add"
              width={isDense ? 16 : 24}
              height={isDense ? 16 : 24}
            />
          </Button>

          {/* ปุ่มสีเหลือง */}
          <Button
            variant="contained"
            size={isDense ? 'small' : 'medium'}
            sx={{
              backgroundColor: '#1976D2',
              color: 'white',
              padding: isDense ? '4px 4px' : '6px 8px',
              fontSize: isDense ? '0.75rem' : 'rem',
              '&:hover': {
                backgroundColor: '#1976D2',
              },
            }}
            onClick={() => {
              console.log('Selected Case Data:', params.row);
              handleOpenEditCaseModal(params.row);
            }}
          >
            <Icon
              icon="mdi:information-outline"
              width={isDense ? 16 : 24}
              height={isDense ? 16 : 24}
            />{' '}
          </Button>
        </Box>
      ),
    },

    {
      field: 'receiveCaseId',
      headerName: 'No.',
      width: 70,
      // headerAlign: 'center',
      // align: 'center',
    },
    {
      field: 'branch_name',
      headerName: 'สาขา',
      width: 150,
      // headerAlign: 'center',
      // align: 'center',
    },
    {
      field: 'status_name',
      headerName: 'สถานะ Case',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const color = getStatusnameColor(params.value);
        return (
          <Chip
            label={params.value}
            style={{
              backgroundColor: color,
              color: '#fff',
            }}
            size="small"
          />
        );
      },
    },
    { field: 'team_name', headerName: 'ทีม', width: 200, headerAlign: 'center', align: 'center' },

    {
      field: 'level_urgent_name',
      headerName: 'ความเร่งด่วน',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const color = getUrgentLevelColor(params.value); // ฟังก์ชันกำหนดสี
        return (
          <Chip
            label={params.value}
            style={{
              backgroundColor: color,
              color: '#fff', // สีข้อความให้ตรงกับความคมชัด
            }}
            size="small"
          />
        );
      },
    },
    {
      field: 'employee_name',
      headerName: 'ผู้แจ้ง Case',
      width: 200,
      // headerAlign: 'center',
      // align: 'center',
    },
    {
      field: 'saev_em',
      headerName: 'พนักงานเข้าดำเนินการ',
      width: 200,
      renderCell: (params) => {
        if (!Array.isArray(employees) || employees.length === 0) {
          return 'ยังไม่มีผู้เข้าดำเนินการ';
        }
        const empId = params.row?.saev_em?.toString().trim();
        // eslint-disable-next-line no-shadow
        const employee = employees.find((emp) => String(emp.employeeId).trim() === empId);
        return employee ? employee.employeeName : 'ยังไม่มีผู้เข้าดำเนินการ';
      },
    },

    {
      field: 'main_case_name',
      headerName: 'สาเหตุหลัก',
      width: 200,
      // headerAlign: 'center',
      // align: 'center',
    },
    {
      field: 'combined_sub_case_names',
      headerName: 'สาเหตุย่อย',
      width: 200,
      // headerAlign: 'center',
      // align: 'center',
    },
    { field: 'problem', headerName: 'ปัญหา', width: 200, headerAlign: 'center', align: 'center' },
    {
      field: 'details',
      headerName: 'รายละเอียด',
      width: 200,
    },
    {
      field: 'correct',
      headerName: 'วิธีแก้ไข',
      width: 200,
      // headerAlign: 'center',
      // align: 'center',
      renderCell: (params) => {
        const correctValue = params.row?.correct;

        if (!correctValue) {
          return 'ยังไม่มีการเเก้ไขปัญหา';
        }

        return correctValue;
      },
    },

    {
      field: 'create_date',
      headerName: 'วันที่รับแจ้ง',
      width: 200,
      renderCell: (params) => params.row?.create_date || 'ยังไม่มีข้อมูล',
    },

    {
      field: 'start_date',
      headerName: 'วันที่ดำเนินการ',
      width: 200,
      renderCell: (params) => params.row?.start_date || 'ยังไม่มีข้อมูล',
    },

    {
      field: 'end_date',
      headerName: 'วันที่ดำเนินการสำเร็จ',
      width: 200,
      renderCell: (params) => params.row?.end_date || 'ยังไม่มีข้อมูล',
    },
  ];

  // ส่วนที่โหลดข้อมูล DataGrid ---------------------------------------------------------------------------------------------------------------------------------------

  const overdueCases = useRef(new Set()); // ใช้เพื่อบันทึกเคสที่เคยเกิน 30 นาทีแล้ว

  const checkIfOverdue = (rowId, createDate, startDate, statusName) => {
    if (!createDate) return false; // ถ้าไม่มี createDate ก็ไม่ต้องทำอะไร

    const createdTime = new Date(createDate).getTime();
    const now = Date.now();
    const thirtyMinutesInMs = 30 * 60 * 1000;

    // ถ้าเคสยังค้างอยู่และเวลาผ่านไปมากกว่า 30 นาที และยังไม่มี startDate
    if (statusName === 'รอดำเนินการ' && !startDate) {
      if (now - createdTime > thirtyMinutesInMs) {
        overdueCases.current.add(rowId); // บันทึกเคสใน Set ถ้าเกิน 30 นาที
      }
    }

    // ถ้า startDate มีและระยะเวลาจาก createDate ถึง startDate เกิน 30 นาที
    if (startDate && new Date(startDate).getTime() - createdTime > thirtyMinutesInMs) {
      overdueCases.current.add(rowId); // เคสที่เกิน 30 นาทีตั้งแต่ startDate ก็ต้องบันทึก
    }

    // คืนค่า true ถ้าเคสเคยเกิน 30 นาทีในอดีตและถูกบันทึกใน Set
    return overdueCases.current.has(rowId);
  };
  useEffect(() => {
    if (!Case || !Array.isArray(Case.result)) {
      console.warn('Case data is missing or not an array, setting default value.');
      const defaultData = [
        {
          id: 0,
          receiveCaseId: '0',
          problem: 'No Data',
          branch_name: '-',
          status_name: '-',
          team_name: '-',
          level_urgent_name: '-',
          employee_name: '-',
          saev_em: '-',
          main_case_name: '-',
          combined_sub_case_names: '-',
          correct: '-',
          details: '-',
          create_date: '-',
          start_date: '-',
          end_date: '-',
        },
      ];
      setRows(defaultData);
      setFilteredRows(defaultData);
      return;
    }

    const caseData = Case.result;
    if (caseData.length === 0) {
      console.warn('No case data available, using default.');
      setRows([]);
      setFilteredRows([]);
      return;
    }

    try {
      const debugMode = false;
      const today = new Date().toISOString().split('T')[0];
      const formattedData = caseData.map((item, index) => {
        if (
          debugMode &&
          (index < 5 ||
            item.createDate?.includes(today) ||
            item.startDate?.includes(today) ||
            item.endDate?.includes(today))
        ) {
          console.log(`Case ${index + 1}:`, {
            createDate: item.createDate,
            startDate: item.startDate,
            endDate: item.endDate,
          });
        }
        return {
          id: index + 1,
          receiveCaseId: item.receiveCaseId || '-',
          problem: item.problem || '-',
          branch_name: item.branch?.branchName || '-',
          status_name: item.status?.statusName || '-',
          team_name: item.team?.teamName || '-',
          level_urgent_name: item.urgentLevel?.levelUrgentName || '-',
          employee_name: item.employee?.employeeName || '-',
          saev_em: item.saevEm || '-',
          main_case_name: item.mainCase?.mainCaseName || '-',
          combined_sub_case_names: item.subcases
            ? item.subcases.map((sub) => sub.subCase?.subCaseName).join(', ') || '-'
            : '-',
          correct: item.correct || '',
          details: item.details || '-',
          create_date: item.createDate ? formatDateTime(item.createDate) : '-',
          start_date: item.startDate ? formatDateTime(item.startDate) : 'ยังไม่มีข้อมูล',
          end_date: item.endDate ? formatDateTime(item.endDate) : 'ยังไม่มีข้อมูล',
        };
      });
      if (debugMode) {
        const totalCasesWithDates = caseData.filter(
          (item) => item.createDate || item.startDate || item.endDate
        ).length;
        console.log(`Total Cases with Dates: ${totalCasesWithDates}`);
      }

      setRows(formattedData);
      setFilteredRows(formattedData);
    } catch (error) {
      console.error('Error formatting Case data:', error);
    }
  }, [Case]);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters กรองข้อมูล--------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    const { startDate, endDate, mainCaseId, search } = filters;

    const filtered = rows?.filter((row) => {
      // Filter by date range
      if (startDate && new Date(row.create_date) < new Date(startDate)) return false;
      if (endDate && new Date(row.create_date) > new Date(endDate)) return false;

      if (mainCaseId && row.main_case_name !== mainCaseId) return false;

      if (
        search &&
        !Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(search.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });

    setFilteredRows(filtered);
  }, [filters, rows]);

  return (
    <Box height="100vh" p={3}>
      <Typography variant="h5" mb={3}>
        Report
      </Typography>
      {/* Filter Controls */}
      <Grid container spacing={2} mb={3} alignItems="center">
        {/* Start Date */}
        <Grid item xs={12} md={2}>
          <TextField
            type="date"
            label="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} md={2}>
          <TextField
            type="date"
            label="End Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        {/* Main Case Dropdown */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            label="ข้อมูล MainCase"
            name="mainCaseId"
            value={filters.mainCaseId || ''}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            {mainCases?.map((uniqueItem) => (
              <MenuItem key={uniqueItem.mainCaseId} value={uniqueItem.mainCaseName}>
                {uniqueItem.mainCaseName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Search Case */}
        <Grid item xs={12} md={2}>
          <TextField
            placeholder="Search Case"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="uil:search" width="24" height="24" />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>

        {/* Add Case Button */}
        <Grid item xs={12} md={1.5}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => setOpenModal(true)}
            fullWidth
            style={{
              height: '50px',
              borderRadius: '8px',
              backgroundColor: '#00d300',
              textTransform: 'none',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              icon="icon-park-outline:add-one"
              width="24"
              height="24"
              style={{ marginRight: '8px' }}
            />
            Add Case
          </Button>
        </Grid>

        {/* Export to Excel Button */}
        <Grid item xs={12} md={1.5}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToExcelUTF8(rows, columns)}
            fullWidth
            style={{
              backgroundColor: '#2196F3',
              color: '#fff',
              textTransform: 'none',
              height: '50px',
              borderRadius: '8px', // Rounded corners
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
              fontWeight: '600', // Make text bolder
            }}
          >
            <Icon
              icon="dashicons:database-export"
              width="24"
              height="24"
              style={{ marginRight: '8px' }}
            />
            Export
          </Button>
        </Grid>
      </Grid>
      {/* DataGrid */}
      <Box
        sx={{
          height: 'calc(100vh - 100px)', // ความสูงยืดหยุ่น
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <DataGrid
          rows={filteredRows || []}
          columns={columns || []}
          pagination
          disableRowSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          columnReorder
          slots={{
            toolbar: GridToolbar,
            footer: CustomFooter, // ใช้ Custom Footer
          }}
          rowHeight={isDense ? 36 : 52} // เปลี่ยนความสูงของแถว
          headerHeight={isDense ? 40 : 56} // เปลี่ยนความสูงของส่วนหัว
          getRowClassName={(params) =>
            checkIfOverdue(
              params.row?.id,
              params.row?.create_date,
              params.row?.start_date,
              params.row?.status_name
            )
              ? 'row-overdue'
              : ''
          }
          initialState={{
            columns: {
              columnVisibilityModel: {},
              orderedFields: columns.map((col) => col.field),
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              color: '#495057',
              fontWeight: 'bold',
              borderBottom: '1px solid #dee2e6',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f1f3f5',
            },
            '& .MuiDataGrid-row': {
              backgroundColor: '#fff',
              height: isDense ? '36px' : '52px',
              '&:hover': {
                backgroundColor: '#f8f9fa',
              },
            },
            '& .row-overdue': {
              backgroundColor: 'rgba(255, 0, 0, 0.1)', // สีแดงอ่อน
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.2)', // สีแดงเข้มเมื่อ hover
              },
            },
          }}
        />
      </Box>
      {/* AddCaseModal */}
      <AddCaseModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        mainCases={mainCases}
        subcasedata={subcasedata}
        levelurgent={levelurgent}
        employee={employee}
        team={team}
        branchs={branchs}
        files={formData.files || []} // ส่งไฟล์จาก formData
        handleInputChange={handleInputChange}
        setFormData={setFormData}
        formData={formData}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        handleRefresh={handleRefresh}
        handlePostData={handlePostData}
        resetData={resetData}
      />

      <TakeacitonModal
        open={openTakeAction}
        handleClose={() => setOpenTakeAction(false)}
        // formData={selectedRow}
        formDataUpdate={{ ...formDataUpdate, ...selectedRow }} // ผสาน formData และ selectedRow
        // formData={formData}
        formDataUpdateEdit={formDataUpdateEdit}
        setFormDataUpdateEdit={setFormDataUpdateEdit}
        handleInputChangeUpdate={handleInputChangeUpdate}
        status={status}
        employees={employees}
        setFormData={setFormData}
        setFormDataUpdate={setFormDataUpdate}
        handleRefresh={handleRefresh}
        selectedCase
        handleUpdeteClick={handleUpdateClick}
        unreadableData={unreadableData}
      />

      <EditactionModal
        open={openEditactionModal}
        handleClose={() => setOpenEditactionModal(false)}
        mainCases={mainCases}
        subcasedata={subcasedata}
        levelurgent={levelurgent}
        employees={employees}
        team={team}
        branchs={branchs}
        files={formData.files || []} // ส่งไฟล์จาก formData
        handleInputChange={handleInputChange}
        handleInputEditChange={handleInputEditChange}
        formDataUpdateEdit={formDataUpdateEdit}
        setFormDataUpdateEdit={setFormDataUpdateEdit}
        setFormData={setFormData}
        formData={formData}
        handleSave={handleSave}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        handlePostData={handlePostData}
        handleEditCaseClick={handleEditCaseClick}
      />
    </Box>
  );
};

export default CaseDataGrid;
