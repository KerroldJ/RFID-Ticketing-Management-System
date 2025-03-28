import { useEffect } from 'react';
import axios from 'axios';
import { domain } from '../../utils';

const useFetchCardLogs = (setHistoryData, setLoading, setError) => {
    useEffect(() => {
        axios
            .get(`${domain}/api/card-logs/`)
            .then((response) => {
                setHistoryData(response.data || []);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.response?.data?.detail || error.message || "Something went wrong");
                setLoading(false);
            });
    }, [setHistoryData, setLoading, setError]);
};

export default useFetchCardLogs;
