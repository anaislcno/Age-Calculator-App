const dayEl = document.querySelector("#day");
const monthEl = document.querySelector("#month");
const yearEl = document.querySelector("#year");

const form = document.querySelector("#form");
const inputs = document.querySelectorAll("input");

// Fonctions d'utilité

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

// Fonction error

const showError = (input, message) => {
  input.classList.remove("success");
  input.classList.add("error");

  const error = input.nextElementSibling;
  error.textContent = message;
};

// Fonction success

const showSuccess = (input) => {
  input.classList.remove("error");
  input.classList.add("success");

  const error = input.nextElementSibling;
  error.textContent = "";
};

// Fonctions de vérifications des champs

const checkDay = () => {
  let valid = false;
  const day = dayEl.value.trim();

  if (!isRequired(day)) {
    showError(dayEl, "This field is required");
  } else {
    showSuccess(dayEl);
    valid = true;
  }
  return valid;
};

const checkMonth = () => {
  let valid = false;

  const month = monthEl.value.trim();
  if (!isRequired(month)) {
    showError(monthEl, "This field is required");
  } else {
    showSuccess(monthEl);
    valid = true;
  }
  return valid;
};

const checkYear = () => {
  let valid = false;

  const year = yearEl.value.trim();
  const min = 0,
    max = currentYear;

  if (!isRequired(year)) {
    showError(yearEl, "This field is required");
  } else if (!isBetween(year, min, max)) {
    invalidInputError("year", "Must be in the past");
  } else {
    showSuccess(yearEl);
    valid = true;
  }
  return valid;
};

// Fonction au submit

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isDayValid = checkDay();
  let isMonthValid = checkMonth();
  let isYearValid = checkYear();

  let isFormValid = isDayValid && isMonthValid && isYearValid;

  if (isFormValid) {
    console.log("Form is valid");
    // calculateAge();
  }
});
