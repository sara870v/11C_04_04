"use strict";
document.addEventListener("DOMContentLoaded", fetchJsonData);

let allStudents = [];
let studentsFiltering;
let house;
let sort;
let expell;
let currentList = [];
let expelledList = [];
let gryffindor;
let hufflepuf;
let ravenclaw;
let slytherin;
let bloodStudents = [];

document.querySelector("#studentlist").addEventListener("click", expellStudents);

document.querySelectorAll("#filtering").forEach(option => {
  option.addEventListener("change", filtering);
});

document.querySelectorAll("#sorting").forEach(option => {
  option.addEventListener("change", sortAs);
});

function fetchJsonData() {
  // FETCHING FIRST JSON, GOING TO rensData
  let dest = document.querySelector("#studentlist");
  async function getJson() {
    let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/students.json ");

    const jsonStudents = await jsonData.json();
    rensData(jsonStudents);
  }

  getJson();

  fetchJsonBlood();
}

const StudentPrototype = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  imageName: "",
  house: "",
  gender: "",
  bloodStatus: "",
  squadTeam: "",
  prefect: ""
};

function rensData(data) {
  // CLEANING DATA. Making names spelled right, with correct uppercase and lowercase, set const for houses, genders and so on
  dontExpell();
  // FROM URL https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
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
    // const nickNames = jsonObject.names[];
    const houses = jsonObject.house.trim();
    const genders = jsonObject.gender;
    const bloodStatus = jsonObject.bloodStatus;
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
      student.middelName = middleName;

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
    // GENDER
    let gender = genders.charAt(0).toUpperCase() + genders.slice(1).toLowerCase();
    student.gender = gender;

    if (student.lastName == "Patil") {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else {
      student.imageName = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
    }

    if (student.bloodStatus == "") {
      student.bloodStatus = "Muggleborn";
    }

    student.prefect = "";

    student.squadTeam = false;

    allStudents.push(student);
  });

  function dontExpell() {
    // Creating myself as a student, where I push the information and I get on the same list as rest of the students
    const student = Object.create(StudentPrototype);

    student.firstName = "Sarah";
    student.middleName = "Gabriella";
    student.lastName = "Davidsen";
    student.gender = "Girl";
    student.id = create_UUID();
    student.house = "Ravenclaw";
    student.imageName = "an.jpg";
    student.bloodStatus = "Pureblood";

    allStudents.push(student);
  }

  document.querySelector(".display_student_number").innerHTML = `Total number of students: ${allStudents.length}`;
  document.querySelector(".display_expelled_students").innerHTML = `Total number of expelled students: ${expelledList.length}`;

  studentsFiltering = studentsInHouse("all");

  StudentsInEachHouse();
  studentInfo();
}

function studentInfo() {
  // template with information on each student in the normal studentlist
  let dest = document.querySelector("#studentlist");
  dest.innerHTML = "";
  studentsFiltering.forEach(student => {
    dest.innerHTML += `
              <div class="student">
              <img src="img/${student.imageName}" alt ="" </img>
                  <h2>${student.firstName + student.nickName + " " + student.lastName}</h2>
                  <h3>${student.house}</h3>
                  <button class ="expellbtn" data-action="expell" data-id=${student.id}>Expell</button>
                  <button class="info" data-id=${student.id}>More info</button>
              </div>`;
  });
  document.querySelector(".student .expellbtn").addEventListener("click", () => {
    document.querySelector("#studentlist").className = "fade_out";
    setTimeout(function() {
      document.querySelector(".showdisplay").style.display = "block";
    }, 2000);
  });

  document.querySelectorAll(".info").forEach(student => {
    student.addEventListener("click", open);
  });

  function open(event) {
    // template with information on specific student, in a popup
    // console.log(student);
    const id = event.target.dataset.id;
    allStudents.forEach(student => {
      if (student.id == id) {
        document.querySelector("#indhold").innerHTML = `
                        <div class="student">
                        <img src="img/${student.imageName}" alt ="" </img>
                        <h2>${student.firstName} ${student.middelName != undefined ? student.middelName : " "} ${student.lastName}</h2>
                        <h3>${student.house}</h3>
                        <p>${student.bloodStatus}</p>
                        <p>Gender: ${student.gender}</p>
                       
                        <p>${student.prefect != undefined ? student.prefect : ""}</p>
                        <button class="prefect_btn" data-id=${student.id}>Add to prefect</button>
                        <button class="squad_btn" data-id=${student.id}>Add to squad</button>
                        <div class="crest_house"><img></div>
                            </div>
                        `;
        if (student.house === "Gryffindor") {
          document.querySelector("#popup .student").className = "gryffindor";
          document.querySelector("#indhold .crest_house img").src = "crest/gryffindor2.png";
        } else if (student.house === "Hufflepuff") {
          document.querySelector("#popup .student").className = "hufflepuf";
          document.querySelector("#indhold .crest_house img").src = "crest/hufflepuf2.png";
        } else if (student.house === "Ravenclaw") {
          document.querySelector("#popup .student").className = "ravenclaw";
          document.querySelector("#indhold .crest_house img").src = "crest/ravenclaw2.png";
        } else {
          document.querySelector("#popup .student").className = "slytherin";
          document.querySelector("#indhold .crest_house img").src = "crest/slytherin2.png";
        }
      }
    });
    document.querySelector("#popup").style.display = "block";
    document.querySelector(".squad_btn").addEventListener("click", squadStudents);
    document.querySelector(".prefect_btn").addEventListener("click", prefectStudents);
  }

  document.querySelector("#luk button").addEventListener("click", () => {
    document.querySelector("#popup").style.display = "none";
  });

  console.log(allStudents);
}

