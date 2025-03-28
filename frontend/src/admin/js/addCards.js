import Swal from 'sweetalert2';
import { domain } from '../../utils';

import axios from "axios";

const handleAddButtonClick = (setCards) => {
    Swal.fire({
        title: "Activate New Card",
        html: `
                <form id="add-item-form" class="space-y-4 text-left">
                    <div>
                    <label for="cardID" class="block text-sm font-medium text-gray-700">Card ID</label>
                    <input type="text" id="cardID" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Scan Card ID" required />
                    </div>

                    <div>
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
                        <option value="">Select Status</option>
                        <option value="Activated">Activated</option>
                        <option value="Deactivated">Deactivated</option>
                    </select>
                    </div>

                    <div>
                    <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
                    <select id="type" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" required>
                        <option value="">Select Type</option>
                        <option value="VIP">VIP</option>
                        <option value="Regular">Regular</option>
                    </select>
                    </div>

                    <div id="officeNameContainer" style="display: none;">
                    <label for="office_name" class="block text-sm font-medium text-gray-700">Office Name</label>
                    <input type="text" id="office_name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Enter Office Name" />
                    </div>
                </form>
            `,
        showCancelButton: true,
        confirmButtonText: "Add",
        cancelButtonText: "Cancel",
        focusConfirm: false,
        preConfirm: () => {
            const cardID = document.getElementById("cardID").value;
            const status = document.getElementById("status").value;
            const type = document.getElementById("type").value;
            const officeNameInput = document.getElementById("office_name");

            if (cardID.length !== 10) {
                Swal.showValidationMessage("Card ID must be exactly 10 characters.");
                return false;
            }
            if (!cardID || !status || !type || (type === "VIP" && (!officeNameInput || !officeNameInput.value.trim()))) {
                Swal.showValidationMessage("All fields are required!");
                return false;
            }
            return { card_id: cardID, status, type, office_name: officeNameInput ? officeNameInput.value : "" };
        },
        didOpen: () => {
            const cardIDInput = document.getElementById("cardID");
            const typeSelect = document.getElementById("type");
            const officeNameContainer = document.getElementById("officeNameContainer");
            typeSelect.addEventListener("change", () => {
                if (typeSelect.value === "VIP") {
                    officeNameContainer.style.display = "block";
                } else {
                    officeNameContainer.style.display = "none";
                }
            });

            cardIDInput.addEventListener("input", () => {
                setTimeout(() => {
                    if (cardIDInput.value.length === 10) {
                        console.log("Full Card ID scanned:", cardIDInput.value);
                        cardIDInput.disabled = true;
                    }
                }, 100);
            });

            cardIDInput.addEventListener("keyup", () => {
                console.log("Card ID on keyup:", cardIDInput.value);
                if (cardIDInput.value.length === 10) {
                    cardIDInput.disabled = true;
                }
            });
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const { card_id, status, type, office_name } = result.value;
            axios
                .post(`${domain}/api/cards/`, { card_id, status, type, office_name })
                .then((response) => {
                    const card = response.data;
                    const formattedCard = {
                        id: card.id,
                        card_id: card.card_id,
                        status: card.status,
                        type: card.type,
                        office_name: card.office_name || "",
                        date: card.created_date,
                        time: card.created_time,
                    };
                    console.log(`Formatted card: ${JSON.stringify(formattedCard)}`);

                    fetch(`${domain}/api/cards/`)
                        .then((response) => response.json())
                        .then((data) => setCards(data));

                    Swal.fire("Added!", "Your card has been added.", "success");
                })
                .catch((error) => {
                    console.error("Error:", error);
                    Swal.fire("Error!", "Failed to add card.", "error");
                });
        }
    });
};

export default handleAddButtonClick;