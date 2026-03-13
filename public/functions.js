//Log In Functions 
document.addEventListener("DOMContentLoaded", function() {
    
    const searchForm = document.getElementById("search-form");

    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            let isValid = true;
            const inputs = searchForm.querySelectorAll("input, select, textarea");

            inputs.forEach(input => {
                input.style.borderColor = "";
                if (input.value.trim() === "") {
                    isValid = false;
                    input.style.borderColor = "red"; 
                }
            });

            if (!isValid) {
                event.preventDefault();
                alert("Please fill out all required fields before proceeding.");
            }
        });
    }
});

//Link to a User 
$(document).ready(async function() {
    if (window.location.pathname.includes("/profile")) {
        const urlParams = new URLSearchParams(window.location.search);
        const userKey = urlParams.get('user'); 

        if (userKey) {
            try {
                const response = await fetch(`/api/users/${userKey}`);
                
                if (!response.ok) {
                    throw new Error("User not found in database");
                }

                const data = await response.json();
                const user = data.user;
                const reservation = data.reservation;
                
                // User Details
                $('#name').text(user.name);
                $('#id_number').text(user.dlsu_id); 
                $('#college').text(user.college);
                $('#email').text(user.email);
                $('#display-avatar').text(user.avatar);

                // Reservation Details
                if (reservation) {
                    $('#location').text(reservation.lab_id); 
                    $('#laboratory').text(reservation.station);
                    $('#time').text(reservation.time);
                    $('.status-reserved').text("Confirmed").css("color", "green");
                } else {
                    $('#location').text("N/A");
                    $('#laboratory').text("N/A");
                    $('#time').text("N/A");
                    $('.status-reserved').text("No active reservations").css("color", "gray");
                }

            } catch (error) {
                console.error(error);
                $('#name').text("User Not Found");
            }
        } else {
            $('#name').text("User Not Found");
        }
    }
});

//Status Color for Reserved, Available or Unavailable 
function statusColor(){

   $(".status").each(function() {
        var currentText = $(this).text().trim(); 

        if (currentText === "Available") {
            $(this).css("color", "green");
        } else if (currentText === "Reserved") {
            $(this).css("color", "orange");
        } else {
            $(this).css("color", "#333");
        }
    });
}

//For Home Page 
$(document).ready(function(){
    $(".action-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "blue"); 
    }); 
});

//Reserve Button 
$(document).on("click", ".reserve-btn", function(){
    $(this).css("color", "white"); 
    $(this).css("background-color", "green"); 
    $(this).text("Reserved");
});

//Submit Button for Log-in 
$(document).ready(function(){
    $(".submit-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "darkblue"); 
    }); 
}); 

//Reserve This Spot Button 
$(document).on("click", ".reserve_spot", function() {
    var currentText = $(this).text().trim();

    if(currentText === "Reserve This Spot") {

        $(this).text("Unavailable");
        $(this).css({
            "background-color": "lightgray",
            "color": "black",
            "cursor": "not-allowed"
        });
        
        $(this).closest("tr").find(".status").text("Reserved");

        if (typeof statusColor === "function") {
            statusColor();
        }

    } else {
        alert("This Spot is Already Reserved.");
    }
});


