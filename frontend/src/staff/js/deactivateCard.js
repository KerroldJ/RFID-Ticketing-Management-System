import Swal from "sweetalert2";
import axios from "axios";
import { domain } from '../../utils';

export const handleScanCardClick = (setCards) => {
    if (typeof setCards !== "function") {
        console.error("setCards is not a function. Ensure it is correctly passed.");
        return;
    }

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
                    inputElement.style.color = "transparent";
                    inputElement.style.caretColor = "transparent";
                    inputElement.style.border = "none";
                    inputElement.style.outline = "none";
                    inputElement.style.boxShadow = "none";
                    inputElement.style.textAlign = "center";
                    inputElement.style.direction = "rtl";
                    inputElement.focus();
                    inputElement.addEventListener("input", () => {
                        if (inputElement.value.length === 10) {
                            Swal.close();
                            processScan(inputElement.value);
                        }
                    });
                }
            },
        });
    };
    const processScan = async (rfidCard) => {
        try {
            if (!rfidCard || rfidCard.length !== 10) {
                Swal.fire({
                    title: "Error",
                    text: "Card ID must be 10 characters long!",
                    icon: "error",
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                openScanModal();
                return;
            }
            const statusResponse = await axios.get(`${domain}/api/check-status/${rfidCard}/`);
            if (statusResponse.data.status === "Deactivated") {
                await Swal.fire({
                    title: "Error",
                    text: "This card is already deactivated.",
                    icon: "error",
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                openScanModal();
                return;
            }
            const cardsResponse = await axios.get(`${domain}/api/list-cards/`);
            const cardData = cardsResponse.data.find((card) => card.card_id === rfidCard);
            if (!cardData) {
                throw new Error("Card not found.");
            }

            const localDate = new Date();
            const formattedDate = localDate.toISOString().split("T")[0];
            const formattedTime = localDate.toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
            
            const deactivateResponse = await axios.post(`${domain}/api/deactivate/${rfidCard}/`, {
                deactivated_date: formattedDate,
                deactivated_time: formattedTime,
                office_name: cardData.office_name,
            });

            if (!deactivateResponse.data.success) {
                throw new Error(deactivateResponse.data.message || "Deactivation failed.");
            }
            await Swal.fire({
                title: "Success!",
                html: `
                        <div style="text-align: center;">
                            <h2 style="font-size: 28px; font-weight: bold; color: #28a745; margin-bottom: 10px;">
                                Welcome to the Island
                            </h2>
                            <p style="font-size: 20px; font-weight: 500; color: #333;">
                                Office Name: <strong>${cardData.office_name}</strong>
                            </p>
                        </div>
                    `,
                icon: "success",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            const updatedCardsResponse = await axios.get(`${domain}/api/list-cards/`);
            setCards(updatedCardsResponse.data);

            openScanModal();

        } catch (error) {
            console.error("Error:", error);
            await Swal.fire({
                title: "Error",
                text: error.message || "An error occurred.",
                icon: "error",
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            openScanModal();
        }
    };

    openScanModal();
};
