/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Grid,
  Chip,
  Modal,
  Button,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
  Autocomplete,
} from '@mui/material';

const AddCaseModal = ({
  open,
  handleClose,
  mainCases,
  subcasedata,
  levelurgent,
  employee,
  team,
  branchs,
  files,
  handleInputChange,
  setFormData,
  formData,
  handleFileChange,
  handleRemoveFile,
  handlePostData,
  resetData,
}) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '150%',
        maxWidth: 1200,
        maxHeight: 1200,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
        p: 4,
        overflowY: 'auto',
        border: '3px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Typography variant="h4" gutterBottom>
       - แจ้งรายละเอียดข้อมูล Case
      </Typography>
      <Card>
        <CardContent>
          {/* <Typography variant="h6" gutterBottom style={{ paddingTop: '-16px' }}>
            รายละเอียดข้อมูล Case
          </Typography> */}

          <Grid container spacing={3}>
            {/* Section 1 */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    value={formData.main_case_id || ''}
                    name="main_case_id"
                    onChange={handleInputChange}
                    label="สาเหตุหลัก"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  >
                    {mainCases?.length > 0 ? (
                      mainCases.map((option) => (
                        <MenuItem key={option.mainCaseId} value={option.mainCaseId}>
                          {option.mainCaseName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>ไม่มีข้อมูล</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    options={subcasedata || []}
                    getOptionLabel={(option) => option.subCaseName}
                    value={
                      subcasedata?.filter((option) =>
                        formData.sub_case_id?.includes(option.subCaseId)
                      ) || []
                    }
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        sub_case_id: newValue.map((item) => item.subCaseId),
                      }));
                    }}
                    disableCloseOnSelect
                    filterSelectedOptions
                    renderOption={(props, option, { selected }) => (
                      <li {...props} style={{ backgroundColor: selected ? '#d4edda' : 'inherit' }}>
                        <Checkbox checked={selected} style={{ color: '#28a745' }} />
                        {option.subCaseName}
                      </li>
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          key={option.subCaseId}
                          label={option.subCaseName}
                          {...getTagProps({ index })}
                          style={{
                            backgroundColor: '#28a745', // เปลี่ยนเป็นสีเขียว
                            color: 'white', // เปลี่ยนสีตัวอักษรเป็นขาว
                            borderRadius: '8px', // ให้ขอบมน
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="สาเหตุย่อย"
                        variant="outlined"
                        placeholder={formData.sub_case_id?.length ? '' : 'ค้นหาสาเหตุย่อย...'}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink htmlFor="urgent_level_id">
                      ระดับความเร่งด่วน
                    </InputLabel>
                    <Select
                      value={formData.urgent_level_id || ''}
                      name="urgent_level_id"
                      onChange={handleInputChange}
                      label="ระดับความเร่งด่วน"
                      id="urgent_level_id"
                      MenuProps={{
                        PaperProps: {
                          sx: { maxHeight: 200, overflow: 'auto' },
                        },
                      }}
                      // Set the color of the selected item
                      sx={{
                        color: levelurgent?.find(
                          (option) => option.levelUrgentId === formData.urgent_level_id
                        )
                          ? levelurgent.find(
                              (option) => option.levelUrgentId === formData.urgent_level_id
                            ).levelUrgentName === 'เร่งด่วน'
                            ? 'red'
                            : levelurgent.find(
                                  (option) => option.levelUrgentId === formData.urgent_level_id
                                ).levelUrgentName === 'ปานกลาง'
                              ? 'orange'
                              : 'green'
                          : 'inherit',
                      }}
                    >
                      {/* Urgent Levels */}
                      {Array.isArray(levelurgent) &&
                        levelurgent.map((option) => (
                          <MenuItem
                            key={option.levelUrgentId}
                            value={option.levelUrgentId}
                            sx={{
                              color:
                                option.levelUrgentName === 'เร่งด่วน'
                                  ? 'red'
                                  : option.levelUrgentName === 'ปานกลาง'
                                    ? 'orange'
                                    : 'green',
                            }}
                          >
                            {option.levelUrgentName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      value={formData.employee_id || ''}
                      name="employee_id"
                      onChange={handleInputChange}
                      label="คนที่เเจ้ง"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    >
                      {employee?.map((option) => (
                        <MenuItem key={option.employeeId} value={option.employeeId}>
                          {option.employeeName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      value={formData.team_id || ''}
                      name="team_id"
                      onChange={handleInputChange}
                      label="ทีมเเก้ไข หรือ ประสานงาน"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {team?.map((option) => (
                        <MenuItem key={option.teamId} value={option.teamId}>
                          {option.teamId} - {option.teamName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    value={formData.create_date}
                    name="create_date"
                    type="datetime-local"
                    label="วันที่รับ case"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    value={formData.problem || ''}
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
                    value={formData.details || ''}
                    name="details"
                    onChange={handleInputChange}
                    label="รายละเอียด"
                    variant="outlined"
                    multiline
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Section 2 */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={branchs || []}
                    getOptionLabel={(option) => `${option.branchId} - ${option.branchName}`}
                    value={branchs?.find((b) => b.branchId === formData.branch_id) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        branch_id: newValue ? newValue.branchId : '',
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="สาขา"
                        variant="outlined"
                        placeholder="ค้นหาสาขา..."
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    border="1px dashed grey"
                    disabled
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
                      disabled
                      multiple
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
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handlePostData(); // เรียก API
                resetData();
                handleClose(); // ปิด Modal
              }}
            >
              บันทึก
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Modal>
);

export default AddCaseModal;
