const userData = {
    "felix": {
        name: "Felix Kjellberg",
        id: "12423456",
        college: "College of Science",
        email: "pewds@university.edu",
        avatar: "FK",
        reservation: { location: "Science Bldg", station: "PC-02", time: "9:00 AM - 10:00 AM" }
    },
    "mark": {
        name: "Mark Fishbach",
        id: "12498765",
        college: "Gokongwei College of Engineering",
        email: "markiplier@university.edu",
        avatar: "MF",
        reservation: { location: "Science Bldg", station: "PC-03", time: "9:00 AM - 10:00 AM" }
    },
    "hermione": {
        name: "Hermione Granger",
        id: "12400001",
        college: "College of Business",
        email: "h.granger@university.edu",
        avatar: "HG",
        reservation: { location: "Library", station: "LIB-01", time: "10:00 AM - 11:00 AM" }
    },
    "marques": {
        name: "Marques Brownlee",
        id: "12454433",
        college: "College of Computer Studies",
        email: "mkbhd@university.edu",
        avatar: "MB",
        reservation: { location: "Design Dept", station: "MAC-01", time: "9:00 AM - 10:00 AM" }
    },
    "linus": {
        name: "Linus Sebastian",
        id: "12447788",
        college: "College of Computer Studies",
        email: "linus@university.edu",
        avatar: "LS",
        reservation: { location: "Design Dept", station: "MAC-02", time: "9:00 AM - 10:00 AM" }
    }
};

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

$(document).ready(function() {
    if (window.location.pathname.includes("user_profile.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const userKey = urlParams.get('user');

        if (userKey && userData[userKey]) {
            const user = userData[userKey];
            
            // Fill Profile Card
            $('#name').text(user.name);
            $('#id_number').text(user.id);
            $('#college').text(user.college);
            $('#email').text(user.email);
            $('#display-avatar').text(user.avatar);

            // Fill Reservation Table
            $('#location').text(user.reservation.location);
            $('#laboratory').text(user.reservation.station);
            $('#time').text(user.reservation.time);
            $('.status-reserved').text("Confirmed");
        } else {
            $('#name').text("User Not Found");
        }
    }
}); 

function statusColor(){

    var statusWord = $(".status"); 

    for(var i = 0; i < statusWord.length; i++){
        
        var currentText = statusWord[i].innerText; 

        if (currentText === "Available") {
            statusWord[i].style.color = "green";
        } else if (currentText === "Reserved") {
            statusWord[i].style.color = "orange";
        } else {
            statusWord[i].style.color = "#333"
        }
    }
}

$(document).ready(function(){
    $(".action-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "blue"); 
    }); 
});

$(document).ready(function(){
    $(".submit-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "darkblue"); 
    }); 
}); 

$(document).ready(function(){
    $(".submit-btn").click(function(){
        $(this).css("color", "white"); 
        $(this).css("background-color", "darkblue"); 
    }); 
}); 

$(document).ready(function(){

    $(".reserve_spot").click(function(){

        var currentText = $(this).text().trim(); 
        
        if(currentText === "Reserve This Spot"){
            alert("Spot Reserved!");
            $(this).text("Unavailable");
        } else {
            alert("This Spot is Already Reserved.")
            $(this).css("cursor", "not-allowed");
        }
    }); 

}); 