async function renderLabTables() {
    
    const mapping = {
        "lab-a": "body-lab-a",
        "lab-b": "body-lab-b",
        "mac-lab-a": "body-mac-lab-a", 
        "lab-c": "body-lab-c", 
        "mac-lab-b": "body-mac-lab-b"
    };

    for (const [labId, tbodyId] of Object.entries(mapping)) {

        const tbody = document.getElementById(tbodyId);
        if (!tbody) continue;

        try {
            const response = await fetch(`/api/reservations/${labId}`);
            const bookings = await response.json();

            tbody.innerHTML = ""; 

            bookings.forEach(booking => {
                let userDisplay = "-";

                if (booking.status === "Reserved" && booking.username) {
                    userDisplay = `<a href="/profile?user=${booking.username}">${booking.username}</a>`;
                } else if (booking.status === "Reserved") {
                    userDisplay = `<em>Anonymous</em>`;
                }

                let buttonHtml = "";
                if (booking.status === "Available") {
                    buttonHtml = `<button class="reserve_spot" style="background-color: blue; color: white; cursor: pointer;">Reserve This Spot</button>`;
                } else {
                    buttonHtml = `<button class="reserve_spot" style="background-color: lightgray; color: black; cursor: not-allowed;">Unavailable</button>`;
                }

                const row = `
                    <tr>
                        <td>${booking.time}</td>
                        <td>${booking.station}</td>
                        <td class="status">${booking.status}</td>
                        <td>${userDisplay}</td>
                        <td>${buttonHtml}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        } catch (error) {
            console.error(`Error loading lab data for ${labId}:`, error);
        }
    }

    statusColor();  
}

function showLabTable() {
   
    const selector = document.getElementById("lab-select");

    if (!selector) return; 

    const selectedValue = selector.value;

    const tableA = document.getElementById("table-lab-a");
    const tableB = document.getElementById("table-lab-b");
    const tableMacA = document.getElementById("table-mac-lab-a");
    const tableC = document.getElementById("table-lab-c"); 
    const tableMacB = document.getElementById("table-mac-lab-b")

    if (tableA) tableA.classList.add("hidden");
    if (tableB) tableB.classList.add("hidden");
    if (tableMacA) tableMacA.classList.add("hidden");
    if (tableC) tableC.classList.add("hidden"); 
    if (tableMacB) tableMacB.classList.add("hidden"); 

    if (selectedValue === "A" && tableA) {
        tableA.classList.remove("hidden");
    } else if (selectedValue === "B" && tableB) {
        tableB.classList.remove("hidden");
    } else if (selectedValue === "Mac A" && tableMacA) {
        tableMacA.classList.remove("hidden");
    } else if (selectedValue === "C" && tableC) {
        tableC.classList.remove("hidden");
    } else if (selectedValue === "Mac B" && tableMacB) {
        tableMacB.classList.remove("hidden");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderLabTables();
    showLabTable(); 
});

async function fetchAndRenderSlots(labFilter = "all", dateFilter = "", timeFilter = "") {
    try {
        const response = await fetch('/api/all-reservations');
        const reservations = await response.json();
        
        let available = reservations.filter(res => res.status === "Available");
        
        if (labFilter !== "all") {
            available = available.filter(res => res.lab_id === labFilter);
        }
       
        if (dateFilter !== "") {
            available = available.filter(res => res.date === dateFilter);
        }

        if (timeFilter !== "") {
            available = available.filter(res => res.time.includes(timeFilter));
        }
        
        renderTable(available);
    } catch (error) {
        console.error("Error fetching slots:", error);
    }
}

function renderTable(data) {
    const tableBody = document.getElementById('results-body');
    if (!tableBody) return; 
    
    tableBody.innerHTML = ""; 

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5' class='center-text'>No slots found</td></tr>";
        return;
    }

    // Map DB lab_id to friendly names for the search table
    const labNames = {
        "lab-a": "Computer Lab A",
        "lab-b": "Computer Lab B",
        "mac-lab-a": "Mac Lab A", 
        "lab-c": "Computer Lab C", 
        "mac-lab-b": "Mac Lab B"
    };

    data.forEach(slot => {
        const row = `
            <tr>
                <td>${slot.date}</td>
                <td>${slot.time}</td>
                <td>${labNames[slot.lab_id] || slot.lab_id}</td>
                <td>${slot.station}</td>
                <td class="center-text">
                    <button class="reserve-btn">Reserve</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

//Helper Function for Searching by Time 
function formatSearchDate(dateString) {
    if (!dateString) return "";
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const parts = dateString.split('-');
    
    if(parts.length !== 3) return dateString;
    
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10); 

    return `${month} ${day}, ${year}`;
}

//Helper Function for Searching by Time 
function formatSearchTime(timeString) {
    if (!timeString) return "";
    
    const parts = timeString.split(':');
    if (parts.length !== 2) return timeString;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    return `${hours}:${minutes} ${ampm}`; 
}

function filterSlots() {

    const selectedLab = document.getElementById('search-lab')?.value || "all";
    const selectedDate = document.getElementById('search-date')?.value || "";
    const selectedTime = document.getElementById('search-time')?.value || "";

    const formattedDate = formatSearchDate(selectedDate); 
    const formattedTime = formatSearchTime(selectedTime); 

    fetchAndRenderSlots(selectedLab, selectedDate, selectedTime);
    
    alert(`Search complete! Showing results for: ${selectedLab}`);
}

// Ensure the tables load when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('results-body')) {
        fetchAndRenderSlots("all");
    }
});

// Alert Reserve buttons
$(document).on('click', '.reserve_spot, .reserve-btn', function() {

    const row = $(this).closest('tr');
    const time = row.find('td:eq(0)').text();
    const station = row.find('td:eq(1)').text(); 

    // Trigger the alert
    alert(`Spot Reserved!\n\nStation: ${station}\nTime: ${time}\n`);
});



