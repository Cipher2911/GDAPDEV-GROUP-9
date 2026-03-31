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
                Swal.fire({
                    icon: 'warning',
                    title: 'Incomplete Fields',
                    text: 'Please fill out all required fields before proceeding.',
                    confirmButtonColor: '#007bff'
                });
            }
        });
    }
});

//Sign-in Functions
document.addEventListener("DOMContentLoaded", function() {

    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            
            const name = document.getElementById("name").value.trim(); 
            const username = document.getElementById("username").value.trim(); 
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            const email = document.getElementById("email").value.trim();
            const dlsu_id = document.getElementById("dlsu_id").value.trim();
        
            const errorDiv = document.getElementById("client-error");
            const serverErrorDiv = document.querySelector(".warning-login:not(#client-error)");
            
            let errors = [];

            if (password !== confirmPassword) {
                errors.push("Passwords do not match.");
            }

            if (!email.toLowerCase().endsWith("@dlsu.edu.ph")) {
                errors.push("Please use a valid @dlsu.edu.ph email address.");
            }

            const idRegex = /^\d{8}$/;
            if (!idRegex.test(dlsu_id)) {
                errors.push("DLSU ID must be exactly 8 digits.");
            }

            if (errors.length > 0) {
                event.preventDefault(); 
                
                if (serverErrorDiv) {
                    serverErrorDiv.style.display = "none";
                }

                errorDiv.innerHTML = errors.join("<br>");
                errorDiv.style.display = "block";

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                event.preventDefault();
                errorDiv.style.display = "none";

                Swal.fire({
                    title: 'Create Account',
                    text: "Are you sure all the provided details are correct?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#28a745', 
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, create my account!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Submit the form manually after confirmation
                        signupForm.submit();
                    }
                });
            }
        });
    }
});

