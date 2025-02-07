// /* eslint-disable no-dupe-keys */
// /* eslint-disable jsx-a11y/label-has-associated-control */

// 'use client';

// import React, { useState, useEffect } from 'react'; // นำเข้า React เพียงครั้งเดียว
// import UploadFileIcon from '@mui/icons-material/UploadFile'; // Import Search icon
// import axios from 'axios';
// import Swal from 'sweetalert2';

// import {
//   Box,
//   Grid,
//   Card,
//   Button,
//   Select,
//   MenuItem,
//   Checkbox,
//   TextField,
//   Typography,
//   InputLabel,
//   CardContent,
//   FormControl,
// } from '@mui/material';

// import { CONFIG } from 'src/config-global';
// import {
//   get_team,
//   getbranchs,
//   getMainCase,
//   get_employee,
//   getSubcaseData,
//   getlevelurgencies,
// } from 'src/actions/maincase';

// // ----------------------------------------------------------------------
// const baseURL = CONFIG.site.serverUrl;
// const AddCasePage = () => {
//   //---------------------------------------------------------------------------------------------

//   // ฟังชั่น get All subcaseData
//   const [subcasedata, setSubcaseData] = useState([]); 

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getSubcaseData(); 
//         console.log('Response from getSubcaseData:', response);

//         if (response) {
//           const data = await response;

//           // ตรวจสอบว่า data เป็น array หรือไม่
//           if (Array.isArray(data)) {
//             setSubcaseData(data); // ถ้าเป็น Array ให้เก็บข้อมูลใน state
//           } else {
//             console.error('Expected an array, but received:', data);
//             setSubcaseData([]); // ถ้าไม่ใช่ Array ให้เก็บ array ว่าง
//           }
//         } else {
//           console.error('Error with response:', response);
//           setSubcaseData([]); // ถ้า response ไม่ถูกต้อง, set เป็น array ว่าง
//         }
//       } catch (error) {
//         console.error('Error fetching branch data:', error);
//         setSubcaseData([]); // หากเกิดข้อผิดพลาดในการดึงข้อมูล, เซ็ตเป็น array ว่าง
//       }
//     };

//     fetchData();
//   }, []);
//   //------------------------------------------------------------------------------------------------------

//   // ฟังชั่น GetAll  branchs
//   const [branchs, setbranchs] = useState([]); // State สำหรับเก็บ branchs

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getbranchs();
//         console.log('Response from getbranchs:', response);

//         if (response) {
//           const data = await response;

//           // ตรวจสอบว่า data เป็น array หรือไม่
//           if (Array.isArray(data)) {
//             setbranchs(data); // ถ้าเป็น Array ให้เก็บข้อมูลใน state
//           } else {
//             console.error('Expected an array, but received:', data);
//             setbranchs([]); // ถ้าไม่ใช่ Array ให้เก็บ array ว่าง
//           }
//         } else {
//           console.error('Error with response:', response);
//           setbranchs([]); // ถ้า response ไม่ถูกต้อง, set เป็น array ว่าง
//         }
//       } catch (error) {
//         console.error('Error fetching branch data:', error);
//         setbranchs([]); // หากเกิดข้อผิดพลาดในการดึงข้อมูล, เซ็ตเป็น array ว่าง
//       }
//     };

//     fetchData();
//   }, []);
//   //------------------------------------------------------------------------------------------------------

//   const [levelurgent, setlevelurgent] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getlevelurgencies();
//         console.log('Response from getbranchs:', response);

//         console.log(response);

//         if (response) {
//           const data = await response;

//           if (Array.isArray(data)) {
//             setlevelurgent(data);
//           } else {
//             console.error('Expected an array, but received:', data);
//             setlevelurgent([]);
//           }
//         } else {
//           console.error('Error with response:', response);
//           setlevelurgent([]);
//         }
//       } catch (error) {
//         console.error('Error fetching branch data:', error);
//         setlevelurgent([]);
//       }
//     };
//     fetchData();
//   }, []);

