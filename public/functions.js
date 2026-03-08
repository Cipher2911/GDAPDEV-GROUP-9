//Sample User Data

const userData = {
    "felix": {
        name: "Felix Kjellberg",
        id: "12423456",
        college: "College of Science",
        email: "pewds@dlsu.edu.ph",
        avatar: "FK",
        reservation: { location: "Science Bldg", station: "PC-02", time: "9:00 AM - 10:00 AM" }
    },
    "mark": {
        name: "Mark Fishbach",
        id: "12498765",
        college: "Gokongwei College of Engineering",
        email: "markiplier@dlsu.edu.ph",
        avatar: "MF",
        reservation: { location: "Science Bldg", station: "PC-03", time: "9:00 AM - 10:00 AM" }
    },
    "hermione": {
        name: "Hermione Granger",
        id: "12400001",
        college: "College of Business",
        email: "h.granger@dlsu.edu.ph",
        avatar: "HG",
        reservation: { location: "Library", station: "LIB-01", time: "10:00 AM - 11:00 AM" }
    },
    "marques": {
        name: "Marques Brownlee",
        id: "12454433",
        college: "College of Computer Studies",
        email: "mkbhd@dlsu.edu.ph",
        avatar: "MB",
        reservation: { location: "Design Dept", station: "MAC-01", time: "9:00 AM - 10:00 AM" }
    },
    "linus": {
        name: "Linus Sebastian",
        id: "12447788",
        college: "College of Computer Studies",
        email: "linus@dlsu.edu.ph",
        avatar: "LS",
        reservation: { location: "Design Dept", station: "MAC-02", time: "9:00 AM - 10:00 AM" }
    }
};


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
$(document).ready(function() {
    if (window.location.pathname.includes("/profile")) {
        const urlParams = new URLSearchParams(window.location.search);
        const userKey = urlParams.get('user');

        if (userKey && userData[userKey]) {
            const user = userData[userKey];
            
            $('#name').text(user.name);
            $('#id_number').text(user.id);
            $('#college').text(user.college);
            $('#email').text(user.email);
            $('#display-avatar').text(user.avatar);

            $('#location').text(user.reservation.location);
            $('#laboratory').text(user.reservation.station);
            $('#time').text(user.reservation.time);
            $('.status-reserved').text("Confirmed");
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

$(document).ready(function() {
    statusColor(); 
});


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
    alert("Spot Reserved!"); 
});

//Submit Button for Log-in 
$(document).ready(function(){
    $(".submit-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "darkblue"); 
    }); 
}); 

//Reserve this Spot Button 
$(document).ready(function(){

    $(".reserve_spot").each(function(){
        var text = $(this).text().trim();
        
        if(text === "Reserve This Spot") {
            $(this).css("background-color", "blue"); 
            $(this).css("cursor", "pointer");
            $(this).css("color", "white"); 
        } else { 
            $(this).css("cursor", "not-allowed");
            $(this).css("background-color", "lightgray");
            $(this).css("color", "black");
        }
    });

    $(".reserve_spot").click(function(){
        var currentText = $(this).text().trim();

        if(currentText === "Reserve This Spot"){
           
            alert("Spot Reserved!");

            $(this).text("Unavailable");
            $(this).css("background-color", "lightgray");
            $(this).css("color", "black"); 
            $(this).css("cursor", "not-allowed");

            $(this).closest("tr").find(".status").text("Reserved");

            statusColor(); 

        } else {
            alert("This Spot is Already Reserved.");
        }
    });

});

//For Lab Table

const labData = {
    "A": [
        { time: "9:00 AM - 10:00 AM", station: "PC-01", status: "Available", user: null, link: null },
        { time: "9:00 AM - 10:00 AM", station: "PC-02", status: "Reserved", user: "Felix Kjellberg", link: "/profile?user=felix" },
        { time: "9:00 AM - 10:00 AM", station: "PC-03", status: "Reserved", user: "Mark Fishbach", link: "/profile?user=mark" }
    ],
    "B": [
        { time: "9:00 AM - 10:00 AM", station: "LIB-01", status: "Reserved", user: "Anonymous", link: null },
        { time: "9:00 AM - 10:00 AM", station: "LIB-02", status: "Available", user: null, link: null },
        { time: "10:00 AM - 11:00 AM", station: "LIB-01", status: "Reserved", user: "Hermione G.", link: "/profile?user=hermione" }
    ],
    "Mac": [
        { time: "9:00 AM - 10:00 AM", station: "MAC-01", status: "Reserved", user: "M. Brownlee", link: "/profile?user=marques" },
        { time: "9:00 AM - 10:00 AM", station: "MAC-02", status: "Reserved", user: "Linus S.", link: "/profile?user=linus" },
        { time: "10:00 AM - 11:00 AM", station: "MAC-01", status: "Available", user: null, link: null }
    ]
};


function renderLabTables() {
    
    const mapping = {
        "A": "body-lab-a",
        "B": "body-lab-b",
        "Mac": "body-mac-lab"
    };

    for (const [labKey, bookings] of Object.entries(labData)) {
        const tbody = document.getElementById(mapping[labKey]);
        if (!tbody) continue;

        tbody.innerHTML = ""; 

        bookings.forEach(booking => {
            
            let userDisplay = "-";
            if (booking.user) {
                if (booking.link) {
                    userDisplay = `<a href="${booking.link}">${booking.user}</a>`;
                } else {
                    userDisplay = `<em>${booking.user}</em>`;
                }
            }

            let buttonHtml = "";
            if (booking.status === "Available") {
                buttonHtml = `<button class="reserve_spot">Reserve This Spot</button>`;
            } else {
                buttonHtml = `<button class="reserve_spot" cursor:not-allowed">Unavailable</button>`;
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
    }
}

function showLabTable() {
   
    const selector = document.getElementById("lab-select");

    if (!selector) return; 

    const selectedValue = selector.value;

    const tableA = document.getElementById("table-lab-a");
    const tableB = document.getElementById("table-lab-b");
    const tableMac = document.getElementById("table-mac-lab");

    if (tableA) tableA.classList.add("hidden");
    if (tableB) tableB.classList.add("hidden");
    if (tableMac) tableMac.classList.add("hidden");

    if (selectedValue === "A" && tableA) {
        tableA.classList.remove("hidden");
    } else if (selectedValue === "B" && tableB) {
        tableB.classList.remove("hidden");
    } else if (selectedValue === "Mac" && tableMac) {
        tableMac.classList.remove("hidden");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderLabTables();
    showLabTable(); 
});

//For Searching Slots
const availableSlots = [
    { 
        date: "Oct 25, 2023", 
        time: "10:00 AM - 10:30 AM", 
        labName: "Computer Lab A", 
        labId: "lab-a", 
        station: "PC-04" 
    },
    { 
        date: "Oct 25, 2023", 
        time: "10:30 AM - 11:00 AM", 
        labName: "Computer Lab A", 
        labId: "lab-a",
        station: "PC-04" 
    },
    { 
        date: "Oct 25, 2023", 
        time: "2:00 PM - 2:30 PM", 
        labName: "Mac Lab", 
        labId: "mac-lab",
        station: "MAC-01" 
    },
    { 
        date: "Oct 26, 2023", 
        time: "9:00 AM - 9:30 AM", 
        labName: "Computer Lab B", 
        labId: "lab-b",
        station: "LIB-03" 
    }
];

function renderTable(data) {
    const tableBody = document.getElementById('results-body');
    tableBody.innerHTML = ""; 

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5' class='center-text'>No slots found</td></tr>";
        return;
    }

    data.forEach(slot => {
        const row = `
            <tr>
                <td>${slot.date}</td>
                <td>${slot.time}</td>
                <td>${slot.labName}</td>
                <td>${slot.station}</td>
                <td class="center-text">
                    <button class="reserve-btn">Reserve</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function filterSlots() {
    const selectedLab = document.getElementById('search-lab').value;
    
    if (selectedLab === "all") {
        renderTable(availableSlots);
    } else {
        const filteredData = availableSlots.filter(slot => slot.labId === selectedLab);
        renderTable(filteredData);
    }
    
    alert(`Search complete! Showing results for: ${selectedLab}`);
}

function reserveStation(stationId) {
    alert(`You have successfully reserved station: ${stationId}`);
}
    
document.addEventListener('DOMContentLoaded', () => {
    renderTable(availableSlots);
});








