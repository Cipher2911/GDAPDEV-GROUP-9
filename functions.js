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
    const reservationForm = document.querySelector("form");

    if (reservationForm) {
        reservationForm.addEventListener("submit", function(event) {
            let isValid = true;
            const inputs = reservationForm.querySelectorAll("input, select, textarea");

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

//Show Table for Laboratories 

function showLabTable() {
    var selector = document.getElementById("lab-select");
    var selectedLab = selector.value;

    document.getElementById("table-lab-a").style.display = "none";
    document.getElementById("table-lab-b").style.display = "none";
    document.getElementById("table-mac-lab").style.display = "none";

    if (selectedLab === "A") {
        document.getElementById("table-lab-a").style.display = "block";
    } else if (selectedLab === "B") {
        document.getElementById("table-lab-b").style.display = "block";
    } else if (selectedLab === "Mac") {
        document.getElementById("table-mac-lab").style.display = "block";
    }
}

//Link to a User 
$(document).ready(function() {
    if (window.location.pathname.includes("user_profile.html")) {
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
$(document).ready(function(){
    $(".reserve-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "green"); 
        $(this).text("Reserved");
        alert("Spot Reserved!"); 
    }); 
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








