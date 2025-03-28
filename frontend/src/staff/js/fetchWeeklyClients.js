import axios from "axios";
import { domain } from '../../utils'

const fetchWeeklyClients = async (setData) => {
    try {
        const response = await axios.get(`${domain}/api/weekly-clients/`);
        const { labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data = [0, 0, 0, 0, 0, 0, 0] } = response.data;

        setData((prevData) => ({
            ...prevData,
            labels,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data,
                },
            ],
        }));
    } catch (error) {
        console.error("Error fetching weekly deactivated cards:", error);
    }
};

export default fetchWeeklyClients;