// PREFECT

function prefectStudents() {
  console.log("hej");
  const id = this.dataset.id;
  allStudents.forEach(student => {
    if (student.id == id && student.prefect == "") {
      student.prefect = "Prefect";
      document.querySelector(".prefect_btn").textContent = "Remove student as prefect";
    } else if (student.id == id && student.prefect == "Prefect") {
      student.prefect = "";

      document.querySelector(".prefect_btn").textContent = "Add to prefect";
    }
    // if (student.house == "Hufflepuf") {
    //   checkPrefectsHufflepuff(student);
    // } else if (student.house == "Gryffindor") {
    //   checkPrefectsGryffindor(student);
    // } else if (student.house == "Ravenclaw") {
    //   checkPrefectsRavenclaw(student);
    // } else if (student.house == "Slytherin") {
    //   checkPrefectsSlytherin(student);
    // }
  });
}

// function checkPrefectHufflepuff(student) {
//   let prefect = hufflepuf.filter(x => x.prefect.includes("Prefect"));
//   console.log(prefect.length == 2);
//   if (student.prefect == "" && prefect.length == 2) {
//     console.log("stop");
//   }
// }
// function checkPrefectsGryffindor(student) {
//   let prefect = gryffindor.filter(x => x.prefect.includes("Prefect"));
//   console.log(prefect.length == 2);
//   if (student.prefect == "" && prefect.length == 2) {
//     console.log("stop");
//   }
// }
// function checkPrefectsRavenclaw(student) {
//   let prefect = ravenclaw.filter(x => x.prefect.includes("Prefect"));
//   console.log(prefect.length == 2);
//   if (student.prefect == "" && prefect.length == 2) {
//     console.log("stop");
//   }
// }
// function checkPrefectsSlytherin(student) {
//   let prefect = slytherin.filter(x => x.prefect.includes("Prefect"));
//   console.log(prefect.length == 2);
//   if (student.prefect == "" && prefect.length == 2) {
//     console.log("stop");
//   }
// }

// PREFECT

function squadStudents() {
  // Setting squads on students, hacking it making it dissapear after a timer
  const id = this.dataset.id;

  allStudents.forEach(student => {
    if (student.bloodStatus == "Pureblood" || student.house == "Slytherin") {
      if (student.id == id && student.squadTeam == false) {
        document.querySelector(".squad_btn").textContent = "Remove student from squad";
        student.squadTeam = true;
        setTimeout(function() {
          removeSquadTeam(id);
        }, 3000);
        console.log(student.squadTeam);
      } else if (student.id == id && student.squadTeam == true) {
        document.querySelector(".squad_btn").textContent = "Add to squad";
        student.squadTeam = false;
        console.log(student.squadTeam);
      }
    }
  });
}

function removeSquadTeam(id) {
  // "Removing" the student from squad team
  console.log("hello");
  allStudents.forEach(student => {
    if (student.id == id && student.squadTeam == true) {
      student.squadTeam = false;
      console.log(student.squadTeam);
    }
  });
}

function sortAs() {
  // sort by firstname, lastname and house
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
  }

  studentInfo();
}

function filtering() {
  // setting value and making it go to next function where it filters depending on what house is chosen
  house = this.value;
  studentsFiltering = studentsInHouse(house);
  studentInfo();
}

