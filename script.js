"use strict";
document.addEventListener("DOMContentLoaded", fetchJsonData);

let allStudents = [];
let studentsFiltering;
let house;
let sort;
let expell;
let currentList = [];
let expelledList = [];

document.querySelector("#studentlist").addEventListener("click", clickSomething);

document.querySelectorAll("#filtering").forEach(option => {
  option.addEventListener("change", filtering);
});

document.querySelectorAll("#sorting").forEach(option => {
  option.addEventListener("change", sortBy);
});

function fetchJsonData() {
  let dest = document.querySelector("#studentlist");
  async function getJson() {
    let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/students.json ");

    const jsonStudents = await jsonData.json();
    rensData(jsonStudents);
  }

  getJson();
}

const StudentPrototype = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  imageName: "",
  house: "",
  gender: ""
};

function rensData(data) {
  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  // console.log(data);
  data.forEach(jsonObject => {
    const student = Object.create(StudentPrototype);
    const fullname = jsonObject.fullname.trim();
    const names = fullname.split(" ");
    const houses = jsonObject.house.trim();
    let firstName = names[0];
    let lastName = "doe";
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

    if (names.length == 2) {
      lastName = names[1];
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      student.id = create_UUID();

      student.firstName = firstName;
    } else if (names.length == 3) {
      let middleName = names[1];
      middleName = middleName.charAt(0).toUpperCase() + middleName.slice(1).toLowerCase();
      lastName = names[2];
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      student.id = create_UUID();
    } else {
      let lastName = "Unknown";
      student.id = create_UUID();
    }

    student.firstName = firstName;
    student.lastName = lastName;

    // HOUSE
    let house = houses.charAt(0).toUpperCase() + houses.slice(1).toLowerCase();
    student.house = house;

    // let nickName = nickName.charAt(0).toUpperCase() + nickName.slice(1).toLowerCase();
    // student.nickName = nickName;

    if (student.lastName == "Patil") {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
    }

    // let gender = genders.charAt(0).toUpperCase() + genders.slice(1).toLowerCase();
    // student.gender = gender;

    allStudents.push(student);
  });
  document.querySelector(".display_student_number").innerHTML = `Total number of students: ${allStudents.length}`;
  document.querySelector(".display_expelled_students").innerHTML = `Total number of expelled students: ${expelledList.length}`;
  // document.querySelector(".display_each_house").innerHTML = `Total number of students in each house: ${house}`;
  studentsFiltering = studentsInHouse("all");
  studentInfo();
}

function studentInfo() {
  let dest = document.querySelector("#studentlist");
  dest.innerHTML = "";
  studentsFiltering.forEach(student => {
    dest.innerHTML += `
              <div class="student">
              <img src="img/${student.imageName}" alt ="" </img>
                  <h2>${student.firstName + " " + student.lastName}</h2>
                  <h3>${student.house}</h3>
                  <button data-action="expell" data-id=${student.id}>Expell</button>
                  <button class="info" data-id=${student.id}>More info</button>
              </div>`;
  });

  document.querySelectorAll(".info").forEach(student => {
    student.addEventListener("click", open);
  });

  function open(event) {
    // console.log(student);
    const id = event.target.dataset.id;
    allStudents.forEach(student => {
      if (student.id == id) {
        document.querySelector("#indhold").innerHTML = `
                        <div class="student">
                        <img src="img/${student.imageName}" alt ="" </img>
                        <h2>${student.firstName + " " + student.middelName + " " + student.lastName}</h2>
                        
                        
                        <h3>${student.house}</h3>
                            </div>
                        `;
      }
    });
    document.querySelector("#popup").style.display = "block";
  }
  document.querySelector("#luk button").addEventListener("click", () => {
    document.querySelector("#popup").style.display = "none";
  });
}

function sortBy() {
  sort = this.value;

  if (sort == "firstname-sort") {
    studentsFiltering.sort(function(a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  } else if (sort == "lastname-sort") {
    studentsFiltering.sort(function(a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  } else if (sort == "house-sort") {
    studentsFiltering.sort(function(a, b) {
      return a.house.localeCompare(b.house);
    });
  } else if (sort == "none-sort") {
    fetchJsonData();
  }

  studentInfo();
}

function filtering() {
  house = this.value;
  studentsFiltering = studentsInHouse(house);
  studentInfo();
}

function studentsInHouse(house) {
  const studentList = allStudents.filter(filterByHouse);

  function filterByHouse(student) {
    if (student.house == house || house == "all") {
      return true;
    } else {
      return false;
    }
  }
  return studentList;
}

function clickSomething(event) {
  const element = event.target;

  if (element.dataset.action === "expell") {
    console.log("Remove button clicked");
    element.parentElement.remove();
    const id = element.dataset.id;
    const indexOf = studentsFiltering.findIndex(setId);
    console.log(id);

    function setId(student) {
      if (student.id == id) {
        return true;
      } else {
        return false;
      }
    }
    let studentExpelled = studentsFiltering.slice(indexOf, indexOf + 1);
    studentExpelled.forEach(expelledStudents);

    studentsFiltering.splice(indexOf, 1);
    allStudents.splice(indexOf, 1);
    expell++;

    console.log(allStudents);

    document.querySelector(".display_student_number").innerHTML = `Total number of students: ${allStudents.length}`;
    document.querySelector(".display_expelled_students").innerHTML = `Total number of expelled students: ${expelledList.length}`;
    function expelledStudents(student) {
      const studentsExpelled = {
        firstName: "",
        middleName: "",
        nickName: "",
        lastName: "",
        imageName: "",
        house: "",
        gender: ""
      };

      const expelledInfo = Object.create(studentExpelled);
      console.log(studentExpelled);
      expelledInfo.firstName = student.firstName;
      expelledInfo.middelName = student.middelName;
      expelledInfo.nickName = student.nickName;
      expelledInfo.lastName = student.lastName;
      expelledInfo.gender = student.gender;
      expelledInfo.house = student.house;
      expelledInfo.imageName = student.imageName;
      expelledInfo.id = student.id;
      console.log(studentExpelled);
      expelledList.push(studentExpelled);
      console.log(expelledList);
    }
  }
}

// document.querySelector(".expelledbtn").addEventListener("click", openExpelledList);

// function openExpelledList(event) {
//   const id = event.target.dataset.id;
//   allStudents.forEach(student => {
//     if (student.id == id) {
//       document.querySelector("#indhold2").innerHTML = `
//                         <div class="student">
//                         <img src="img/${student.imageName}" alt ="" </img>
//                         <h2>${student.firstName + " " + student.lastName}</h2>
//                         <h3>${student.house}</h3>
//                             </div>
//                         `;
//     }
//   });
//   document.querySelector("#popup2").style.display = "block";
// }
// document.querySelector("#luk2 button2").addEventListener("click", () => {
//   document.querySelector("#popup2").style.display = "none";
// });
