"use strict";

window.addEventListener("DOMContentLoaded", init);

const pureBloods = [];
const halfBloods = [];
const allStudents = [];

const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: undefined,
    house: "",
    photo: "",
    gender: "",
    bloodstatus: "",
    expelled: false,
    prefect: false
}

const Bloodstatus = {
    lastname: "",
    pure: true
}

const settings = {
    filterBy: "all",
    sortBy: "firstname",
    sortDir: "asc"
}

function init() {
    loadStudentsJson();
    registerDropdown();
    // document.querySelector(".expelledstudents").addEventListener("click", showExpelledStudents);
}

//Adds eventlistener to dropdown-menu(filtering) and table(sorting)
function registerDropdown() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));

    
        document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));
}

//Registers what has been chosen in dropdown
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("chose" + filter);
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
    } else if (settings.filterBy === "ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    } else if (settings.filterBy === "expelled") {
        filteredList = allStudents.filter(isExpelled);
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

function selectSort(event) {

    //Applies target data to sortBy and sortDir properties
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //Finds old sortBy element
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");

    //Indicates active sort
    event.target.classList.add("sortby");

    //Toggles direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }

    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList) { 
    let direction = 1;
    if (settings.sortDir === "desc") {
        direction = -1;
    } else {
        settings.direction = 1;
    }
    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }    
    return sortedList;
}

function loadStudentsJson() {
    //fetching json document
    fetch("students.json")
    .then( response => response.json() )
    .then( jsonData => {
        // when loaded, prepare objects
        prepareObjects( jsonData );
    });
}

function loadFamiliesJson() {
    fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then( response => response.json() )
    .then( jsonData => {
   prepareBloodStatusData(jsonData);
    });
}

function prepareBloodStatusData(data) {

   
    for (let i = 0; i < allStudents.length; i++) {
        allStudents[i].bloodstatus = "Halfblood";
        for (let j = 0; j < data.pure.length; j++){
            if (allStudents[i].lastname === data.pure[j]) {
                allStudents[i].bloodstatus = "Pureblood";
                break;
            }
        }
buildList();
    }

    
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
        const photo = preparePhoto();
        // const bloodStatus = prepareBloodStatus(student);

        //Photo
        function preparePhoto() {
            if (lastName !== undefined && lastName.indexOf("-") !== -1) {
                const photoData = "images/" + lastName.substring(lastName.indexOf("-") + 1) + "_" + firstName.substring(0, 1) + ".png";
                return photoData;
            } else {
                const photoData = "images/" + lastName + "_" + firstName.substring(0, 1) + ".png";
                return photoData;
            }        
        }
        
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
            // const middlename = splitArray.length - 2;
            // const middleNameToString = splitArray[middlename];
            // if (NameToString.search(/"/) === 0) {
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
        student.photo = photo;
            
        //Push objects to allStudents
        allStudents.push(student);
        displayList(allStudents);
        loadFamiliesJson();

    })
}

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
        // } else if (data.search(/"/) === 0) {
        //     const casedData = data.substring(1, 2).toUpperCase() + data.substring(2).toLowerCase();
        //     console.log(caseData);
        //     return casedData;
        } else {
            const firstCasedName = data.substring(0, 1).toUpperCase() + data.substring(1, data.indexOf("-") + 1).toLowerCase();
            const secondCasedName = data.substring(data.indexOf("-") + 1, data.indexOf("-") + 2).toUpperCase() + data.substring(data.indexOf("-") + 2).toLowerCase();
            const casedData = firstCasedName + secondCasedName;
            return casedData;
        }
    }
    
    return trimmedAndCasedData;
}

// function searchForStudents(sortedList) {
//     const input = document.getElementById('searchbar');
//     const button = document.querySelector(".searchbutton");
//     const filter = input.value;
//     let i;
//     console.log(sortedList);
//     button.addEventListener("click", startSearch);

//     function startSearch() {
//         for (i = 0; i < sortedList.length; i++) {
//             if (filter === sortedList.firstname) {
//                 console.log("true");
//             }
//         }
//     }


// }

function buildList() {
    //Makes a variable out of the filtered students and sends it to displayList()
    const currentList = filtering(allStudents);
    //Makes a variable out of the sorted students and sends it to displayList()
    const sortedList = sortList(currentList);
    displayList(sortedList);
    
    return sortedList;
}

function displayList(allStudents) {
    //clears the list
    document.querySelector("main").innerHTML = "";

    //builds a new list
    allStudents.forEach(displayStudent);

    // searchForStudents(allStudents);
}

