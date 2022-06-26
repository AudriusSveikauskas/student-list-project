"use strict";

const STUDENT_FORM = document.getElementById("student-form");
const STUDENT_NAME = document.getElementById("student-name");
const STUDENT_SURNAME = document.getElementById("student-surname");
const STUDENT_AGE = document.getElementById("student-age");
const STUDENT_PHONE = document.getElementById("student-phone");
const STUDENT_EMAIL = document.getElementById("student-email");
const TABLE = document.getElementById("students-list");
const MODAL = document.querySelector(".modal");
const SEARCH_INPUT = document.getElementById("search-input");
const PREPARED_DATA_BUTTON = document.getElementById("prepared-data-button");
const PREPARED_DATA = [
  {
    id: 1,
    name: "Petras",
    surname: "Petrauskas",
    age: 44,
    phone: "+37060011222",
    email: "petras@gmail.com",
    knowledge: 4,
    group: "Type 5",
    languages: ["Java", "Kotlin"],
  },
  {
    id: 2,
    name: "Antanas",
    surname: "Antanaitis",
    age: 33,
    phone: "+37060022333",
    email: "antanas@yahoo.com",
    knowledge: 6,
    group: "Type 11",
    languages: ["PHP"],
  },
  {
    id: 3,
    name: "Jonas",
    surname: "Jonaitis",
    age: 45,
    phone: "861144555",
    email: "jonas@mail.com",
    knowledge: 9,
    group: "Type 3",
    languages: ["JavaScript", "C++"],
  },
  {
    id: 4,
    name: "Ona",
    surname: "Onaitienė",
    age: 27,
    phone: "+37069977888",
    email: "ona.onaitiene@gmail.com",
    knowledge: 8,
    group: "Type 7",
    languages: ["Java", "Python"],
  },
  {
    id: 5,
    name: "Inga",
    surname: "Ingaitė",
    age: 18,
    phone: "862233444",
    email: "inga@pastas.lt",
    knowledge: 9,
    group: "Type 5",
    languages: ["Kotlin", "Python", "C++"],
  },
];
const NAME_MIN_LENGTH = 3;
const SURNAME_MIN_LENGTH = 6;
const AGE_MIN = 18;
const AGE_MAX = 120;
let studentsDatabase = [];
let id = 1;

PREPARED_DATA_BUTTON.addEventListener("click", () => {
  PREPARED_DATA.forEach((student) => {
    studentsDatabase.push(student);
  });
  id = 6;
  fillTable(reverseDatabase(studentsDatabase));
  hidePreparedData();
});

STUDENT_FORM.addEventListener("submit", (form) => {
  if (checkForm(form.target)) {
    if (STUDENT_FORM.dataset.formId === "0") {
      writeStudent(id, form.target);
      id++;
      hidePreparedData();
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
});

STUDENT_SURNAME.addEventListener("input", () => {
  checkSurname(STUDENT_SURNAME);
});

STUDENT_AGE.addEventListener("input", () => {
  checkAge(STUDENT_AGE);
});

STUDENT_PHONE.addEventListener("input", () => {
  checkPhone(STUDENT_PHONE);
});

STUDENT_EMAIL.addEventListener("input", () => {
  checkEmail(STUDENT_EMAIL);
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
  if (studentName.length >= NAME_MIN_LENGTH && charIsLetter(studentName)) {
    changeInputClass(name, true);
    return true;
  } else {
    changeInputClass(name, false);
    return false;
  }
}

function checkSurname(surname) {
  const studentSurname = normalizeString(surname.value, false);
  if (
    studentSurname.length >= SURNAME_MIN_LENGTH &&
    charIsLetter(studentSurname)
  ) {
    changeInputClass(surname, true);
    return true;
  } else {
    changeInputClass(surname, false);
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
  if (Number(studentAge) >= AGE_MIN && Number(studentAge) < AGE_MAX) {
    changeInputClass(age, true);
    return true;
  } else {
    changeInputClass(age, false);
    return false;
  }
}

function checkPhone(phone) {
  const phoneFormat1 = /^8\d\d\d\d\d\d\d\d$/i;
  const phoneFormat2 = /^\+370\d\d\d\d\d\d\d\d$/i;
  const phoneFormat3 = /^370\d\d\d\d\d\d\d\d$/i;
  const studentPhone = normalizeString(phone.value, false);

  if (
    phoneFormat1.test(studentPhone) ||
    phoneFormat2.test(studentPhone) ||
    phoneFormat3.test(studentPhone)
  ) {
    changeInputClass(phone, true);
    return true;
  } else {
    changeInputClass(phone, false);
    return false;
  }
}

function checkEmail(email) {
  const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const studentEmail = normalizeString(email.value, false);

  if (mailFormat.test(studentEmail)) {
    changeInputClass(email, true);
    return true;
  } else {
    changeInputClass(email, false);
    return false;
  }
}

function checkGroup(group) {
  const studentGroup = group.value;
  const studentGroupEl = document.getElementById("student-group");
  console.log(studentGroupEl);

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

function hidePreparedData() {
  document.querySelector(".prepared-data").style.display = "none";
  document
    .querySelector(".table-wrapper")
    .style.setProperty("position", "static");
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
