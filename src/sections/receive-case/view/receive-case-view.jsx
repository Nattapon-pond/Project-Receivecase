/* eslint-disable no-shadow */

'use client';

import { useState, useEffect } from 'react';

import { Box } from '@mui/material';

import { useGetReceivecase } from 'src/actions/Rc_Case';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  get_team,
  get_status,
  getbranchs,
  getMainCase,
  get_employee,
  getSubcaseData,
  getlevelurgencies,
} from 'src/actions/maincase';

import CaseDataGrid from '../components/case-datagrid';

export function ReceiveCaseView() {
  const { Receivecase, ReceivecaseLoading, ReceivecaseError, ReceivecaseEmpty, refetchReceivecase } =
    useGetReceivecase();

    const handleRefresh = () => {
      refetchReceivecase(); // เรียก refetch ข้อมูลใหม่
    };

  // เพิ่ม State เพื่อเก็บข้อมูลจาก allData
  const [mainCase, setMainCase] = useState(null);
  const [subCaseData, setSubCaseData] = useState(null);
  const [branchs, setBranchs] = useState(null);
  const [levelUrgencies, setLevelUrgencies] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [teams, setTeams] = useState(null);
  const [status, setStatus] = useState(null);

  const allData = async () => {
    try {
      const mainCase = await getMainCase();
      setMainCase(mainCase); // บันทึกใน state
      const subCaseData = await getSubcaseData();
      setSubCaseData(subCaseData);
      const branchs = await getbranchs();
      setBranchs(branchs);
      const levelUrgencies = await getlevelurgencies();
      setLevelUrgencies(levelUrgencies);
      const employees = await get_employee();
      setEmployees(employees);
      const teams = await get_team();
      setTeams(teams);
      const status = await get_status();
      const parseJson = JSON.parse(status);
      console.log(parseJson.cases)
      setStatus(parseJson.cases);
      
      

      // Optional: Log ข้อมูล
      console.log({
        mainCase,
        subCaseData,
        branchs,
        levelUrgencies,
        employees,
        teams,
        status,
      });
    } catch (error) {
      console.log('Error fetching data in allData:', error);
    }
  };

  useEffect(() => {
    const fetchReceiveCase = async () => {
      try {
        if (ReceivecaseError) {
          alert('Error Please Try Again!!');
          return;
        }

        if (!Receivecase || ReceivecaseLoading) return;

        console.log('Fetched Receivecase:', Receivecase);
      } catch (error) {
        alert('Error occurred while fetching Receivecase');
        console.error('Error occurred while fetching Receivecase', error);
      }
    };
    allData();
    fetchReceiveCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Receivecase, ReceivecaseLoading, ReceivecaseError]);

  return (
    <DashboardContent maxWidth="xxl">
      <Box p={3}>
        <CaseDataGrid
          Case={Receivecase}
          CaseLoading={ReceivecaseLoading}
          CaseError={ReceivecaseError}
          mainCase={mainCase}
          subCaseData={subCaseData}
          branchs={branchs}
          levelUrgencies={levelUrgencies}
          employees={employees}
          teams={teams}
          status={status}
          handleRefresh={handleRefresh}
        />
      </Box>
    </DashboardContent>
  );
}