function displayStudent(student) {
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    if (student.middlename === undefined) {
        clone.querySelector("[data-field=firstname]").textContent = `Name: ${student.firstname} ${student.lastname}`
    } else {
        clone.querySelector("[data-field=firstname]").textContent = `Name: ${student.firstname} ${student.middlename} ${student.lastname}`
    }

    clone.querySelector("[data-field=photo]").src = student.photo;
    clone.querySelector("[data-field=gender]").textContent = `Gender: ${student.gender}`;
    clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
    clone.querySelector("[data-field=blood]").textContent = `Bloodstatus: ${student.bloodstatus}`;

    if (student.house === "Hufflepuff") {
            clone.querySelector(".grid").style.background = "#b2a713";
        } else if (student.house === "Slytherin") {
            clone.querySelector(".grid").style.background = "#60a963";
        } else if (student.house === "Gryffindor") {
            clone.querySelector(".grid").style.background = "#a9272b";
        } else if (student.house === "Ravenclaw") {
        clone.querySelector(".grid").style.background = "#383c96";
    }

    //Prefects
    clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;

    clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

    function clickPrefect() {
        if (student.prefect === true) {
            student.prefect = false;
        } else {
            tryToMakeAPrefect(student);
        }

        // buildList();
    }

    //Inquisitorial squad
    function clickInquisitorial() {}

    clone.querySelector(".details").addEventListener("click",  () => displayStudentDetails(student));

    document.querySelector("main").appendChild(clone);
}

function tryToMakeAPrefect(selectedStudent) {

    const prefects = allStudents.filter(student => student.prefect === true);
    const sameHouse = prefects.filter(student => student.house === selectedStudent.house);
    console.log(sameHouse);

    if (sameHouse.length > 1) {
        console.log("There can only be two prefects of each house");
        removeAOrB(sameHouse[0], sameHouse[1]);
    } else {
        makePrefect(selectedStudent);
        console.log(`${selectedStudent.firstname} becomes prefect`); 
    }


    function removeAOrB(prefectA, prefectB) {
        //ask user to ignore or remove a or b
        document.querySelector("#remove_aorb").classList.remove("hide");
        document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);

        document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

        document.querySelector("#remove_aorb [data-field=prefecta]").textContent = prefectA.firstname;
        document.querySelector("#remove_aorb [data-field=prefectb]").textContent = prefectB.firstname;

        function closeDialog() {
            document.querySelector("#remove_aorb").classList.add("hide");
            document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);

            document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
            document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
        }

        function clickRemoveA() {
            removePrefect(prefectA);
            makePrefect(selectedStudent);
            // buildList();
            closeDialog();
        }

        function clickRemoveB() {
            removePrefect(prefectB);
            makePrefect(selectedStudent);
            // buildList();
            closeDialog();
        }
    }

    function removePrefect(prefectStudent) {
        prefectStudent.prefect = false;
        console.log(prefectStudent);
    }

    function makePrefect(student) {
        student.prefect = true;
        console.log(sameHouse);
    }
}

function displayStudentDetails(student) {
    document.querySelector("#singleview").classList.remove("hide");

    document.querySelector("[data-single=firstname]").textContent = `First name: ${student.firstname}`

    if (student.middlename === undefined) {
        document.querySelector("[data-single=middlename]").textContent = `Middle name: -`
    } else {
        document.querySelector("[data-single=middlename]").textContent = `Middle name: ${student.middlename}`
    }
    document.querySelector("[data-single=lastname]").textContent = `Last name: ${student.lastname}`
    document.querySelector("[data-single=photo]").src = student.photo;
    document.querySelector("[data-single=gender]").textContent = `Gender: ${student.gender}`;
    document.querySelector("[data-single=house]").textContent = `House: ${student.house}`;
    document.querySelector(".closebutton").addEventListener("click", closeStudentDetails);
        
        function closeStudentDetails() {
            document.querySelector("#singleview").classList.add("hide");
        }
    
    if (student.house === "Hufflepuff") {
            document.querySelector(".dialog").style.background = "#b2a713";
    } else if (student.house === "Slytherin") {
            document.querySelector(".dialog").style.background = "#60a963";
    } else if (student.house === "Gryffindor") {
            document.querySelector(".dialog").style.background = "#a9272b";
    } else if (student.house === "Ravenclaw") {
        document.querySelector(".dialog").style.background = "#383c96";
    }

    document.querySelector("#expell").addEventListener("click", () => expellStudent(student));
}

function expellStudent(student) {
    student.expelled = true;
    // document.querySelector("[data-single-expelled]").textContent = "EXPELLED";
}

function isExpelled(student) {
    return student.expelled === true;
}