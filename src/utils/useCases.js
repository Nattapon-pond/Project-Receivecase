import { useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config-global';

import { apiService } from '../services/apiService';
// eslint-disable-next-line perfectionist/sort-imports


export const useCases = (currentPage, selectedYear) => {
  const baseURL = CONFIG.site.serverUrl;
  const [cases, setCases] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`${baseURL}/receivecase/getreceivecase`, {
        params: { page: currentPage, limit: 7 },
      });
      setCases(response.data.cases || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, baseURL]);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`${baseURL}/receivecase/statusCharts?start_date=${selectedYear}-01-01&end_date=${selectedYear}-12-31`);
      if (response.data && Array.isArray(response.data.body)) {
        const mappedData = response.data.body.map((item) => ({
          month: item.month_name,
          completed: Number(item.completed_count) || 0,  // แปลงเป็นตัวเลข
          pending: Number(item.pending_count) || 0,      // แปลงเป็นตัวเลข
        }));
        setChartData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, baseURL]);

  useEffect(() => {
    fetchCases();
    fetchChartData();
  }, [fetchCases, fetchChartData]);

  return { cases, chartData, loading, totalPages };
};