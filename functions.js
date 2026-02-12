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