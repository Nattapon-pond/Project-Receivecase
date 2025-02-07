/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Card, Grid, Modal, Button, TextField, Typography, CardContent } from '@mui/material';

const EditactionModal = ({
  open,
  handleClose,
  employees,
  files,
  handleInputChange,
  formDataUpdateEdit,
  setFormDataUpdateEdit,
  handleFileChange,
  handleRemoveFile,
  handleInputEditChange,
  handleSave,
  mainCases,
  subcasedata,
  levelurgent,

  team,
  branchs,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 1500,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        maxHeight: '90',
        overflowY: 'auto', // Scroll if content overflows
      }}
    >
      <Typography variant="h4" gutterBottom>
        รายละเอียดข้อมูล Case
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Section 1 */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box mt={2}>
                    <TextField
                      fullWidth
                      label="หมายเลขกรณี"
                      type="text"
                      name="receiveCaseId"
                      value={formDataUpdateEdit?.receiveCaseId || ''}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.main_case_name || ''} // ถ้าไม่มีค่าให้ใช้ ''
                    label="สาเหตุหลัก"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.combined_sub_case_names || ''} // ถ้าไม่มีค่าให้ใช้ ''
                    label="สาเหตูย่อย"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.level_urgent_name || ''} // ถ้าไม่มีค่าให้ใช้ ''
                    label="ระดับความเร่งด่วน"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.employee_name || ''}
                    label="ชื่อพนักงาน"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.team_name || ''} // ถ้าไม่มีค่าให้ใช้ ''
                    label="ทีม"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    value={
                      formDataUpdateEdit?.create_date
                        ? `${new Date(formDataUpdateEdit.create_date).toLocaleDateString('th-TH', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })} เวลา ${new Date(formDataUpdateEdit.create_date).toLocaleTimeString(
                            'th-TH',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false, // ใช้เวลาแบบ 24 ชั่วโมง
                            }
                          )}`
                        : '' // ถ้าไม่มีค่าให้แสดงเป็นค่าว่าง
                    }
                    label="วันที่รับ Case"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    value={
                      formDataUpdateEdit?.end_date
                        ? `${new Date(formDataUpdateEdit.end_date).toLocaleDateString('th-TH', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })} เวลา ${new Date(formDataUpdateEdit.end_date).toLocaleTimeString(
                            'th-TH',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false, // ใช้เวลาแบบ 24 ชั่วโมง
                            }
                          )}`
                        : '' // ถ้าไม่มีค่าให้แสดงเป็นค่าว่าง
                    }
                    label="วันที่สิ้นสุด"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.problem || ''}
                    name="problem"
                    onChange={handleInputChange}
                    label="ปัญหา"
                    variant="outlined"
                    multiline
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.details || ''} // แสดงค่าเดิมหากมีค่าอยู่
                    name="details"
                    onChange={handleInputEditChange} // เมื่อมีการแก้ไขจะเรียกฟังก์ชันนี้
                    label="รายละเอียด"
                    variant="outlined"
                    multiline
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} >
              <Grid container spacing={3} pt={2} direction="column">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.branch_name || ''} // ถ้าไม่มีค่าให้ใช้ ''
                    label="สาขา"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="พนักงานที่เข้าดำเนินการ"
                    variant="outlined"
                    value={
                      (employees ?? []).find(
                        (emp) =>
                          String(emp.employeeId).trim() ===
                          String(formDataUpdateEdit?.saev_em).trim()
                      )?.employeeName || 'ยังไม่มีพนักงาน'
                    }
                    InputProps={{
                      readOnly: true, // ✅ ทำให้เป็น ReadOnly ป้องกันการแก้ไข
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    border="1px dashed grey"
                    borderRadius={2}
                    p={3}
                  >
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Select files
                    </Typography>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      id="upload-file-input"
                      multiple
                      disabled
                      onChange={handleFileChange}
                      // eslint-disable-next-line react/jsx-no-comment-textnodes
                    />
                    <label htmlFor="upload-file-input">
                      <Button
                        variant="contained"
                        component="span"
                        disabled
                        startIcon={<Icon icon="uil:image-upload" width="24" height="24" />}
                      >
                        Upload Files
                      </Button>
                    </label>

                    <Box mt={2} width="100%">
                      <Grid container spacing={2}>
                        {files?.map((file, index) => (
                          <Grid item key={index} xs={4}>
                            <Box
                              position="relative"
                              border="1px solid #ccc"
                              borderRadius={2}
                              overflow="hidden"
                            >
                              {/* แสดงตัวอย่างไฟล์ */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  cursor: 'pointer',
                                }}
                              />
                              {/* ปุ่มลบไฟล์ */}
                              <Button
                                size="small"
                                color="secondary"
                                onClick={() => handleRemoveFile(index)}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  zIndex: 1,
                                }}
                              >
                                ✖
                              </Button>
                            </Box>
                            {/* แสดงชื่อไฟล์ */}
                            <Typography variant="caption" color="textSecondary" mt={1}>
                              {file.name}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {/* Section 2 */}
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave} // เรียกฟังก์ชัน handleSave เมื่อคลิก
            >
              บันทึก
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Modal>
);

export default EditactionModal;
