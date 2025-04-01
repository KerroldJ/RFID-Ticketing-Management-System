import axios from "axios";
import {domain} from '../../utils'

const fetchCardLogs = async (setHistoryData, setLoading, setError) => {
    try {
        const response = await axios.get(`${domain}/api/list-logs/`);
        setHistoryData(response.data || []);
    } catch (error) {
        setError(error.response?.data?.detail || error.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
};

export default fetchCardLogs;