// Log Out Confirmation
document.addEventListener("DOMContentLoaded", function() {
    const logoutLink = document.getElementById("logout-link");

    if (logoutLink) {
        logoutLink.addEventListener("click", function(event) {
            event.preventDefault(); 
            const targetUrl = this.href; 

            Swal.fire({
                title: 'Leaving so soon?',
                text: "Are you sure you want to log out?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Log Out'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = targetUrl;
                }
            });
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

//Reserve This Spot Button 
$(document).on("click", ".reserve_spot", async function(){

    const btn = $(this); 

    const confirm = await Swal.fire({
        title: 'Confirm Reservation',
        text: "Are you sure you want to reserve this spot?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Reserve'
    });

    if (!confirm.isConfirmed) {
        return; 
    }

    const lab_details = {
        date: btn.data("date"),
        time: btn.data("time"),
        lab_id: btn.data("lab"),
        station: btn.data("station"),
        is_anonymous: $("#anon-checkbox").is(":checked")
    }; 

    try {
        const response = await fetch('/api/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lab_details)
        });
        
        const result = await response.json();

        if (result.success) {
            
            Swal.fire({
                icon: 'success',
                title: 'Spot Reserved!',
                html: `Station: <b>${lab_details.station}</b><br>Time: <b>${lab_details.time}</b><br><br>${result.message}`,
                confirmButtonColor: '#007bff'
            }).then(() => {
                if (window.location.pathname.includes('/search')) {
                    document.querySelector('.search-btn').click(); 
                } else {
                    renderLabTables(); 
                }
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.message || "Failed to reserve spot. You might not be logged in.",
                confirmButtonColor: '#007bff'
            });
        }
    } catch (error) {
        console.error("Error making reservation:", error);
        Swal.fire('Error', 'An error occurred while communicating with the database.', 'error');
    }
});

// Cancel Spot Button
$(document).on("click", ".cancel_spot", async function() {

    const btn = $(this);
    const targetUser = btn.data("username"); 
    
    const confirmMsg = targetUser 
        ? `Are you sure you want to cancel the reservation for ${targetUser}?` 
        : "Are you sure you want to cancel this reservation?";
        
    const confirm = await Swal.fire({
        title: 'Cancel Reservation?',
        text: confirmMsg,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Confirm'
    });

    if(!confirm.isConfirmed) return;

    const lab_details = {
        date: btn.data("date"),
        time: btn.data("time"),
        lab_id: btn.data("lab"),
        station: btn.data("station"),
        targetUsername: targetUser 
    };

    try {
        const response = await fetch('/api/cancel', {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lab_details)
        });
        
        const result = await response.json();

        if (result.success) {
            Swal.fire('Cancelled!', result.message, 'success').then(() => {
                if (window.location.pathname.includes('/search')) {
                    document.querySelector('.search-btn').click(); 
                } else if(window.location.pathname.includes('/my-reservations') || window.location.pathname.includes('/profile')){
                    fetchAndRenderUserReservations(); 
                } else if(window.location.pathname.includes('/admin_view')) {
                    fetchAndRenderAdminDashboard();
                } else {
                    renderLabTables();
                }
            });
        } else {
            Swal.fire('Error', result.message || "Failed to cancel reservation.", 'error');
        }
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        Swal.fire('Error', 'An error occurred while communicating with the database.', 'error');
    }
});

//For Admin Features
function showAdminLabTable() {
    const select = document.getElementById("admin-lab-select");
    if(!select) return;
    
    const val = select.value;
    
    document.querySelectorAll(".lab-section").forEach(el => el.classList.add("hidden"));

    if (val === "A") document.getElementById("admin-table-lab-a").classList.remove("hidden");
    else if (val === "B") document.getElementById("admin-table-lab-b").classList.remove("hidden");
    else if (val === "Mac A") document.getElementById("admin-table-mac-lab-a").classList.remove("hidden");
    else if (val === "C") document.getElementById("admin-table-lab-c").classList.remove("hidden");
    else if (val === "Mac B") document.getElementById("admin-table-mac-lab-b").classList.remove("hidden");
}

function filterAdminTables() {
    const input = document.getElementById("admin-filter-input");
    if (!input) return;
    
    const filterText = input.value.toLowerCase();
    const tableRows = document.querySelectorAll(".lab-section tbody tr");

    tableRows.forEach(row => {
        if (row.cells.length === 1) return;

        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(filterText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

async function fetchAndRenderAdminDashboard() {
    try {
        const response = await fetch('/api/all-reservations');
        const reservations = await response.json();
    
        const activeReservations = reservations.filter(res => res.status === "Reserved");

        const labIds = ["lab-a", "lab-b", "mac-lab-a", "lab-c", "mac-lab-b"];

        labIds.forEach(id => {
            const tbody = document.getElementById(`admin-body-${id}`);
            if (tbody) tbody.innerHTML = "";
        });

        activeReservations.forEach(slot => {
            const tbody = document.getElementById(`admin-body-${slot.lab_id}`);
            if (tbody) {
                const actionBtn = `<button class="cancel_spot cancel-btn" 
                    data-date="${slot.date}" 
                    data-time="${slot.time}" 
                    data-lab="${slot.lab_id}" 
                    data-station="${slot.station}"
                    data-username="${slot.username}">Admin Cancel</button>`;

                const row = `
                    <tr>
                        <td><a href="/profile?user=${slot.username}">${slot.username}</a></td>
                        <td>${slot.date}</td>
                        <td>${slot.time}</td>
                        <td>${slot.station}</td>
                        <td class="center-text">${actionBtn}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            }
        });

        labIds.forEach(id => {
            const tbody = document.getElementById(`admin-body-${id}`);
            if (tbody && tbody.innerHTML === "") {
                tbody.innerHTML = `<tr><td colspan="5" class="center-text">No active reservations.</td></tr>`;
            }
        });

        filterAdminTables();

    } catch (error) {
        console.error("Error fetching admin reservations:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('admin-lab-select')) {
        fetchAndRenderAdminDashboard();
    }
});

//For Reserve Page 
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

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const bookings = await response.json();

            tbody.innerHTML = ""; 

            bookings.forEach(booking => {
                let userDisplay = "-";

                if (booking.status === "Reserved") {
                    
                    if (booking.is_anonymous) {
                        if (booking.isAdmin || booking.isMine) {
                            userDisplay = `<a href="/profile?user=${booking.username}">${booking.username}</a> <span style="font-size:0.8em; color:gray;">(Anon)</span>`;
                        } else {
                            userDisplay = `<em>Anonymous</em>`;
                        }
                    } else if (booking.username) {
                        userDisplay = `<a href="/profile?user=${booking.username}">${booking.username}</a>`;
                    } else {
                        userDisplay = `<em>Anonymous</em>`;
                    }
                }

                let buttonHtml = "";
                if (booking.status === "Available") {
                    buttonHtml = `<button class="reserve_spot reserve-btn" 
                        data-date="${booking.date}" 
                        data-time="${booking.time}" 
                        data-lab="${booking.lab_id}" 
                        data-station="${booking.station}">Reserve This Spot</button>`;
                } else if (booking.status === "Reserved" && booking.isMine) {
                    buttonHtml = `<button class="reserve_spot reserved-btn" 
                        data-date="${booking.date}" 
                        data-time="${booking.time}" 
                        data-lab="${booking.lab_id}" 
                        data-station="${booking.station}">Reserved</button>`;
                } else {
                    buttonHtml = `<button class="unavailable">Unavailable</button>`;
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
            tbody.innerHTML = `<tr><td colspan='5' style='color: red; text-align: center;'>Failed to load reservations.</td></tr>`;
            
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'We encountered an error loading the lab reservations. Please try refreshing the page.',
                confirmButtonColor: '#007bff'
            });
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

//For Search Page 
async function fetchAndRenderSlots(labFilter = "all", dateFilter = "", timeFilter = "") {
    try {
        const response = await fetch('/api/search-slots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lab: labFilter,
                date: dateFilter,
                time: timeFilter
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const availableSlots = await response.json();
      
        renderTable(availableSlots);

    } catch (error) {
        console.error("Error fetching filtered slots:", error);
        const tableBody = document.getElementById('results-body');
        if (tableBody) {
            tableBody.innerHTML = "<tr><td colspan='5' style='color: red; text-align: center;'>Failed to load slots. Please try again.</td></tr>";
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Search Failed',
            text: 'We encountered an error connecting to the database.',
            confirmButtonColor: '#007bff'
        });
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

    const labNames = {
        "lab-a": "Computer Lab A",
        "lab-b": "Computer Lab B",
        "mac-lab-a": "Mac Lab A", 
        "lab-c": "Computer Lab C", 
        "mac-lab-b": "Mac Lab B"
    };

    data.forEach(slot => {
        let actionBtn = "";
       
        if (slot.status === "Available") {
            actionBtn = `<button class="reserve_spot reserve-btn" 
                data-date="${slot.date}" 
                data-time="${slot.time}" 
                data-lab="${slot.lab_id}" 
                data-station="${slot.station}">Reserve</button>`;
        } else if (slot.isMine) {
            actionBtn = `<button class="reserve_spot reserved-btn" 
                data-date="${slot.date}" 
                data-time="${slot.time}" 
                data-lab="${slot.lab_id}" 
                data-station="${slot.station}">Reserved</button>`;
        }

        const row = `
            <tr>
                <td>${slot.date}</td>
                <td>${slot.time}</td>
                <td>${labNames[slot.lab_id] || slot.lab_id}</td>
                <td>${slot.station}</td>
                <td class="center-text">
                    ${actionBtn}
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function filterSlots() {

    const selectedLab = document.getElementById('search-lab')?.value || "all";
    let selectedDate = document.getElementById('search-date')?.value || "";
    let selectedTime = document.getElementById('search-time')?.value || "";

    let formattedDate = "";
    let formattedTime = "";

    if (selectedDate) {
        const dateObj = new Date(selectedDate);
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        formattedDate = dateObj.toLocaleDateString('en-US', options); 
    }

    if (selectedTime) {
        let [hours, minutes] = selectedTime.split(':');
        let hoursInt = parseInt(hours, 10);
        let ampm = hoursInt >= 12 ? 'PM' : 'AM';
        hoursInt = hoursInt % 12 || 12; 
        formattedTime = `${hoursInt}:${minutes} ${ampm}`;
    }

    fetchAndRenderSlots(selectedLab, formattedDate, formattedTime);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('results-body')) {
        fetchAndRenderSlots("all");
    }
});

//For View Profile Page
async function fetchAndRenderProfile() {
    const tableBody = document.getElementById('user-profile-body');
    if (!tableBody) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const userKey = urlParams.get('user');

    try {
        const response = await fetch('/api/all-reservations');
        const reservations = await response.json();
      
        const profileReservations = reservations.filter(res => res.username === userKey && res.status === "Reserved");

        tableBody.innerHTML = ""; 

        if (profileReservations.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4' class='center-text'>No active reservations.</td></tr>";
            return;
        }

        const labNames = {
            "lab-a": "Computer Lab A",
            "lab-b": "Computer Lab B",
            "mac-lab-a": "Mac Lab A", 
            "lab-c": "Computer Lab C", 
            "mac-lab-b": "Mac Lab B"
        };

        profileReservations.forEach(slot => {
            const row = `
                <tr>
                    <td>${slot.date}</td>
                    <td>${slot.time}</td>
                    <td>${labNames[slot.lab_id] || slot.lab_id}</td>
                    <td>${slot.station}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error fetching user reservations:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-profile-body')) {
        fetchAndRenderProfile();
    }
});

//For View Reservations Page 
async function fetchAndRenderUserReservations() {
    const tableBody = document.getElementById('user-reservations-body');
    if (!tableBody) return; 

    try {
        const response = await fetch('/api/all-reservations');
        const reservations = await response.json();
        
        const myReservations = reservations.filter(res => res.isMine && res.status === "Reserved");

        tableBody.innerHTML = ""; 

        if (myReservations.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5' class='center-text'>You have no active reservations.</td></tr>";
            return;
        }

        const labNames = {
            "lab-a": "Computer Lab A",
            "lab-b": "Computer Lab B",
            "mac-lab-a": "Mac Lab A", 
            "lab-c": "Computer Lab C", 
            "mac-lab-b": "Mac Lab B"
        };

        myReservations.forEach(slot => {
            const actionBtn = `<button class="cancel_spot cancel-btn" 
                data-date="${slot.date}" 
                data-time="${slot.time}" 
                data-lab="${slot.lab_id}" 
                data-station="${slot.station}">Cancel</button>`;

            const row = `
                <tr>
                    <td>${slot.date}</td>
                    <td>${slot.time}</td>
                    <td>${labNames[slot.lab_id] || slot.lab_id}</td>
                    <td>${slot.station}</td>
                    <td class="center-text">${actionBtn}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error fetching user reservations:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('user-reservations-body')) {
        fetchAndRenderUserReservations();
    }
});

//Delete Profile Button 
$(document).on("click", ".delete-profile-btn", async function() {
    
    const confirm = await Swal.fire({
        title: 'Are you absolutely sure?',
        text: "This action cannot be undone, and all your current reservations will be cancelled.",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#8b0000',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete my profile'
    });
    
    if (!confirm.isConfirmed) return;

    try {
        const response = await fetch('/api/user/delete', {
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();

        if (result.success) {
            await Swal.fire('Deleted!', 'Your profile has been permanently deleted.', 'success');
            window.location.href = "/";
        } else {
            Swal.fire('Error', result.message || "Failed to delete profile.", 'error');
        }
    } catch (error) {
        console.error("Error deleting profile:", error);
        Swal.fire('Error', 'An error occurred while communicating with the server.', 'error');
    }
});
