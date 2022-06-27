"use strict";

const STUDENT_FORM = document.getElementById("student-form");
const STUDENT_NAME = document.getElementById("student-name");
const STUDENT_SURNAME = document.getElementById("student-surname");
const STUDENT_AGE = document.getElementById("student-age");
const STUDENT_PHONE = document.getElementById("student-phone");
const STUDENT_EMAIL = document.getElementById("student-email");
const STUDENT_GROUP = document.querySelectorAll("[name='group']");
const TABLE = document.getElementById("students-list");
const MODAL = document.querySelector(".modal");
const SEARCH_INPUT = document.getElementById("search-input");
const NAME_MIN_LENGTH = 3;
const SURNAME_MIN_LENGTH = 6;
const AGE_MIN = 18;
const AGE_MAX = 120;
let studentsDatabase = [];
let id = 1;

window.addEventListener("load", () => {
  getLocalStorageItem();
  const studentDatabaseLocal = localStorage.getItem("studentsDatabase");
  studentsDatabase = [...JSON.parse(studentDatabaseLocal)];
  studentsDatabase.forEach((e) => {
    if (Number(e.id) > id) {
      id = Number(e.id);
      console.log(id);
    }
    id++;
  });
  fillTable(reverseDatabase(studentsDatabase));
});

STUDENT_FORM.addEventListener("submit", (form) => {
  if (checkForm(form.target)) {
    if (STUDENT_FORM.dataset.formId === "0") {
      writeStudent(id, form.target);
      id++;
    } else {
      writeStudent(Number(STUDENT_FORM.dataset.formId), form.target);
    }

    STUDENT_FORM.reset();
  } else {
    form.preventDefault();
    return;
  }

  form.preventDefault();
});

STUDENT_NAME.addEventListener("input", () => {
  checkName(STUDENT_NAME);
  setLocalStorageItem();
});

STUDENT_SURNAME.addEventListener("input", () => {
  checkSurname(STUDENT_SURNAME);
  setLocalStorageItem();
});

STUDENT_AGE.addEventListener("input", () => {
  checkAge(STUDENT_AGE);
  setLocalStorageItem();
});

STUDENT_PHONE.addEventListener("input", () => {
  checkPhone(STUDENT_PHONE);
  setLocalStorageItem();
});

STUDENT_EMAIL.addEventListener("input", () => {
  checkEmail(STUDENT_EMAIL);
  setLocalStorageItem();
});

STUDENT_GROUP.forEach((e) => {
  e.addEventListener("change", () => {
    checkGroup(e);
  });
});

SEARCH_INPUT.addEventListener("input", () => {
  const filter = document.getElementById("search-select").value;
  const value = document.getElementById("search-input").value;

  fillTable(filterDatabase(studentsDatabase, filter, value));
});

function checkForm(form) {
  const studentName = checkName(form.elements["student-name"]);
  const studentSurname = checkSurname(form.elements["student-surname"]);
  const studentAge = checkAge(form.elements["student-age"]);
  const studentPhone = checkPhone(form.elements["student-phone"]);
  const studentEmail = checkEmail(form.elements["student-email"]);
  const studentGroup = checkGroup(form.elements.group);

  if (
    studentName &&
    studentSurname &&
    studentAge &&
    studentPhone &&
    studentEmail &&
    studentGroup
  ) {
    return true;
  }
}

function checkName(name) {
  const studentName = normalizeString(name.value, false);
  const studentNameError = document.getElementById("student-name-error");

  if (studentName.length >= NAME_MIN_LENGTH && charIsLetter(studentName)) {
    changeInputClass(name, true);
    studentNameError.textContent = "";
    return true;
  } else {
    changeInputClass(name, false);
    studentNameError.textContent =
      "Vardas per trumpas arba panaudoti neleistini simboliai.";
    return false;
  }
}

function checkSurname(surname) {
  const studentSurname = normalizeString(surname.value, false);
  const studentSurnameError = document.getElementById("student-surname-error");

  if (
    studentSurname.length >= SURNAME_MIN_LENGTH &&
    charIsLetter(studentSurname)
  ) {
    changeInputClass(surname, true);
    studentSurnameError.textContent = "";
    return true;
  } else {
    changeInputClass(surname, false);
    studentSurnameError.textContent =
      "Pavardė per trumpa arba panaudoti neleistini simboliai.";
    return false;
  }
}

function charIsLetter(str) {
  const letter = /\p{Letter}/u;
  let onlyLetters = true;
  for (let i = 0; i < str.length; i++) {
    if (!letter.test(str[i])) {
      onlyLetters = false;
    }
  }
  return onlyLetters;
}

function checkAge(age) {
  const studentAge = normalizeString(age.value, false);
  const studentAgeError = document.getElementById("student-age-error");

  if (Number(studentAge) >= AGE_MIN && Number(studentAge) < AGE_MAX) {
    changeInputClass(age, true);
    studentAgeError.textContent = "";
    return true;
  } else {
    changeInputClass(age, false);
    studentAgeError.textContent = "Amžius turi būti tarp 18 ir 120 metų.";
    return false;
  }
}