function studentsInHouse(house) {
  // Filtering depending on what house you choose
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

function expellStudents(event) {
  // Expelling students and setting details on the list, with number of students and number of expelled students
  const element = event.target;

  if (element.dataset.action === "expell") {
    const id = element.dataset.id;
    const indexOf = studentsFiltering.findIndex(setId);
    const indexOfAll = allStudents.findIndex(setId);

    function setId(student) {
      if (student.id == id) {
        return true;
      } else {
        return false;
      }
    }
    let studentExpelled = studentsFiltering.slice(indexOf, indexOf + 1);
    if (studentsFiltering[indexOf].firstName === "Sarah") {
    } else {
      element.parentElement.remove();
      studentExpelled = studentExpelled[0];

      expelledList.push(studentExpelled);

      studentsFiltering.splice(indexOf, 1);
      allStudents.splice(indexOfAll, 1);
      expell++;

      document.querySelector(".display_student_number").innerHTML = `Total number of students: ${allStudents.length}`;
      document.querySelector(".display_expelled_students").innerHTML = `Total number of expelled students: ${expelledList.length}`;
    }
    document.querySelector(".expelledbtn").addEventListener("click", openExpelledList);
  }

  StudentsInEachHouse();
}

function StudentsInEachHouse() {
  // Setting detail on the list with the amount of students in each house
  gryffindor = allStudents.filter(object => object.house.includes("Gryffindor"));
  hufflepuf = allStudents.filter(object => object.house.includes("Hufflepuf"));
  slytherin = allStudents.filter(object => object.house.includes("Slytherin"));
  ravenclaw = allStudents.filter(object => object.house.includes("Ravenclaw"));

  document.querySelector(".house_gryffindor").innerHTML = `Students in Gryffindor: ${gryffindor.length}`;
  document.querySelector(".house_hufflepuf").innerHTML = `Students in Hufflepuf: ${hufflepuf.length}`;
  document.querySelector(".house_slytherin").innerHTML = `Students in Slytherin: ${slytherin.length}`;
  document.querySelector(".house_ravenclaw").innerHTML = `Students in Ravenclaw: ${ravenclaw.length}`;
}

function openExpelledList(event) {
  // template with what information will be shown on the student when you open the list of expelled students
  document.querySelector(".student").classList.add(".fade_out");
  const id = event.target.dataset.id;

  document.querySelector("#indhold2").innerHTML = "";
  expelledList.forEach(student => {
    document.querySelector("#indhold2").innerHTML += `
                          
                        <div class="student">
                        <img src="img/${student.imageName}" alt ="" </img>
                        <h2>${student.firstName + " " + student.lastName}</h2>
                        <h3>${student.house}</h3>
                        <p>${student.bloodStatus}</p>
                        <p>${student.prefect}</p>
                            </div>
                        `;
  });
  document.querySelector("#popup2").style.display = "block";
  document.querySelector("#luk2").style.display = "block";
}
document.querySelector("#luk2 button").addEventListener("click", () => {
  document.querySelector("#popup2").style.display = "none";
});

async function fetchJsonBlood() {
  // fetching the second json file, with lastnames, whereafter the bloodstatus is defined of each student.
  let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/families.json");

  bloodStudents = await jsonData.json();

  const halfBloodStudent = bloodStudents.half;
  const pureBloodStudent = bloodStudents.pure;

  findHalfBlood(halfBloodStudent);
  findPureBlood(pureBloodStudent);
}

function findHalfBlood(halfBloodStudent) {
  // setting variables if the student is halfblood
  let half;

  halfBloodStudent.forEach(student => {
    half = student;

    allStudents.forEach(student => {
      if (student.lastName == half) {
        student.bloodStatus = "Halfblood";
      }
    });
  });
}

function findPureBlood(pureBloodStudent) {
  // setting variables if the student is pureblood
  let pure;

  pureBloodStudent.forEach(student => {
    pure = student;

    allStudents.forEach(student => {
      if (student.lastName == pure) {
        student.bloodStatus = "Pureblood";
      }
    });
  });

  hackingBloodStatus();
}

function hackingBloodStatus() {
  // hacking the list, making bloodstatus random
  const arrayOfBloodStatus = ["Pureblood", "Halfblood", "Muggleborn"];
  const bloodStatus = arrayOfBloodStatus[Math.floor(Math.random() * arrayOfBloodStatus.length)];
  allStudents.forEach(student => {
    if (student.bloodStatus === "Halfblood" || student.bloodStatus === "Muggleborn") {
      student.bloodStatus = "Pureblood";
    } else {
      student.bloodStatus = bloodStatus;
    }
    console.log(bloodStatus);
  });
}

function hacked() {
  alert("Hello");
}
