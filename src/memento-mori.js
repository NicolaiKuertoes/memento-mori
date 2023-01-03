let bday;
let exp;
let sex;
let optIn = 0;

/**
 * Cookies
 */
const cookieBanner = document.getElementById("cookieBanner");

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

function setOptIn() {
    optIn = 1;
    cookieBanner.style.display = "none";
}

function fadeInBanner(duration) {
    const fadeIn = [
        { opacity: 0 },
        { bottom: '5vmin' }
    ];
    cookieBanner.animate(fadeIn, {
        duration: duration,
        fill: "forwards"
    });
}

fadeInBanner(666);

function closeBanner() {
    cookieBanner.style.display = "none";
}

/**
 * Setup
*/
const setupForm = document.getElementById("setup");

if (document.cookie) { // Checks if cookie is set
    cookieBanner.style.display = "none";
    let values = atob(getCookie("biscuit")).split("-");
    bday = new Date(values[0]);
    sex = values[1];
    exp = sex == "m" ? 79 : 83;
    setupForm.style.display = "none";
    drawCalendar(bday);
}

function setup() {
    cookieBanner.style.display = "none";
    sex = document.querySelector('input[name="gender"]:checked').value;
    exp = sex == "m" ? 80 : 85;
    bday = new Date(document.getElementById("date").value);
    if (optIn) {
        const cookie = btoa(bday + "-" + sex);
        setCookie("biscuit", cookie, 30);
    }
    setupForm.style.display = "none";
    drawCalendar(bday);
}

function isGapYear(j) {
    return j < 1583 ?
        (j % 4) == 0
        : (((j % 4) == 0
            & (j % 100) != 0)
            || ((j % 4) == 0
                & ((j % 100) != 0
                    || (j % 400) == 0)));
}

function getLivedWeeks(bday) {
    const now = new Date();
    const day_diff = (now - bday) / (1000 * 3600 * 24);
    const years = Math.floor(day_diff / 365);
    const remaining_weeks = Math.floor((day_diff % 365) / 7);

    // count gapyears
    let numOfGaps = 0;
    for (let year = bday.getFullYear(); year < now.getFullYear(); year++) {
        if (isGapYear(year)) {
            ++numOfGaps;
        }
    }

    // convert number of gapyears to weeks
    let gapWeeks = Math.round(numOfGaps / 7);

    // weeks lived
    return years * 52 + remaining_weeks - gapWeeks;
}

/**
 * Draw Memento Mori Calendar
 */
function drawCalendar(bday) {
    const weeks = document.getElementById("weeks");
    weeks.style.display = "flex";

    let livedWeeks = getLivedWeeks(bday);
    // draw rows of weeks
    for (let year = 1; year <= exp; year++) {
        const week_row = document.createElement("div");
        week_row.classList.add("week_row");

        // label every 5 years
        if (year % 5 == 0) {
            const age = document.createElement("span");
            age.classList.add("age");
            age.innerHTML = year;
            week_row.appendChild(age);
        }

        // add gap every decade
        if (year % 10 == 0) {
            week_row.style.marginBottom = "1vmin";
        }

        weeks.appendChild(week_row);

        // draw weeks
        for (let i = 0; i < 52; i++) {
            const week = document.createElement("span");
            week.classList.add("week");

            // fill lived weeks
            if (livedWeeks-- > 0) {
                week.classList.add("gone");
            }

            week_row.appendChild(week);
        }
    }
}