function checkPhone(phone) {
  const phoneFormat1 = /^8\d\d\d\d\d\d\d\d$/i;
  const phoneFormat2 = /^\+370\d\d\d\d\d\d\d\d$/i;
  const phoneFormat3 = /^370\d\d\d\d\d\d\d\d$/i;
  const studentPhone = normalizeString(phone.value, false);
  const studentPhoneError = document.getElementById("student-phone-error");

  if (
    phoneFormat1.test(studentPhone) ||
    phoneFormat2.test(studentPhone) ||
    phoneFormat3.test(studentPhone)
  ) {
    changeInputClass(phone, true);
    studentPhoneError.textContent = "";
    return true;
  } else {
    changeInputClass(phone, false);
    studentPhoneError.textContent =
      "Leistini telefono numerio formatai: +370..., 370... arba 8...";
    return false;
  }
}

function checkEmail(email) {
  const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const studentEmail = normalizeString(email.value, false);
  const studentEmailError = document.getElementById("student-email-error");

  if (mailFormat.test(studentEmail)) {
    changeInputClass(email, true);
    studentEmailError.textContent = "";
    return true;
  } else {
    changeInputClass(email, false);
    studentEmailError.textContent = "Neteisingas el.pašto adresas.";
    return false;
  }
}

function checkGroup(group) {
  const studentGroup = group.value;
  const studentGroupEl = document.getElementById("student-group");

  if (studentGroup !== "") {
    changeInputClass(studentGroupEl, true);
    return true;
  } else {
    changeInputClass(studentGroupEl, false);
    return false;
  }
}

function changeInputClass(input, isValid) {
  if (isValid) {
    input.classList.remove("form-text-input--red");
    input.classList.add("form-text-input--green");
  } else {
    input.classList.remove("form-text-input--green");
    input.classList.add("form-text-input--red");
  }
}

function removeInputClass() {
  document.querySelectorAll(".form-text-input--green").forEach((element) => {
    element.classList.remove("form-text-input--green");
  });

  document.querySelectorAll(".form-text-input--red").forEach((element) => {
    element.classList.remove("form-text-input--red");
  });
}

function writeStudent(id, form) {
  const studentObj = {
    id: `${id}`,
    name: `${normalizeString(form.elements["student-name"].value, true)}`,
    surname: `${normalizeString(form.elements["student-surname"].value, true)}`,
    age: `${normalizeString(form.elements["student-age"].value, false)}`,
    phone: `${normalizeString(form.elements["student-phone"].value, false)}`,
    email: `${normalizeString(form.elements["student-email"].value, false)}`,
    knowledge: `${form.elements["student-knowledge"].value}`,
    group: `${form.elements.group.value}`,
    languages: studentLanguages(form.elements.language),
  };

  let isNewStudent = true;

  if (studentsDatabase.length === 0) {
    studentsDatabase.push(studentObj);
    isNewStudent = false;
  } else {
    studentsDatabase.map((student, index) => {
      if (Number(student.id) === id) {
        studentsDatabase.splice(index, 1, studentObj);
        isNewStudent = false;
      }
    });
  }
  if (isNewStudent) {
    studentsDatabase.push(studentObj);
  }

  STUDENT_FORM.dataset.formId = "0";
  removeInputClass();
  removeLocalStorageItem();
  localStorage.setItem("studentsDatabase", JSON.stringify(studentsDatabase));
  fillTable(reverseDatabase(studentsDatabase));
}