//   //---------------------------------------------------------------------------------------------------------------------------
//   const [employee, setemployee] = useState([]); 

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await get_employee(); 
//         console.log('Response from get_employee:', response); 

       
//         if (Array.isArray(response)) {
//           setemployee(response); 
//         } else {
//           console.error('Expected an array, but received:', response);
//           setemployee([]); 
//         }
//       } catch (error) {
//         console.error('Error fetching employee data:', error);
//         setemployee([]); 
//       }
//     };

//     fetchData();
//   }, []);

//   //---------------------------------------------------------------------------------------------------------------------------
//   const [team, setteam] = useState([]); 

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await get_team();
//         console.log('Response from getteam:', response); 

      
//         if (Array.isArray(response)) {
//           setteam(response); 
//         } else {
//           console.error('Expected an array, but received:', response);
//           setteam([]); 
//         }
//       } catch (error) {
//         console.error('Error fetching employee data:', error);
//         setteam([]); 
//       }
//     };

//     fetchData();
//   }, []);

//   // ----------------------------------------------------------------------------------------------------
//   const [mainCases, setMainCases] = useState([]); // State สำหรับเก็บ main cases

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await getMainCase(); // เรียกใช้ฟังก์ชัน getSubcaseData
//         console.log('Response from setMainCases:', response); // ตรวจสอบข้อมูลที่ได้รับจาก getSubcaseData

//         // ตรวจสอบว่าเป็น Array หรือไม่
//         if (Array.isArray(response)) {
//           setMainCases(response); // ถ้าเป็น Array ให้เก็บข้อมูลใน state
//         } else {
//           console.error('Expected an array from getSubcaseData, but received:', response);
//           setMainCases([]); // หากไม่ใช่ Array ให้กำหนดค่าเป็น Array ว่าง
//         }
//       } catch (error) {
//         console.error('Error fetching subcase data:', error);
//       }
//     };
//     fetchData();
//   }, []);

//   //--------------------------------------------------------------------------------------------------------------------------------------------

//   // กำหนดค่า baseURL ของ API ที่จะใช้

//   // const baseURL = 'http://localhost:3000'; // กำหนดค่า baseURL

//   const receive_casePost = `${baseURL}/receive-case`; // ใช้ baseURL ในการสร้าง URL

//   // ฟังก์ชันจัดการเมื่อเลือกไฟล์
//   const handleFileUpload = (event) => {
//     const { files } = event.target;
//     const fileArray = Array.from(files);

//     // Store selected files for display
//     setSelectedFile(fileArray);

//     // Generate image previews
//     const previewArray = fileArray.map((file) => {
//       const reader = new FileReader();
//       return new Promise((resolve) => {
//         reader.onloadend = () => resolve(reader.result);
//         reader.readAsDataURL(file);
//       });
//     });

//     // Set image previews once all files are read
//     Promise.all(previewArray).then((previews) => {
//       setImagePreviews(previews);
//     });
//   };

//   const handleImageClick = (file) => {
//     setSelectedImage(URL.createObjectURL(file));
//     setOpenDialog(true);
//   };

//   const [files, setFiles] = useState([]);

//   const handleFileChange = (event) => {
//     const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
//     setFiles([...files, ...selectedFiles]); // Update the state with selected files
//   };

//   const handleRemoveFile = (index) => {
//     const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index); // Remove the file at the specified index
//     setFiles(updatedFiles); // Update the state
//   };

//   const [selectedSubCases, setSelectedSubCases] = useState([]);

//   const handleSelectChange = (event) => {
//     setSelectedSubCases(event.target.value);
//   };

//   // Function to close modal
//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setSelectedImage(null);
//   };

//   const [selectedFile, setSelectedFile] = useState([]); // ประกาศ selectedFile ที่นี่
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   //----------------------------------------------------------------------------------------------------

//   const handleInputChange = (event) => {
//     const { name, value, type } = event.target; // ตรวจสอบค่าจาก event.target

