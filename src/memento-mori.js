document.getElementById("date").value = new Date();

const cookieBanner = document.getElementById("cookieBanner");
const setupForm = document.getElementById("setup");
const weeks = document.getElementById("weeks");

let birthdate;
let sex;
let optIn = 0;

Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};

function addYears(date, years) {
    date.setFullYear(date.getFullYear() + years);
    return date;
}

function getWeeksDiff(startDate, endDate) {
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.round(Math.abs(endDate - startDate) / msInWeek);
}

function setOptIn() {
    optIn = 1;
    cookieBanner.style.display = "none";
}

function closeBanner() {
    cookieBanner.style.display = "none";
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

if (document.cookie) {
    cookieBanner.style.display = "none";
    let values = atob(getCookie("biscuit")).split("-");
    birthdate = new Date(values[0]);
    sex = values[1];
    setupForm.style.display = "none";
    mementoMori(birthdate, sex);
}

/**
 * Setup
 */
function setup() {
    cookieBanner.style.display = "none";
    sex = document.querySelector('input[name="gender"]:checked').value;
    birthdate = new Date(document.getElementById("date").value);
    if (optIn) {
        const cookie = btoa(birthdate + "-" + sex);
        setCookie("biscuit", cookie, 30);
    }
    setupForm.style.display = "none";
    mementoMori(birthdate, sex);
}

/**
 * Memento Mori
*/
function mementoMori(birthdate, sex) {
    weeks.style.display = "flex";
    const yearsToLive = sex == "0" ? 79 : 83;
    const today = new Date();
    const weekNumber = today.getWeekNumber();
    let weeksLived = getWeeksDiff(birthdate, today) - 5;
    let counter = 0;
    for (let k = 1; k <= yearsToLive; k++) { // create rows for each year
        const week_row = document.createElement("div");
        week_row.classList.add("week_row");
        if (k % 5 == 0) {
            const age = document.createElement("span");
            age.classList.add("age");
            age.innerHTML = k;
            week_row.appendChild(age);
        }
        if (k % 10 == 0) {
            week_row.style.marginBottom = "1vmin";
        }
        weeks.appendChild(week_row);
        for (let i = 0; i < 52; i++) { // create weeks for each row
            const week = document.createElement("span");
            week.classList.add("week");
            if (counter < weeksLived) {
                week.classList.add("gone");
                ++counter;
            }
            week_row.appendChild(week);
        }
    }
}
