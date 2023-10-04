const dayEl = document.querySelector("#day");
const monthEl = document.querySelector("#month");
const yearEl = document.querySelector("#year");

const form = document.querySelector("#form");
const inputs = document.querySelectorAll("input");

// Utilities functions

const isRequired = (value) => (value.trim() === "" ? false : true);

const isBetween = (length, min, max) =>
  length < min || length > max ? false : true;

const currentYear = new Date().getFullYear();

const isLeapYear = (year) => {
  let leapYear = false;

  if (
    (year % 4 === 0 && year % 100 !== 0) ||
    (year % 100 === 0 && year % 400)
  ) {
    leapYear = true;
  }

  return leapYear;
};

const nbDaysPerMonth = (year) => {
  let daysPerMonth = [];

  if (isLeapYear(year)) {
    // leap year:   JV, FV, MA, AV, MAI, JU, JL, AU, SE, OC, NO, DEC
    daysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  } else {
    // not leap y:  JV, FV, MA, AV, MAI, JU, JL, AU, SE, OC, NO, DEC
    daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }

  return daysPerMonth;
};

// Error function

const showError = (input, message) => {
  input.classList.remove("success");
  input.classList.add("error");

  const label = input.previousElementSibling;
  label.classList.remove("success__label");
  label.classList.add("error__label");

  const error = input.nextElementSibling;
  error.textContent = message;
};

// Success function

const showSuccess = (input) => {
  input.classList.remove("error");
  input.classList.add("success");

  const label = input.previousElementSibling;
  label.classList.remove("error__label");
  label.classList.add("success__label");

  const error = input.nextElementSibling;
  error.textContent = "";
};

// Function for day validation

const checkDay = () => {
  let valid = false;

  const day = dayEl.value.trim();
  const month = monthEl.value.trim();
  const year = yearEl.value.trim();

  const min = 1;
  const max = nbDaysPerMonth(year)[month - 1];

  if (!isRequired(day)) {
    showError(dayEl, "This field is required");
  } else if (!isBetween(day, min, max)) {
    showError(dayEl, "Must be in a valid day");
  } else {
    showSuccess(dayEl);
    valid = true;
  }
  return valid;
};

// Function for month validation

const checkMonth = () => {
  let valid = false;

  const month = monthEl.value.trim();
  const min = 1,
    max = 12;

  if (!isRequired(month)) {
    showError(monthEl, "This field is required");
  } else if (!isBetween(month, min, max)) {
    showError(monthEl, "Must be in a valid month");
  } else {
    showSuccess(monthEl);
    valid = true;
  }
  return valid;
};

// Function for year validation

const checkYear = () => {
  let valid = false;

  const year = yearEl.value.trim();
  const min = 0,
    max = currentYear;

  if (!isRequired(year)) {
    showError(yearEl, "This field is required");
  } else if (!isBetween(year, min, max)) {
    showError(yearEl, "Must be in the past");
  } else {
    showSuccess(yearEl);
    valid = true;
  }
  return valid;
};

// Calculate nb of leap years (for having the right amount of days)

const nbLeapYears = () => {
  const startYear = yearEl.value.trim();
  let yearRange = [];

  // Array with the years in the range
  for (let i = startYear; i <= currentYear; i++) {
    yearRange.push(i);
  }

  let newArray = [];

  // Check if leap year
  yearRange.forEach((year) => {
    if (isLeapYear(year)) {
      newArray.push(year);
    }
  });

  return newArray.length;
};

// Calculate total months and days

const nbMonthsAndDays = (nbDays) => {
  let monthsAndDays = [];

  let daysPerMonth = nbDaysPerMonth(currentYear);

  // calculates the nber of months remaining
  for (let months = 0, n = 0; n < nbDays; months++) {
    n += daysPerMonth[months];
    monthsAndDays[0] = months;
  }

  // calculates the nber of days remaining
  if (monthsAndDays[0] == 0) {
    monthsAndDays[1] = nbDays;
  } else {
    for (let i = 0, days = 0; i < monthsAndDays[0]; i++) {
      days += daysPerMonth[i];
      monthsAndDays[1] = nbDays - days;
    }
  }

  // return the nber of [months, days]
  return monthsAndDays;
};

// Calculate total

let resultYears;
let resultMonths;
let resultDays;
let resultYearsAndMonths;

const calculateTotal = () => {
  // One day in ms
  const oneDay = 1000 * 60 * 60 * 24;

  // Nb of leap years
  const leapYears = nbLeapYears();

  const year = yearEl.value.trim();
  const month = monthEl.value.trim();
  const day = dayEl.value.trim();

  // Date provided
  const inputDate = new Date(year, month - 1, day);
  inputDate.setFullYear(yearEl.value.trim());

  // Current date
  const currentDate = new Date();

  // Calculate the difference in ms
  let diff = Math.round(currentDate.getTime() - inputDate.getTime());

  if (diff < 0) {
    showError("day", "Must be in the past");
  } else {
    // Nb of days
    let nbDays = Math.floor(diff / oneDay);

    // W/ leap years
    nbDays -= leapYears;

    // Nb of years
    let resultYears = Math.floor(nbDays / 365);
    nbDays -= +resultYears * 365;

    // Nb of months and days
    resultYearsAndMonths = nbMonthsAndDays(nbDays);

    let resultMonths = resultYearsAndMonths[0];

    let resultDays = resultYearsAndMonths[1];

    document.getElementById("result__year").textContent = resultYears;
    document.getElementById("result__month").textContent = resultMonths;
    document.getElementById("result__day").textContent = resultDays;

    applyAnimation("result__year", resultYears);
    applyAnimation("result__month", resultMonths);
    applyAnimation("result__day", resultDays);
  }
};

// Animation

const applyAnimation = (elementId, result) => {
  const element = document.getElementById(elementId);

  let count = 0;
  const interval = 30; // Durée de chaque incrémentation en millisecondes
  const maxCount = result; // La valeur à atteindre

  // La fonction pour animer le compteur
  const animateCounter = () => {
    element.innerText = count;
    count++;

    if (count <= maxCount) {
      setTimeout(animateCounter, interval);
    }
  };

  animateCounter();
};

// Submit function

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isDayValid = checkDay();
  let isMonthValid = checkMonth();
  let isYearValid = checkYear();

  let isFormValid = isDayValid && isMonthValid && isYearValid;

  if (isFormValid) {
    console.log("Form is valid");
    console.log("resultYears:", resultYears);
    console.log("resultMonths:", resultMonths);
    console.log("resultDays:", resultDays);

    calculateTotal();
  }
});
