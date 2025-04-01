import Swal from 'sweetalert2';
import { domain } from '../../utils';

const handleScanCardClick = (setCards) => {
    const openScanModal = () => {
        Swal.fire({
            title: "Scan RFID Card",
            input: "text",
            inputPlaceholder: "...Waiting for the ID",
            focusConfirm: false,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            didOpen: () => {
                const inputElement = Swal.getInput();
                if (inputElement) {
                    inputElement.style.color = 'transparent';
                    inputElement.style.caretColor = 'transparent';
                    inputElement.style.border = 'none';
                    inputElement.style.outline = 'none';
                    inputElement.style.boxShadow = 'none';
                    inputElement.style.textAlign = 'center';
                    inputElement.style.direction = 'rtl';
                    inputElement.focus();
                    inputElement.addEventListener('input', () => {
                        if (inputElement.value.length === 10) {
                            Swal.close();
                            processScan(inputElement.value, setCards);
                        }
                    });
                }
            },
        });
    };

const processScan = (cardId, setCards) => {
    fetch(`${domain}/api/check-status/${cardId}/`)
        .then((response) => response.json())
        .then((cardData) => {
            if (cardData.type === "VIP" && !cardData.office_name) {
                Swal.fire({
                    title: "Create Office Name",
                    input: "text",
                    inputPlaceholder: "Enter office name",
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    showConfirmButton: true,
                    preConfirm: () => {
                        const officeName = Swal.getInput().value;
                        if (!officeName) {
                            Swal.showValidationMessage("Office name cannot be empty!");
                            return false;
                        }
                        return officeName;
                    },
                }).then((result) => {
                    if (result.isConfirmed && result.value) {
                        saveOfficeName(cardId, result.value, setCards);
                    }
                });
            } else {
                activateCard(cardId, setCards);
            }
        })
        .catch((error) => {
            Swal.fire("Error", "Something went wrong: " + error.message, "error");
            openScanModal();
        });
};


const saveOfficeName = (cardId, officeName, setCards) => {
    if (!officeName) {
        Swal.fire("Error", "Office name cannot be empty!", "error");
        openScanModal();
        return;
    }

    const localDate = new Date();
    const formattedDate = localDate.toISOString().split('T')[0];
    const formattedTime = localDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    fetch(`${domain}/api/activate/${cardId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            created_date: formattedDate,
            created_time: formattedTime,
            office_name: officeName,
        }),
    })
        .then((response) => response.json())
        .then((saveData) => {
            if (saveData.success) {
                Swal.fire({
                    title: "Success!",
                    text: "Office name updated and card activated!",
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => openScanModal());
                fetchUpdatedCardData(setCards);
            } else {
                Swal.fire("Error", saveData.message, "error");
                openScanModal();
            }
        })
        .catch((error) => {
            Swal.fire("Error", "Something went wrong: " + error.message, "error");
            openScanModal();
        });
};

const fetchUpdatedCardData = (setCards) => {
    fetch(`${domain}/api/list-cards/`)
        .then((response) => response.json())
        .then((updatedData) => {
            setCards(updatedData);
        })
        .catch((error) => Swal.fire("Error", "Error fetching updated data: " + error.message, "error"));
};

const activateCard = (cardId, setCards) => {
    const localDate = new Date();
    const formattedDate = localDate.toISOString().split('T')[0];
    const formattedTime = localDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    fetch(`${domain}/api/activate/${cardId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ created_date: formattedDate, created_time: formattedTime }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                Swal.fire({
                    title: "Activated!",
                    text: data.message,
                    icon: "success",
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => openScanModal());
                fetchUpdatedCardData(setCards);
            } else {
                Swal.fire("Error", data.message, "error");
                openScanModal();
            }
        })
        .catch((error) => {
            Swal.fire("Error", "Something went wrong: " + error.message, "error");
            openScanModal();
        });
};
    openScanModal();
};

export default handleScanCardClick;
