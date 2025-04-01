import axios from 'axios';
import Swal from 'sweetalert2';
import { domain } from '../../utils';

const handleDeleteAll = async (setHistoryData) => {
    const { value: password } = await Swal.fire({
        title: 'Enter Admin Password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Delete Logs',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: async (password) => {
            if (!password) {
                Swal.showValidationMessage('Password is required');
                return false;
            }
            return password;
        }
    });

    if (!password) return;

    try {
        const response = await axios.delete(`${domain}/api/delete-logs/`, {
            data: { password },
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 204) {
            setHistoryData([]);
            Swal.fire('Deleted!', 'All logs have been deleted successfully!', 'success');
        }
    } catch (error) {
        Swal.fire('Error', error.response?.data?.error || 'There was an error deleting the logs.', 'error');
    }
};

export default handleDeleteAll;