//     // เช็คว่า field ที่ถูกเลือกเป็นประเภท 'date' หรือไม่
//     if (type === 'date') {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value, // อัพเดทค่า start_date หรือชื่อฟิลด์อื่นๆ
//       }));
//     } else {
//       // สำหรับประเภทอื่นๆ เช่น 'text', 'select', 'number'
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value, // อัพเดทค่าตามชื่อฟิลด์
//       }));
//     }
//   };

//   //---------------------------------------------------------------------------------------------------------------------------
//   const [openDialog, setOpenDialog] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState('');
//   const [hasSubmitted, setHasSubmitted] = useState(false); // Track if form was submitted

//   useEffect(() => {
//     setDialogMessage('');
//     setHasSubmitted(false); // Reset when the page reloads
//   }, []);

//   const [formData, setFormData] = useState({
//     create_date: new Date().toISOString(),
//     branch_id: null,
//     sub_case_id: [], // อาร์เรย์สำหรับ sub_case_ids
//     urgent_level_id: null,
//     employee_id: null,
//     team_id: null,
//     main_case_id: null,
//     problem: '',
//     details: '',
//     status_id: 1, // ค่าเริ่มต้นเป็น 1
//     img_id: [], // อาร์เรย์สำหรับ img_data_ids
//     saev_em: '',
//     correct: '',
//     start_date: null,
//     end_date: null,
//     files: [], // สำหรับเก็บไฟล์
//   });

//    const handleSubmit = async () => {
//     const formDataToSend = new FormData();

//     // ตรวจสอบไฟล์และเพิ่มลงใน formDataToSend
//     if (formData.files && formData.files.length > 0) {
//       formData.files.forEach((file) => {
//         if (file.size > 0 && file.type.includes('image/')) {
//           formDataToSend.append('files[]', file);
//           formDataToSend.append('file_name', file.name);
//         } else {
//           setDialogMessage(`ไฟล์ ${file.name} ไม่ใช่ไฟล์รูปภาพหรือขนาดไฟล์ไม่ถูกต้อง`);
//           setOpenDialog(true);
//         }
//       });
//     }
//     // ตรวจสอบช่องกรอกข้อมูลที่จำเป็น
//     const requiredFields = [
//       { key: 'branch_id', label: 'สาขา' },
//       { key: 'sub_case_id', label: 'สาเหตุย่อย' },
//       { key: 'urgent_level_id', label: 'ระดับความเร่งด่วน' },
//       { key: 'employee_id', label: 'พนักงาน' },
//       { key: 'team_id', label: 'ทีม' },
//       { key: 'main_case_id', label: 'เคสหลัก' },
//       { key: 'problem', label: 'ปัญหา' },
//       { key: 'details', label: 'รายละเอียด' },
//       { key: 'create_date', label: 'วันที่รับ case' },
//       { key: 'status_id', label: 'สเตตัส' },
//     ];

//     const missingFields = requiredFields.filter((field) => !formData[field.key]);

//     if (missingFields.length > 0) {
//       setDialogMessage(
//         `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.map((field) => field.label).join(', ')}`
//       );
//       setOpenDialog(true);
//       return;
//     }

//     const numericSubCaseIds = formData.sub_case_id.map((id) => parseInt(id, 10));

//     console.log(numericSubCaseIds);

//     // เพิ่มข้อมูลอื่น ๆ ลงใน FormData
//     formDataToSend.append('branch_id', formData.branch_id);
//     formDataToSend.append('urgent_level_id', formData.urgent_level_id);
//     formDataToSend.append('employee_id', formData.employee_id);
//     formDataToSend.append('team_id', formData.team_id);
//     formDataToSend.append('main_case_id', formData.main_case_id);
//     formDataToSend.append('problem', formData.problem);
//     formDataToSend.append('details', formData.details);
//     formDataToSend.append('create_date', formData.create_date || new Date().toISOString());
//     formDataToSend.append('start_date', formData.start_date || new Date().toISOString());
//     formDataToSend.append('end_date', formData.end_date || new Date().toISOString());
//     formDataToSend.append('img_id', formData.img_id || 0);
//     formDataToSend.append('saev_em', formData.saev_em || '');
//     formDataToSend.append('correct', formData.correct || '');
//     formDataToSend.append('status_id', formData.status_id || '');
//     // formDataToSend.append('sub_case_id', JSON.stringify(formData.sub_case_id || []));
//     formDataToSend.append('sub_case_ids', numericSubCaseIds);

