import { useEffect } from 'react';
import { domain } from '../../utils';

const useFetchCards = (setCards) => {
    useEffect(() => {
        fetch(`${domain}/api/cards/`)
            .then((response) => response.json())
            .then((data) => setCards(data))
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [setCards]);
};

export default useFetchCards;