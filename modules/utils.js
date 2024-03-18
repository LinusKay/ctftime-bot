
function convertDateReadable(date, time = false) {
    let day = date.getDate();
    let daySuffix = 'th'; // Default suffix for most days

    // Handling special cases for day suffixes
    if (day < 11 || day > 13) {
        switch (day % 10) {
            case 1:
                daySuffix = 'st';
                break;
            case 2:
                daySuffix = 'nd';
                break;
            case 3:
                daySuffix = 'rd';
                break;
        }
    }

    // Append suffix to the day
    day += daySuffix;

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = daysOfWeek[date.getDay()];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];

    let formattedDate;
    if (time) {
        // Extract hours and minutes
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedDate = `${weekday} ${day} ${month} ${hours}:${minutes} AEDT`;
    } else {
        formattedDate = `${weekday} ${day} ${month}`;
    }

    return formattedDate;
}

function timeBetween(startDate, endDate) {
    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(endDate - startDate);

    // Convert milliseconds to days and hours
    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { days, hours };
}

function convertDateUTCToAEDT(date) {
    const utcTimestamp = date.getTime();
    const aedtOffset = 11 * 60 * 60 * 1000; // AEDT is UTC+11 in milliseconds
    const aedtTimestamp = utcTimestamp + aedtOffset;
    return new Date(aedtTimestamp);
}

// Function to parse date string to epoch timestamp
function convertDMYEpoch(dateString) {
    if (!dateString) return null;

    // Parse the date string to extract day, month, and year
    const dateParts = dateString.split(/[\/-]/);
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed in JavaScript Date object
    const year = parseInt(dateParts[2]);

    // Create a new Date object from parsed components
    const dateObject = new Date(year, month, day);

    // Convert the Date object to epoch timestamp
    return Math.floor(dateObject.getTime() / 1000);
}

module.exports = { convertDateReadable, timeBetween, convertDateUTCToAEDT, convertDMYEpoch };