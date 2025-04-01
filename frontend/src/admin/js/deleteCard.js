import axios from 'axios';
import Swal from 'sweetalert2';
import { domain } from '../../utils';


export const handleDeleteCard = async (cardId, cards, setCards) => {
    try {
        const { value: password } = await Swal.fire({
            title: 'Enter Admin Password',
            input: 'password',
            inputPlaceholder: 'Admin Password',
            confirmButtonText: 'Delete',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Password is required!';
                }
            },
        });

        if (!password) {
            return;
        }

        const response = await axios.delete(`${domain}/api/delete-card/${cardId}/`, {
            data: { password }
        });

        if (response.status === 204 || response.status === 200) {
            setCards(cards.filter(card => card.card_id !== cardId));
            Swal.fire('Success!', 'The card has been deleted.', 'success');
        } else {
            Swal.fire('Error', 'An unexpected error occurred.', 'error');
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: error.response.data?.message || 'Invalid password.',
            });
        } else if (error.response) {
            Swal.fire({
                icon: 'error',
                title: 'Failed!',
                text: error.response.data?.message || 'Something went wrong on the server.',
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