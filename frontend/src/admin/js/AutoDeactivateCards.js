import { useEffect } from 'react';
import { domain } from '../../utils';

const useAutoDeactivateCards = () => {
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 19 && now.getMinutes() === 0) {
                fetch(`${domain}/api/autodeactivate_cards/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data.success) {
                            console.log('All cards deactivated at 6 PM');
                        } else {
                            console.log('It is not time to deactivate cards yet');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);
};

export default useAutoDeactivateCards;