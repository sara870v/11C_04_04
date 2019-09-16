"use strict";
document.addEventListener("DOMContentLoaded", fetchJsonData);

let allStudents = [];
let studentsFiltering;

function fetchJsonData() {
  let dest = document.querySelector("#studentlist");
  async function getJson() {
    let jsonData = await fetch(
      "http://petlatkea.dk/2019/hogwartsdata/students.json "
    );

    allStudents = await jsonData.json();
    studentsFiltering = studentsInHouse("all");

    // const jsonStudents = await jsonData.json();
    // rensData(jsonStudents);
    studentInfo();
  }

  getJson();
}

// const StudentPrototype = {
//   firstName: "",
//   middleName: "",
//   nickName: "",
//   lastName: "",
//   imageName: "",
//   house: ""
// };

// function rensData(data) {
//   data.forEach(jsonObject => {
//     const student = Object.create(StudentPrototype);
//     // Denne her linje er ikke rigtig!
//     student.firstName = jsonObject.fullname.split();
//     student.middleName = jsonObject.middle.trim();
//     student.house = jsonObject.house.trim();

//     // student.firstName =
//   });

//   studentInfo();
// }

function studentInfo() {
  let dest = document.querySelector("#studentlist");
  dest.innerHTML = "";
  allStudents.forEach(student => {
    dest.innerHTML += `
              <div class="student">
                  <h2>${student.fullname}</h2>
                  <h3>${student.house}</h3
              </div>`;
  });

  document.querySelectorAll(".student").forEach(student => {
    student.addEventListener("click", open);
  });

  function open() {
    console.log(student);
    document.querySelector("#indhold").innerHTML = `
                        <div class="students">
                            <h2>${student.fullname}</h2>
                            
                            <p>${student.house}</p>
                            </div>
                        `;
    document.querySelector("#popup").style.display = "block";
  }
  document.querySelector("#luk button").addEventListener("click", () => {
    document.querySelector("#popup").style.display = "none";
  });
}

function filtering() {
  const filter = this.value;
  studentsFiltering = studentsInHouse(filter);
  studentInfo();
}

function studentsInHouse(house) {
  const studentList = allStudents.filter(filterByHouse);

  function filterByHouse(studentList) {
    if (studentList.house === house) {
      return true;
    } else {
      return false;
    }
  }
  return studentList;
}