//     try {
//       const response = await axios.post(`${baseURL}/receive-case`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // กำหนด Content-Type
//           'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
//         },
//       });

//       if (response.data.status === 201) {
//         setDialogMessage('บันทึกข้อมูลสำเร็จ!');
//         setOpenDialog(true);
//         setHasSubmitted(true); // Mark as submitted
//       } else {
//         setDialogMessage(`ไม่สามารถบันทึกข้อมูลได้: ${response.data.message || 'ไม่ทราบสาเหตุ'}`);
//         setOpenDialog(true);
//       }
//     } catch (error) {
//       console.error('Error uploading data:', error);

//       if (error.response) {
//         setDialogMessage(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.response.data.message}`);
//       } else if (error.request) {
//         setDialogMessage('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง');
//       } else {
//         setDialogMessage(`เกิดข้อผิดพลาด: ${error.message}`);
//       }
//       setOpenDialog(true);
//     }
//   };

//   useEffect(() => {
//     // ตรวจสอบการอัปเดตของ hasSubmitted และ dialogMessage
//     if (hasSubmitted && dialogMessage === 'บันทึกข้อมูลสำเร็จ!') {
//       Swal.fire({
//         title: 'สำเร็จ!',
//         text: dialogMessage,
//         icon: 'success',
//         timer: 3000, // ตั้งเวลาให้ SweetAlert แสดงเป็นเวลา 3 วินาที
//         showConfirmButton: false, // ปิดปุ่ม "ตกลง"
//       }).then(() => {
//         // เมื่อเวลาหมด, ทำการเปลี่ยนหน้าไปที่แดชบอร์ด
//         window.location.href = '/dashboard';
//       });
//     }
//   }, [hasSubmitted, dialogMessage]);

//   useEffect(() => {
//     setDialogMessage('');
//     setHasSubmitted(false); // Reset on component mount or page reload
//   }, []);

//   return (
//     <Box p={3}>
//       <Typography variant="h4" gutterBottom>
//         เเจ้ง Case
//       </Typography>
//       <Card style={{ maxWidth: 2000, margin: 'auto', padding: 20 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             รายละเอียดข้อมูล Case
//           </Typography>

