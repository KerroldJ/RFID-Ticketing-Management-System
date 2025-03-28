import axios from 'axios';
import Swal from 'sweetalert2';
import { domain } from '../../utils';

const deactivateAllCards = async (setCards) => {
    try {
        // Prompt for password authentication
        const { value: password } = await Swal.fire({
            title: 'Admin Authentication',
            input: 'password',
            inputLabel: 'Please enter your password',
            inputPlaceholder: 'Password',
            confirmButtonText: 'Login',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Password is required';
                }
            }
        });
        if (!password) return;

        // Send password to backend for validation and card deactivation
        const response = await axios.post(`${domain}/api/all_cards_deactivate/`, {
            password
        });

        if (response.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message || 'All activated cards have been deactivated successfully.',
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: response.data.message || 'No Regular Cards to Deactivate.',
            });
        }

        // Fetch updated card data
        const updatedResponse = await fetch(`${domain}/api/cards/`);
        const updatedData = await updatedResponse.json();
        setCards(updatedData);
    } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: error.response.data?.message || 'Invalid password.',
            });
        } else if (error.request) {
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: 'Network error. Please check your connection.',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: `Unexpected error: ${error.message}`,
            });
        }
    }
};

export default deactivateAllCards;
