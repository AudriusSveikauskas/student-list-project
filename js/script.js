"use strict";

const STUDENT_FORM = document.getElementById("student-form");
const TABLE = document.getElementById("students-list");
const MODAL = document.querySelector(".modal");
const SEARCH_INPUT = document.getElementById("search-input");
let studentsDatabase = [];
let id = 1;

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
    return;
  }

  form.preventDefault();
});

SEARCH_INPUT.addEventListener("input", (e) => {
  const filter = document.getElementById("search-select").value;
  const value = document.getElementById("search-input").value;

  fillTable(filterDatabase(studentsDatabase, filter, value));
});

function checkForm(form) {
  return true;
}

function writeStudent(id, form) {
  const studentObj = {
    id: `${id}`,
    name: `${normalizeString(form.elements["student-name"].value, true)}`,
    surname: `${normalizeString(form.elements["student-surname"].value, true)}`,
    age: `${form.elements["student-age"].value}`,
    phone: `${form.elements["student-phone"].value}`,
    email: `${form.elements["student-email"].value}`,
    knowledge: `${form.elements["student-knowledge"].value}`,
    group: `${form.elements.knowledge.value}`,
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

      document.querySelectorAll("input[name='knowledge']").forEach((group) => {
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
      const deletedStudent = `Studentas, <strong>${student.name} ${student.surname}</strong>, sėkmingai ištrintas.`;
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
      console.log(student);
      newArray.push(student);
    }
  });
  console.log(newArray);
  return newArray;
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