//           <Grid container spacing={3}>
//             {/* Section 1 */}
//             <Grid item xs={12} md={8}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     value={formData.main_case_id || ''} // Default to empty string if undefined
//                     name="main_case_id"
//                     onChange={handleInputChange}
//                     label="สาเหตุหลัก"
//                     variant="outlined"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   >
//                     {Array.isArray(mainCases) &&
//                       mainCases.map((option, index) => (
//                         <MenuItem key={index} value={option.main_case_id}>
//                           {option.main_case_name}
//                         </MenuItem>
//                       ))}
//                   </TextField>{' '}
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     value={formData.sub_case_id || []} // Default to empty array if undefined
//                     name="sub_case_id"
//                     onChange={(event) => {
//                       const { value } = event.target;
//                       setFormData((prev) => ({
//                         ...prev,
//                         sub_case_id: typeof value === 'string' ? value.split(',') : value, // Handle multi-select
//                       }));
//                     }}
//                     label="สาเหตุย่อย"
//                     variant="outlined"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     SelectProps={{
//                       multiple: true, // Enable multi-select
//                       renderValue: (selected) =>
//                         subcasedata
//                           .filter((option) => selected.includes(option.sub_case_id))
//                           .map((option) => option.sub_case_name)
//                           .join(', '), // Render selected items as a comma-separated string
//                     }}
//                   >
//                     {subcasedata.map((option) => (
//                       <MenuItem key={option.sub_case_id} value={option.sub_case_id}>
//                         <Checkbox checked={formData.sub_case_id?.includes(option.sub_case_id)} />
//                         {option.sub_case_name}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink htmlFor="urgent_level_id">
//                       ระดับความเร่งด่วน
//                     </InputLabel>
//                     <Select
//                       value={formData.urgent_level_id || ''} // Default to empty string if undefined
//                       name="urgent_level_id"
//                       onChange={handleInputChange}
//                       label="ระดับความเร่งด่วน"
//                       id="urgent_level_id"
//                       fullWidth
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200, // เพิ่มความสูงของเมนู
//                             overflow: 'auto',
//                           },
//                         },
//                       }}
//                     >
//                       {/* ตรวจสอบว่า levelurgent เป็น array ก่อน */}
//                       {Array.isArray(levelurgent) &&
//                         levelurgent.map((option) => (
//                           <MenuItem
//                             key={option.level_urgent_id} // Ensure this key is unique
//                             value={option.level_urgent_id}
//                             sx={{
//                               color:
//                                 option.level_urgent_name === 'เร่งด่วน'
//                                   ? 'red'
//                                   : option.level_urgent_name === 'ปานกลาง'
//                                     ? 'orange'
//                                     : option.level_urgent_name === 'ไม่เร่งด่วน'
//                                       ? 'green'
//                                       : 'black', // สีของข้อความในตัวเลือก
//                             }}
//                           >
//                             {option.level_urgent_name} {/* แสดงชื่อระดับความเร่งด่วน */}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <FormControl fullWidth sx={{}}>
//                     <TextField
//                       select
//                       value={formData.employee_id || ''}
//                       name="employee_id"
//                       onChange={handleInputChange}
//                       label="คนที่เเจ้ง"
//                       variant="outlined"
//                       InputLabelProps={{ shrink: true }}
//                       sx={{ height: '100%' }}
//                     >
//                       {employee?.map((option) => (
//                         <MenuItem key={option.employee_id} value={option.employee_id}>
//                           {option.employee_name}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12} sm={6}>
//                   <FormControl fullWidth sx={{}}>
//                     <TextField
//                       select
//                       value={formData.team_id || ''}
//                       name="team_id"
//                       onChange={handleInputChange}
//                       label="ทีม"
//                       variant="outlined"
//                       InputLabelProps={{
//                         shrink: true, // ทำให้ป้ายย่อเมื่อช่องถูกเลือก
//                         style: {
//                           transform: 'translate(8px, 1px)', // ปรับตำแหน่งของป้าย
//                           fontSize: '12px', // กำหนดขนาดของตัวอักษร
//                         },
//                       }}
//                     >
//                       {team?.map((option) => (
//                         <MenuItem key={option.team_id} value={option.team_id}>
//                           {option.team_id} - {option.team_name}{' '}
//                           {/* แสดงทั้ง team_id และ team_name */}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     value={formData.create_date}
//                     name="create_date"
//                     type="date"
//                     label="วันที่รับ case"
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                     onChange={handleInputChange} /* ใช้ handleInputChange เพื่ออัพเดทค่า */
//                     fullWidth
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     value={formData?.problem || ''} // Default to empty string if undefined
//                     name="problem"
//                     onChange={handleInputChange}
//                     label="ปัญหา"
//                     variant="outlined"
//                     multiline
//                     rows={1}
//                     onInput={(e) => {
//                       e.target.style.height = 'auto'; // Reset height before resizing
//                       e.target.style.height = `${e.target.scrollHeight}px`; // Resize to fit content
//                     }}
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     value={formData?.details || ''} // Default to empty string if undefined
//                     name="details"
//                     onChange={handleInputChange}
//                     label="รายละเอียด"
//                     variant="outlined"
//                     multiline
//                     rows={1}
//                     onInput={(e) => {
//                       e.target.style.height = 'auto';
//                       e.target.style.height = `${e.target.scrollHeight}px`; // Resize to fit content
//                     }}
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>
//               </Grid>
//             </Grid>

