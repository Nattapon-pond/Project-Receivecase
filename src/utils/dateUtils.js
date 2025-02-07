export const formatDateTime = (dateString) => {
  if (!dateString) return 'ยังไม่มีข้อมูลการเข้าดำเนินการ'; // ✅ กรอง null, undefined

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    console.warn('Invalid Date:', dateString); // ✅ แจ้งเตือนถ้าข้อมูลผิดพลาด
    return 'ข้อมูลผิดพลาด';
  }

  // ✅ ปรับเวลาให้เป็น UTC+7
  date.setHours(date.getHours() + 7);

  const day = date.getUTCDate().toString().padStart(2, '0'); // ใช้ `getUTCDate`
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = (date.getUTCFullYear() + 543).toString().slice(-2);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
