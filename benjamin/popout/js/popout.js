function suggestionAsValue() {
    var sLabel;
    sLabel = document.getElementById("suggest-label");
    sLabel.addEventListener("click", function () {
        document.getElementById("query").value = sLabel.innerHTML;
    });
}

function keyboardShortCutListener(e) {
    e.preventDefault();
    if (e.ctrlKey && e.altKey && e.keyCode === 77) {
        if (document.getElementById("chkmusic").checked === true) {
            document.getElementById("chkmusic").checked = false;
        } else {
            document.getElementById("chkmusic").checked = true;
        }
    } else if (e.ctrlKey && e.altKey && e.keyCode === 86) {
        if (document.getElementById("chkvideo").checked === true) {
            document.getElementById("chkvideo").checked = false;
        } else {
            document.getElementById("chkvideo").checked = true;
        }
    } else if (e.ctrlKey && e.altKey && e.keyCode === 66) {
        if (document.getElementById("chkbooks").checked === true) {
            document.getElementById("chkbooks").checked = false;
        } else {
            document.getElementById("chkbooks").checked = true;
        }
    } else if (e.ctrlKey && e.altKey && e.keyCode === 65) {
        if ((document.getElementById("chkmusic").checked === true) && (document.getElementById("video").checked === true) && (document.getElementById("books").checked === true)) {
            document.getElementById("chkmusic").checked = false;
            document.getElementById("chkvideo").checked = false;
            document.getElementById("chkbooks").checked = false;
        } else {
            document.getElementById("chkmusic").checked = true;
            document.getElementById("chkvideo").checked = true;
            document.getElementById("chkbooks").checked = true;
        }
    }
}

function search(event) {
    var set1;
    var set2;
    var set3;
    var check1;
    var check2;
    var check3;
    var query;
    var formats;
    var querySplit;
    var suggestedFormat;
    var dotCheck;
    var uuid;

    query = document.getElementById("query").value;
    query = encodeURIComponent(query);
    uuid = "8fd531a3ba79466f8a80e5c71dea9723";
    check1 = document.getElementById("chkmusic").checked;
    check2 = document.getElementById("chkvideo").checked;
    check3 = document.getElementById("chkbooks").checked;
    querySplit = query.split(".");
    dotCheck = querySplit.length > 1;

    if (query === "") {
        document.getElementById("searchWarning").style.display = "block";
        document.getElementById("checkboxWarning").style.display = "none";
        event.preventDefault();
    } else if (check1 || check2 || check3 || dotCheck) {
        if (document.getElementById("chkmusic").checked === true) {
            set1 = "mp3|wav|m4a|ogg|wma|flac";
        } else {
            set1 = "";
        }
        if (document.getElementById("chkvideo").checked === true) {
            set2 = "|mkv|mp4|avi|webm|flv|mov|mpg|mpeg";
        } else {
            set2 = "";
        }
        if (document.getElementById("chkbooks").checked === true) {
            set3 = "|epub|pdf";
        } else {
            set3 = "";
        }
        formats = set1 + set2 + set3;
        if (dotCheck) {
            suggestedFormat = querySplit[1];
            query = querySplit[0];
            formats = formats + "|" + suggestedFormat;
        }
        window.open("http://www.google.com/search?q="+query+" -"+uuid+" -inurl:(htm|html|php|pls|txt) intitle:index.of \"last modified\" ("+formats+")");
    } else {
        document.getElementById("searchWarning").style.display = "none";
        document.getElementById("checkboxWarning").style.display = "block";
        event.preventDefault();
    }
}

var theme;

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("button").addEventListener("click", search);
    document.addEventListener("keyup", keyboardShortCutListener, false);
    suggestion();
    suggestionAsValue();
});