//             {/* Section 2 */}
//             <Grid item xs={12} md={4}>
//               <Grid container spacing={3} direction="column">
//                 <Grid item xs={12} sm={4}>
//                   <FormControl fullWidth variant="outlined" sx={{ height: '100%' }}>
//                     <TextField
//                       select
//                       value={formData?.branch_id || ''}
//                       name="branch_id"
//                       onChange={handleInputChange}
//                       label="สาขา"
//                       InputLabelProps={{
//                         shrink: true, // ทำให้ป้ายย่อเมื่อช่องถูกเลือก
//                       }}
//                     >
//                       {branchs.map((option) => (
//                         <MenuItem key={option.branch_id} value={option.branch_id}>
//                           {option.branch_id} - {option.branch_name}
//                           {/* แสดงทั้ง branch_id และ branch_name */}
//                         </MenuItem>
//                       ))}
//                     </TextField>
//                   </FormControl>
//                 </Grid>

//                 <Grid item>
//                   <Box
//                     display="flex"
//                     flexDirection="column"
//                     alignItems="center"
//                     border="1px dashed grey"
//                     borderRadius={2}
//                     p={3}
//                   >
//                     <Typography variant="body2" color="textSecondary" gutterBottom>
//                       Select files
//                     </Typography>
//                     <input
//                       type="file"
//                       style={{ display: 'none' }}
//                       id="upload-file-input"
//                       multiple
//                       onChange={handleFileChange}
//                     />
//                     <label htmlFor="upload-file-input">
//                       <Button variant="contained" component="span" startIcon={<UploadFileIcon />}>
//                         Upload Files
//                       </Button>
//                     </label>

//                     <Box mt={2} width="100%">
//                       <Grid container spacing={2}>
//                         {files.map((file, index) => (
//                           <Grid item key={index} xs={4}>
//                             <Box
//                               position="relative"
//                               border="1px solid #ccc"
//                               borderRadius={2}
//                               overflow="hidden"
//                             >
//                               {/* <img
//                                 src={URL.createObjectURL(file)}
//                                 alt={`preview-${index}`}
//                                 style={{
//                                   width: '100%',
//                                   height: '100%',
//                                   objectFit: 'cover',
//                                   cursor: 'pointer',
//                                 }}
//                                 onClick={() => handleImageClick(file)} // เพิ่มฟังก์ชันคลิก
//                               /> */}
//                               {/* ปรับปุ่มกากบาทไปมุมขวาบน */}
//                               <Button
//                                 size="small"
//                                 color="secondary"
//                                 onClick={() => handleRemoveFile(index)}
//                                 style={{
//                                   position: 'absolute',
//                                   top: 0, // วางตำแหน่งปุ่มที่ขอบบน
//                                   right: 0, // วางตำแหน่งปุ่มที่ขอบขวา
//                                   zIndex: 1, // ทำให้ปุ่มอยู่เหนือรูป
//                                 }}
//                               >
//                                 ✖
//                               </Button>
//                             </Box>
//                             {/* เพิ่มชื่อไฟล์ใต้รูปภาพ */}
//                             <Typography variant="caption" color="textSecondary" mt={1}>
//                               {file.name} {/* แสดงชื่อไฟล์ */}
//                             </Typography>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     </Box>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Grid>

//           <div>
//             {/* <Dialog open={openDialog} onClose={handleCloseDialog}></Dialog> */}
//             <Box display="flex" justifyContent="flex-end">
//               <Button variant="contained" color="primary" onClick={handleSubmit}>
//                 บันทึก
//               </Button>
//             </Box>
//           </div>
//         </CardContent>
//       </Card>
//       {/* <Box mt={4}>
//         <Typography variant="h5" gutterBottom>
//           Report
//         </Typography>

//         {/* เรียกใช้คอมโพเนนต์ MyTable ที่นี่ */}
//       {/* <MyTable />
//       </Box> */}
//     </Box>
//   );
// };

// export default AddCasePage;
