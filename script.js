const form = document.getElementById("regForm");
const successBox = document.getElementById("success");
const summary = document.getElementById("summary");
const resetBtn = document.getElementById("reset");
const formError = document.getElementById("formError");

form.noValidate = true;

const fieldOrder = ["fullName", "email", "password", "confirmPassword", "phone", "gender", "hobbies", "country"];
let messages = {};

function showFirstError() {
  formError.textContent = "";

  for (let i = 0; i < fieldOrder.length; i++) {
    const text = messages[fieldOrder[i]];

    if (text) {
      formError.textContent = text;
      break;
    }
  }
}

function setError(input, message) {
  const field = input.closest(".field");
  field.classList.remove("valid", "invalid");

  if (message === "") {
    field.classList.add("valid");
  } else {
    field.classList.add("invalid");
  }

  messages[input.name] = message;
  showFirstError();
}

function checkFullName() {
  const input = form.fullName;

  if (input.value.trim() === "") {
    setError(input, "Full name cannot be empty.");
    return false;
  }

  setError(input, "");
  return true;
}

function checkEmail() {
  const input = form.email;
  const value = input.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (value === "") {
    setError(input, "Email address is required.");
    return false;
  }

  if (!pattern.test(value)) {
    setError(input, "Enter a valid email, e.g. name@example.com.");
    return false;
  }

  setError(input, "");
  return true;
}

function checkPassword() {
  const input = form.password;

  if (input.value === "") {
    setError(input, "Password is required.");
    return false;
  }

  if (input.value.length < 6) {
    setError(input, "Password must be at least 6 characters.");
    return false;
  }

  setError(input, "");
  return true;
}

function checkConfirmPassword() {
  const input = form.confirmPassword;

  if (input.value === "") {
    setError(input, "Please confirm your password.");
    return false;
  }

  if (input.value !== form.password.value) {
    setError(input, "Passwords do not match.");
    return false;
  }

  setError(input, "");
  return true;
}

function checkPhone() {
  const input = form.phone;
  const value = input.value.trim();

  if (value === "") {
    setError(input, "Phone number is required.");
    return false;
  }

  if (!/^[0-9]+$/.test(value)) {
    setError(input, "Phone number must contain numbers only.");
    return false;
  }

  if (value.length < 10) {
    setError(input, "Phone number must be at least 10 digits.");
    return false;
  }

  setError(input, "");
  return true;
}

function checkGender() {
  const firstRadio = form.querySelector('input[name="gender"]');
  const selected = form.querySelector('input[name="gender"]:checked');

  if (selected === null) {
    setError(firstRadio, "Please select a gender.");
    return false;
  }

  setError(firstRadio, "");
  return true;
}

function checkHobbies() {
  const firstBox = form.querySelector('input[name="hobbies"]');
  const selected = form.querySelectorAll('input[name="hobbies"]:checked');

  if (selected.length === 0) {
    setError(firstBox, "Select at least one hobby.");
    return false;
  }

  setError(firstBox, "");
  return true;
}

function checkCountry() {
  const input = form.country;

  if (input.value === "") {
    setError(input, "Please select a country.");
    return false;
  }

  setError(input, "");
  return true;
}

function watchTextInput(input, checkFunction) {
  input.addEventListener("blur", checkFunction);

  input.addEventListener("input", function () {
    const field = input.closest(".field");
    const alreadyChecked = field.classList.contains("valid") || field.classList.contains("invalid");

    if (alreadyChecked) {
      checkFunction();
    }
  });
}

watchTextInput(form.fullName, checkFullName);
watchTextInput(form.email, checkEmail);
watchTextInput(form.password, checkPassword);
watchTextInput(form.confirmPassword, checkConfirmPassword);
watchTextInput(form.phone, checkPhone);

form.password.addEventListener("input", function () {
  if (form.confirmPassword.value !== "") {
    checkConfirmPassword();
  }
});

form.querySelectorAll('input[name="gender"]').forEach(function (radio) {
  radio.addEventListener("change", checkGender);
});

form.querySelectorAll('input[name="hobbies"]').forEach(function (box) {
  box.addEventListener("change", checkHobbies);
});

form.country.addEventListener("change", checkCountry);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const results = [
    checkFullName(),
    checkEmail(),
    checkPassword(),
    checkConfirmPassword(),
    checkPhone(),
    checkGender(),
    checkHobbies(),
    checkCountry()
  ];

  if (results.includes(false)) {
    const firstInvalid = form.querySelector(".invalid input, .invalid select");
    firstInvalid.focus();
    return;
  }

  showSummary();
});

function addSummaryRow(label, value) {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");

  dt.textContent = label;
  dd.textContent = value;

  row.appendChild(dt);
  row.appendChild(dd);
  summary.appendChild(row);
}

function showSummary() {
  const hobbyList = [];
  form.querySelectorAll('input[name="hobbies"]:checked').forEach(function (box) {
    hobbyList.push(box.value);
  });

  summary.innerHTML = "";
  addSummaryRow("Full name", form.fullName.value.trim());
  addSummaryRow("Email", form.email.value.trim());
  addSummaryRow("Phone", form.phone.value.trim());
  addSummaryRow("Gender", form.querySelector('input[name="gender"]:checked').value);
  addSummaryRow("Hobbies", hobbyList.join(", "));
  addSummaryRow("Country", form.country.value);

  form.hidden = true;
  successBox.hidden = false;
}

resetBtn.addEventListener("click", function () {
  form.reset();

  document.querySelectorAll(".field").forEach(function (field) {
    field.classList.remove("valid", "invalid");
  });

  messages = {};
  formError.textContent = "";

  successBox.hidden = true;
  form.hidden = false;
  form.fullName.focus();
});