/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import {
  Box,
  Grid,
  Modal,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
} from '@mui/material';

const TakeacitonModal = ({
  open,
  handleClose,
  employees,
  status,
  formDataUpdate,
  handleInputChangeUpdate,
  handleUpdeteClick,
  formDataUpdateEdit,
  setFormDataUpdateEdit,
  setFormDataUpdate,
  unreadableData,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box p={3} bgcolor="background.paper" maxWidth={600} mx="auto" mt={4} borderRadius={2}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2' }}>
        เข้าดำเนินการ
      </Typography>

      <Grid container spacing={2} mt={2}>
        {/* หมายเลขกรณี */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="หมายเลขกรณี"
            type="text"
            name="receiveCaseId"
            value={formDataUpdate?.receiveCaseId || ''}
            disabled
          />
        </Grid>

        {/* วันที่แจ้ง Case */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="วันที่แจ้ง Case"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            name="start_date"
            value={formDataUpdate?.start_date || ''}
            onChange={handleInputChangeUpdate}
            disabled={
              unreadableData?.status_name === 'กำลังดำเนินการ' ||
              unreadableData?.status_name === 'ดำเนินการเสร็จสิ้น'
            }
            inputProps={{
              step: 60,
            }}
            sx={{
              '& .MuiInputBase-input': { fontSize: '16px', fontFamily: 'Roboto' },
              '& .MuiInputLabel-root': { fontSize: '14px' },
            }}
          />
        </Grid>

        {/* วิธีแก้ไข */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="วิธีแก้ไข"
            multiline
            rows={3}
            name="correct"
            value={formDataUpdate?.correct || ''}
            onChange={handleInputChangeUpdate}
          />
        </Grid>

        {/* พนักงานที่เข้าดำเนินการ */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold">
            พนักงานที่เข้าดำเนินการ
          </Typography>

          <FormControl fullWidth variant="outlined">
            <Select
              value={formDataUpdateEdit?.saev_em || ''}
              onChange={(e) => {
                const selectedEmployeeId = e.target.value;
                console.log('Selected employee ID:', selectedEmployeeId);

                setFormDataUpdateEdit({
                  ...formDataUpdateEdit,
                  saev_em: selectedEmployeeId,
                });

                setFormDataUpdate((prevState) => ({
                  ...prevState,
                  saev_em: selectedEmployeeId,
                }));
              }}
            >
              {employees?.map((emp) => (
                <MenuItem key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* เลือกสถานะ */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Select
              value={formDataUpdate?.status_id || ''}
              onChange={handleInputChangeUpdate}
              name="status_id"
              displayEmpty
              sx={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1565c0',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0d47a1',
                },
              }}
            >
              <MenuItem value="" disabled>
                เลือกสถานะ
              </MenuItem>
              {status?.map((statusItem) => {
                const currentStatus = unreadableData?.status_name;

                // กำหนดเงื่อนไขในการปิดการใช้งาน (disable)
                const isDisabled =
                  (currentStatus === 'รอดำเนินการ' && statusItem.statusName !== 'กำลังดำเนินการ') ||
                  (currentStatus === 'กำลังดำเนินการ' &&
                    statusItem.statusName !== 'ดำเนินการเสร็จสิ้น') ||
                  currentStatus === 'ดำเนินการเสร็จสิ้น';

                const handleClick = () => {
                  // Only update if the status change is valid
                  if (!isDisabled) {
                    handleInputChangeUpdate({
                      target: { name: 'status_name', value: statusItem.statusName },
                    });
                  }
                };

                return (
                  <MenuItem
                    key={statusItem.statusId}
                    value={statusItem.statusId}
                    disabled={isDisabled}
                    sx={{
                      backgroundColor:
                        statusItem.statusName === 'กำลังดำเนินการ'
                          ? '#FFEB3B'
                          : statusItem.statusName === 'ดำเนินการเสร็จสิ้น'
                            ? '#4CAF50'
                            : 'inherit',
                      color:
                        statusItem.statusName === 'กำลังดำเนินการ'
                          ? '#FFA000'
                          : statusItem.statusName === 'ดำเนินการเสร็จสิ้น'
                            ? '#ffffff'
                            : 'inherit',
                      fontWeight:
                        statusItem.statusName === 'กำลังดำเนินการ' ||
                        statusItem.statusName === 'ดำเนินการเสร็จสิ้น'
                          ? 'bold'
                          : 'inherit',
                      '&:hover': {
                        backgroundColor:
                          statusItem.statusName === 'กำลังดำเนินการ'
                            ? '#FFC107'
                            : statusItem.statusName === 'ดำเนินการเสร็จสิ้น'
                              ? '#388E3C'
                              : 'inherit',
                      },
                      borderRadius: '4px',
                      margin: '4px 0',
                    }}
                    onClick={handleClick} // Call handleClick instead of directly calling handleInputChangeUpdate
                  >
                    {statusItem.statusName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        {/* ปุ่ม */}
        <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            onClick={() => handleUpdeteClick(handleUpdeteClick)}
            variant="contained"
            color="primary"
            sx={{ width: '150px', height: '50px' }}
          >
            บันทึก
          </Button>
          <Button
            onClick={handleClose}
            color="grey"
            sx={{
              backgroundColor: '#B0B0B0',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#A0A0A0' },
              width: '150px',
              height: '50px',
            }}
          >
            ยกเลิก
          </Button>
        </Grid>
      </Grid>
    </Box>
  </Modal>
);

export default TakeacitonModal;
