"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: undefined,
    house: "",
    photo: "",
    gender: ""
}

const settings = {
    filterBy: "all"
}

function init() {
    loadJson();
    registerDropdown();
}

//Adds eventlistener to dropdown-menu(filtering)
function registerDropdown() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));
}

//Registers what has been chosen in dropdown
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("user selected", filter);
    
    setFilter(filter);
}

//Assigns value of filter to the "filterBy" property
function setFilter(filter) {
    settings.filterBy = filter;
    
    buildList();
}

//Recieves what house the filter is, and defines the filteredList variable. Returns it to buildList()
function filtering(filteredList) {
    if (settings.filterBy === "gryffindor") {
        filteredList = allStudents.filter(isGryffindor);
    } else if (settings.filterBy === "hufflepuff") {
        filteredList = allStudents.filter(isHufflepuff);
    } else if (settings.filterBy === "slytherin") {
        filteredList = allStudents.filter(isSlytherin);
    }else if (settings.filterBy === "ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    } else {
        filteredList = allStudents;
}
    return filteredList;
}


function isGryffindor(student) {
    return student.house === "Gryffindor";
}

function isHufflepuff(student) {
    return student.house === "Hufflepuff";
}

function isSlytherin(student) {
    return student.house === "Slytherin";
}

function isRavenclaw(student) {
    return student.house === "Ravenclaw";
}

function loadJson() {
    //fetching json document
    fetch("students.json")
        //responding to fetch
        .then(response => response.json())
        //taking the rendered json data and sending it to prepareObjects-function
        .then(jsonData => {
            prepareObjects(jsonData);
        });
}

function prepareObjects(jsonData) {
    jsonData.forEach(object => {

        //Trim and split json.fullname into array
        const trimmedArray = object.fullname.trim();
        const splitArray = trimmedArray.split(" ");

        const student = Object.create(Student);

        const firstName = prepareFirstName();
        const middleName = prepareMiddleName();
        const lastName = prepareLastName();
        const nickName = prepareNickName();
        const house = prepareHouse();
        const gender = prepareGender();

        
        //First name
        function prepareFirstName() {
            const FirstName = splitArray[0];
            const cleanedFirstName = cleanData(FirstName);
            // console.log(cleanedFirstName);
            return cleanedFirstName;
            // console.table(allStudents);
        }
        
        //Middle name
        function prepareMiddleName() {
            if (splitArray.length > 2) {
                const middlename = splitArray.length - 2;
                const middleNameToString = splitArray[middlename];
                const cleanedMiddleName = cleanData(middleNameToString);
                return cleanedMiddleName;
                
            } else {
                student.middlename = undefined;
            }
        }

        //Nick name
        function prepareNickName() {
            // console.log(splitArray.indexOf(' " '));
            // if (middleName.contains("\"")) {
            //     const nickname = splitArray.length - 2;
            //     const nickNameToString = splitArray[nickname];
            //     const cleanedNickName = cleanData(nickNameToString);
            //     return cleanedNickName;
            // }
        }

        //Last name
        function prepareLastName() {
            const lastname = splitArray.length - 1;
            const lastNameToString = splitArray[lastname];
            const casedData = cleanData(lastNameToString);
            return casedData;
        }

        //House
        function prepareHouse() {
            const houseToString = object.house;
            const cleanedHouse = cleanData(houseToString);
            return cleanedHouse;
        }

        //Gender
        function prepareGender() {
            const genderToString = object.gender;
            const cleanedGender = cleanData(genderToString);
            return cleanedGender;
        }

        //Apply cleaned data variables to object
        student.firstname = firstName;
        student.middlename = middleName;
        student.lastname = lastName;
        student.nickname = nickName;
        student.house = house;
        student.gender = gender;
        // console.log(student.middlename);
            
        //Push objects to allStudents
        allStudents.push(student);
        // console.log(allStudents);
        displayList(allStudents);
    })
    
}
console.log(allStudents);

function cleanData(data) {
    const dataToClean = data;
    const trimmedData = trimData();
    const trimmedAndCasedData = caseData(trimmedData);
    // console.log(trimmedAndCasedData);

    function trimData() {
        const trimmedData = data.trim();
        return trimmedData;
    }

    function caseData(data) {
        if (data.indexOf("-") === -1) {
            const casedData = data.substring(0, 1).toUpperCase() + data.substring(1).toLowerCase();
            return casedData;
        } else {
            const firstCasedName = data.substring(0, 1).toUpperCase() + data.substring(1, data.indexOf("-") + 1).toLowerCase();
            const secondCasedName = data.substring(data.indexOf("-") + 1, data.indexOf("-") + 2).toUpperCase() + data.substring(data.indexOf("-") + 2).toLowerCase();
            const casedData = firstCasedName + secondCasedName;
            return casedData;
        }
    }
    
    return trimmedAndCasedData;
}


function buildList() {
    //Makes a variable out of the filtered students and sends it to displayList()
    const currentList = filtering(allStudents);

    displayList(currentList);
    console.log(currentList);
}

function displayList(allStudents) {
    //clears the list
    document.querySelector("main").innerHTML = "";

    //builds a new list
    allStudents.forEach(displayStudent);
}

function displayStudent(student) {
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    if (student.middlename === undefined) {
        clone.querySelector("[data-field=firstname]").textContent = `Name: ${student.firstname} ${student.lastname}`
    } else {
        clone.querySelector("[data-field=firstname]").textContent = `Name: ${student.firstname} ${student.middlename} ${student.lastname}`
    }
    clone.querySelector("[data-field=photo]").src = "images/" + student.lastname + "_" + student.firstname.substring(0,1) + ".png";
    clone.querySelector("[data-field=gender]").textContent = `Gender: ${student.gender}`;
    clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;

    if (student.house === "Hufflepuff") {
            clone.querySelector(".grid").style.background = "#b2a713";
        } else if (student.house === "Slytherin") {
            clone.querySelector(".grid").style.background = "#60a963";
        } else if (student.house === "Gryffindor") {
            clone.querySelector(".grid").style.background = "#a9272b";
        } else if (student.house === "Ravenclaw") {
        clone.querySelector(".grid").style.background = "#383c96";
        }
    document.querySelector("main").appendChild(clone);
    
    
    
}