function fillTable(arr) {
  clearTable();
  arr.forEach((student, i) => {
    const row = TABLE.insertRow(i + 1);
    const id = row.insertCell(0);
    const name = row.insertCell(1);
    const group = row.insertCell(2);
    const knowledge = row.insertCell(3);
    const contacts = row.insertCell(4);
    const actions = row.insertCell(5);

    id.classList.add("td-id");
    name.classList.add("td-name");
    group.classList.add("td-group");
    knowledge.classList.add("td-knowledge");
    contacts.classList.add("td-contacts");
    actions.classList.add("td-actions");

    id.textContent = `${student.id}`;
    name.textContent = `${student.name} ${student.surname} (${student.age})`;
    group.textContent = `${student.group}`;
    knowledge.innerText = `${student.knowledge} ${pointsText(
      student.knowledge
    )} iš 10
    ${student.languages.join(", ")}`;
    contacts.innerText = `${hideContacts(student.phone)}
    ${hideContacts(student.email)}`;

    let showContacts = document.createElement("ion-icon");
    showContacts.setAttribute("name", "eye-outline");
    showContacts.classList.add("table-icon");

    let editStudent = document.createElement("ion-icon");
    editStudent.setAttribute("name", "create-outline");
    editStudent.classList.add("table-icon");

    let removeStudent = document.createElement("ion-icon");
    removeStudent.setAttribute("name", "trash-outline");
    removeStudent.classList.add("table-icon");

    actions.append(showContacts, editStudent, removeStudent);

    // SHOW or HIDE student contacts
    let isContactsHidden = true;

    showContacts.addEventListener("click", () => {
      if (isContactsHidden) {
        contacts.innerText = `${student.phone}
        ${student.email}`;
        showContacts.setAttribute("name", "eye-off-outline");
      } else {
        contacts.innerText = `${hideContacts(student.phone)}
    ${hideContacts(student.email)}`;
        showContacts.setAttribute("name", "eye-outline");
      }
      isContactsHidden = !isContactsHidden;
    });

    // EDIT student
    editStudent.addEventListener("click", () => {
      STUDENT_FORM.reset();
      STUDENT_FORM.dataset.formId = student.id;
      removeInputClass();

      document.getElementById("student-name").value = student.name;
      document.getElementById("student-surname").value = student.surname;
      document.getElementById("student-age").value = student.age;
      document.getElementById("student-phone").value = student.phone;
      document.getElementById("student-email").value = student.email;
      document.getElementById("student-knowledge").value = student.knowledge;

      document.querySelectorAll("input[name='group']").forEach((group) => {
        if (group.value === student.group) {
          document.getElementById(`${group.id}`).checked = true;
        }
      });

      student.languages.forEach((lang) => {
        document.querySelectorAll("input[name='language']").forEach((input) => {
          if (lang === input.value) {
            input.checked = true;
          }
        });
      });
    });

    // DELETE student
    removeStudent.addEventListener("click", () => {
      const deletedStudent = `Studentas(-ė), <strong>${student.name} ${student.surname}</strong>, sėkmingai ištrintas(-a).`;
      showModal("warning", deletedStudent);
      studentsDatabase.splice(studentsDatabase.indexOf(student), 1);
      fillTable(reverseDatabase(studentsDatabase));
      STUDENT_FORM.reset();
      STUDENT_FORM.dataset.formId = "0";
    });
  });
}

function clearTable() {
  while (TABLE.rows.length > 1) {
    TABLE.deleteRow(1);
  }
}

function normalizeString(string, capitalizeFirstLetter) {
  if (capitalizeFirstLetter) {
    return (
      string.trimStart().charAt(0).toUpperCase() +
      string.replaceAll(" ", "").slice(1).toLowerCase()
    );
  } else {
    return string.replaceAll(" ", "").toLowerCase();
  }
}

function pointsText(points) {
  if (points === "1") {
    return "balas";
  } else if (points === "10") {
    return "balų";
  } else {
    return "balai";
  }
}

function hideContacts(contact) {
  let hiddenContacts = "";
  for (let i = 0; i < contact.length; i++) {
    hiddenContacts += "*";
  }
  return hiddenContacts;
}

function studentLanguages(languages) {
  let studentLanguages = [];
  languages.forEach((lang) => {
    if (lang.checked) {
      studentLanguages.push(lang.value);
    }
  });

  return studentLanguages;
}

function reverseDatabase(arr) {
  let newArray = [...arr];
  return newArray.reverse();
}

function filterDatabase(arr, filter, value) {
  let newArray = [];

  arr.map((student) => {
    if (
      normalizeString(student[`${filter}`], false).includes(
        normalizeString(value, false)
      )
    ) {
      newArray.push(student);
    }
  });

  return newArray;
}

function setLocalStorageItem() {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("studentName", STUDENT_NAME.value);
    localStorage.setItem("studentSurname", STUDENT_SURNAME.value);
    localStorage.setItem("studentAge", STUDENT_AGE.value);
    localStorage.setItem("studentPhone", STUDENT_PHONE.value);
    localStorage.setItem("studentEmail", STUDENT_EMAIL.value);
  }
}

function getLocalStorageItem() {
  if (typeof Storage !== "undefined") {
    STUDENT_NAME.value = localStorage.getItem("studentName");
    STUDENT_SURNAME.value = localStorage.getItem("studentSurname");
    STUDENT_AGE.value = localStorage.getItem("studentAge");
    STUDENT_PHONE.value = localStorage.getItem("studentPhone");
    STUDENT_EMAIL.value = localStorage.getItem("studentEmail");
  }
}

function removeLocalStorageItem() {
  localStorage.removeItem("studentName");
  localStorage.removeItem("studentSurname");
  localStorage.removeItem("studentAge");
  localStorage.removeItem("studentPhone");
  localStorage.removeItem("studentEmail");
}

// SHOW modal
function showModal(type, text) {
  let modalMessage = document.querySelector(".modal-message");
  let modalText = document.querySelector(".modal-text");

  if (type === "success") {
    modalMessage.classList.add("modal-green");
  } else if (type === "warning") {
    modalMessage.classList.add("modal-orange");
  } else if (type === "error") {
    modalMessage.classList.add("modal-red");
  }

  modalText.innerHTML = text;
  MODAL.style.display = "block";
}

// CLOSE modal
document.querySelector(".modal-close-button").addEventListener("click", () => {
  MODAL.style.display = "none";
  document
    .querySelector(".modal-message")
    .classList.remove("modal-green", "modal-orange", "modal-red");
});
