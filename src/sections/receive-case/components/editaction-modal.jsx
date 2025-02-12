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
        width: '90%', // ลดขนาด Modal ให้เล็กลงในจอมือถือ
        maxWidth: { xs: 350, sm: 600, md: 1500 }, // ปรับขนาดตามหน้าจอ
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: { xs: 2, sm: 4 }, // ลด Padding ในจอเล็ก
        maxHeight: '90vh', // ป้องกัน Modal สูงเกินจอ
        overflowY: 'auto',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }}>
        รายละเอียดข้อมูล Case
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Section 1 */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="หมายเลขกรณี"
                    type="text"
                    name="receiveCaseId"
                    value={formDataUpdateEdit?.receiveCaseId || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.main_case_name || ''}
                    label="สาเหตุหลัก"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.combined_sub_case_names || ''}
                    label="สาเหตูย่อย"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.level_urgent_name || ''}
                    label="ระดับความเร่งด่วน"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.employee_name || ''}
                    label="ชื่อพนักงาน"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth value={formDataUpdateEdit?.team_name || ''} label="ทีม" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth value={formDataUpdateEdit?.branch_name || ''} label="สาขา" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.problem || ''}
                    name="problem"
                    onChange={handleInputChange}
                    label="ปัญหา"
                    multiline
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    value={formDataUpdateEdit?.details || ''}
                    name="details"
                    onChange={handleInputEditChange}
                    label="รายละเอียด"
                    multiline
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section 2 */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="พนักงานที่เข้าดำเนินการ"
                    value={
                      (employees ?? []).find(
                        (emp) =>
                          String(emp.employeeId).trim() ===
                          String(formDataUpdateEdit?.saev_em).trim()
                      )?.employeeName || 'ยังไม่มีพนักงาน'
                    }
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                {/* File Upload */}
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    border="1px dashed grey"
                    borderRadius={2}
                    p={2}
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
                    {/* แสดงไฟล์ที่อัปโหลด */}
                    <Box mt={2} width="100%">
                      <Grid container spacing={2}>
                        {files?.map((file, index) => (
                          <Grid item key={index} xs={6} sm={4}>
                            <Box
                              position="relative"
                              border="1px solid #ccc"
                              borderRadius={2}
                              overflow="hidden"
                            >
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
                              <Button
                                size="small"
                                color="secondary"
                                onClick={() => handleRemoveFile(index)}
                                sx={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
                              >
                                ✖
                              </Button>
                            </Box>
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
          </Grid>

          {/* Save Button */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              บันทึก
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Modal>
);

export default EditactionModal;
