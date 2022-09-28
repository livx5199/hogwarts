"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
let isHackOngoing = false;
let isSortingOngoing = false;

const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: undefined,
    house: "",
    photo: "",
    gender: "",
    pureblood: true,
    expelled: false,
    prefect: false,
    inquisitorial: false,
    searched: false,
    element: ""
}

const settings = {
    filterBy: "all",
    sortBy: "firstname",
    sortDir: "asc"
}

function init() {
    loadStudentsJson();
    registerButtonsAndDropdown();
    // document.querySelector(".expelledstudents").addEventListener("click", showExpelledStudents);
}

//Adds eventlistener to dropdown-menu(filtering) and table(sorting)
function registerButtonsAndDropdown() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));
    document.querySelectorAll("[data-action='sort']")
            .forEach(button => button.addEventListener("click", selectSort));
    document.querySelector("input").addEventListener("input", searchForStudents);

}

//Registers what has been chosen in dropdown
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log("chose" + filter);
    setFilter(filter);

    if (filter === "search") {
        searchForStudents(filter);
    }
    
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
    } else if (settings.filterBy === "inquisitorial") {
        filteredList = allStudents.filter(isInquisitorialSquad);
    } else if (settings.filterBy === "prefects") {
        filteredList = allStudents.filter(isPrefect);
    } else if (settings.filterBy === "search") {
        filteredList = allStudents.filter(isSearchedFor);
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

    isSortingOngoing = true;

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
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
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
        allStudents[i].pureblood = false;
        for (let j = 0; j < data.pure.length; j++){
            if (allStudents[i].lastname === data.pure[j]) {
                allStudents[i].pureblood = true;
                break;
            }
        }
        displayList(allStudents);
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
            } else if (lastName === "Patil") {
                const photoData = "images/" + lastName + "_" + firstName.substring(0) + ".png";
                return photoData;
            } else if (lastName === "Leanne") {
                const photoData = "/no photo.png";
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
            // console.log(middleNameToString);
            // if (middleNameToString.toLowerase().includes(/"/)) {
            //     const cleanedNickName = cleanData(nickNameToString);
            //     console.log(cleanedNickName);
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

function searchForStudents() {
    const input = document.querySelector("input");
    const value = input.value.toLowerCase();
    const searchedStudents = [];

    allStudents.forEach(student => {    
        if (student.firstname.toLowerCase().includes(value) || student.lastname.toLowerCase().includes(value)) {
                makeSearchedFor(student);
        } else {
            return false;
        }
    })

    function makeSearchedFor(student) {
        student.searched = true;
        searchedStudents.push(student);
    }

    displayList(searchedStudents);
}

function isSearchedFor(student) {
    return student.searched === true;
}

function buildList() {
    //Makes a variable out of the filtered students and sends it to displayList()
    const currentList = filtering(allStudents);
    //Makes a variable out of the sorted students and sends it to displayList()
    const sortedList = sortList(currentList);

    displayList(sortedList);
    // if (isSortingOngoing = false) {
    //     displayList(currentList);
    //     searchForStudents(currentList);
    // } else {
    //     displayList(sortedList);
    // }
    return sortedList;
}

function displayList(allStudents) {
    //clears the list
    document.querySelector("main").innerHTML = "";
    showStats(allStudents);

    //builds a new list
    allStudents.forEach(displayStudent);
}

function showStats(selectedStudents) {
    document.querySelector("[data-stats=studentsdisplayed]").textContent = `Students displayed: ${selectedStudents.length}`;
    document.querySelector("[data-stats=studentstotal]").textContent = `Total number of students: ${allStudents.length}`;
    document.querySelector("[data-stats=studentsexpelled]").textContent = `Expelled students:
     ${allStudents.filter(student => student.expelled === true).length}`;
    document.querySelector("[data-stats=studentsgryffindor]").textContent = `Students in Gryffindor:
     ${allStudents.filter(student => student.house === "Gryffindor").length}`;
    document.querySelector("[data-stats=studentshufflepuff]").textContent = `Students in Hufflepuff:
     ${allStudents.filter(student => student.house === "Hufflepuff").length}`;
    document.querySelector("[data-stats=studentsslytherin]").textContent = `Students in Slytherin:
     ${allStudents.filter(student => student.house === "Slytherin").length}`;
    document.querySelector("[data-stats=studentsravenclaw]").textContent = `Students in Ravenclaw:
     ${allStudents.filter(student => student.house === "Ravenclaw").length}`;
}

function displayStudent(student) {
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    if (student.middlename === undefined) {
        clone.querySelector("[data-field=firstname]").textContent = `${student.firstname} ${student.lastname}`
    } else {
        clone.querySelector("[data-field=firstname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`
    }

    clone.querySelector("[data-field=photo]").src = student.photo;
    // clone.querySelector("[data-field=gender]").textContent = `Gender: ${student.gender}`;
    // clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
    clone.querySelector("[data-field=blood]").dataset.blood = student.pureblood;


    if (student.house === "Hufflepuff") {
        clone.querySelector(".grid").style.background = "rgb(83, 78, 10)";

        } else if (student.house === "Slytherin") {
        clone.querySelector(".grid").style.background = "rgb(7, 43, 9)";
        } else if (student.house === "Gryffindor") {
        clone.querySelector(".grid").style.background = "rgb(74, 19, 21)";
        } else if (student.house === "Ravenclaw") {
        clone.querySelector(".grid").style.background = "rgb(17, 19, 68)";
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

        buildList();
    }

    //Inquisitorial squad
    clone.querySelector("[data-field=inquisitorial]").dataset.inquisitorial = student.inquisitorial;
    clone.querySelector("[data-field=inquisitorial]").addEventListener("click", clickInquisitorial);
    function clickInquisitorial() {
        if (student.inquisitorial === true) {
            student.inquisitorial = false;
        } else {
            tryToMakeInquisitorialSquad(student);
        }

        buildList();
    }

    clone.querySelector(".details").addEventListener("click", () => displayStudentDetails(student));
    
    document.querySelector("main").appendChild(clone);
}

function tryToMakeAPrefect(selectedStudent) {

    const prefects = allStudents.filter(student => student.prefect === true);
    //console.log(prefects);
    const sameHouse = prefects.filter(student => student.house === selectedStudent.house);
    //console.log(sameHouse);

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
        document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeAorBDialog);

        document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

        document.querySelector("#remove_aorb [data-field=prefecta]").textContent = prefectA.firstname;
        document.querySelector("#remove_aorb [data-field=prefectb]").textContent = prefectB.firstname;

        function closeAorBDialog() {
            document.querySelector("#remove_aorb").classList.add("hide");
            document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeAorBDialog);

            document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
            document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
        }

        function clickRemoveA() {
            removePrefect(prefectA);
            makePrefect(selectedStudent);
            buildList();
            closeAorBDialog();
        }

        function clickRemoveB() {
            removePrefect(prefectB);
            makePrefect(selectedStudent);
            buildList();
            closeAorBDialog();
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

function isPrefect(student) {
    return student.prefect === true;
}

function tryToMakeInquisitorialSquad(selectedStudent) {
    if (selectedStudent.pureblood === true || selectedStudent.house === "Slytherin") {
        makeInquisitorialSquad(selectedStudent);
            console.log(selectedStudent);
    } else {
        notElligibleForInquisitorialSquad();
    }

    function notElligibleForInquisitorialSquad() {
        document.querySelector("#inquisitorial").classList.remove("hide");
        document.querySelector("#inquisitorial .closebutton").addEventListener("click", closeInquisitorialDialog);
        document.querySelector("#inquisitorial .okbutton").addEventListener("click", closeInquisitorialDialog);

    }

    function closeInquisitorialDialog() {
        document.querySelector("#inquisitorial").classList.add("hide");
        document.querySelector("#inquisitorial .closebutton").removeEventListener("click", closeInquisitorialDialog);
            document.querySelector("#inquisitorial .okbutton").removeEventListener("click", closeInquisitorialDialog);
    }

    function makeInquisitorialSquad(student) {

        if (isHackOngoing === true) {
            student.inquisitorial = true;
            setTimeout(() => {
                removeInquisitorialSquad(student);
            }, 5000);
        } else {
            student.inquisitorial = true;
        }
    }

    function removeInquisitorialSquad(student) {
        student.inquisitorial = false;
        buildList();
        console.log(student.inquisitorial);
    }
}

function isInquisitorialSquad(student) {
    return student.inquisitorial === true;
}

function displayStudentDetails(student) {
    document.querySelector("#singleview").classList.remove("hide");
    
    const expellbutton = document.getElementById("expell");
    expellbutton.addEventListener("click", () => expellStudent(student));

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
    document.querySelector("[data-single=prefect]").dataset.prefect = student.prefect;
    document.querySelector("[data-single=blood]").dataset.blood = student.pureblood;
    document.querySelector("[data-single=inquisitorial]").dataset.inquisitorial = student.inquisitorial;

    if (student.pureblood === true) {
        document.querySelector("[data-single=bloodstatus]").textContent = `Blood status: Pureblood`;
    } else {
        document.querySelector("[data-single=bloodstatus]").textContent = `Blood status: Halfblood`;
    }

    document.querySelector("#singleview .closebutton").addEventListener("click", closeStudentDetails);
        
    function closeStudentDetails() {
            
            expellbutton.removeEventListener("click", () => expellStudent(student));
            document.querySelector("#singleview .closebutton").removeEventListener("click", closeStudentDetails);
            document.querySelector("#singleview").classList.add("hide");
        }
    
    if (student.house === "Hufflepuff") {
        document.querySelector(".dialog").style.background = "rgb(83, 78, 10)";
        document.querySelector("[data-field=housecrest]").src = "/hufflepuff.png"
    } else if (student.house === "Slytherin") {
        document.querySelector(".dialog").style.background = "rgb(7, 43, 9)";
        document.querySelector("[data-field=housecrest]").src = "/slytherin.png"
    } else if (student.house === "Gryffindor") {
        document.querySelector(".dialog").style.background = "rgb(74, 19, 21)";
        document.querySelector("[data-field=housecrest]").src = "/gryffindor.png"
    } else if (student.house === "Ravenclaw") {
        document.querySelector(".dialog").style.background = "rgb(17, 19, 68)";
        document.querySelector("[data-field=housecrest]").src = "/ravenclaw.png"
    }

}

function expellStudent(student) {
    // const hackedStudent = makeHackedStudent();
    // console.log(hackedStudent);
    // console.log(student);

    if (student.lastname === "Thrane") {
        console.log(student);
        cannotBeExpelled();  
    } else {
        console.log(student, " is expelled")
        makeExpelled(student);
    }

    function cannotBeExpelled() {
        console.log(student);
        document.querySelector("#cannotbeexpelled").classList.remove("hide");
        document.querySelector("#cannotbeexpelled .closebutton").addEventListener("click", closeExpulsionDialog);
        document.querySelector("#cannotbeexpelled .okbutton").addEventListener("click", closeExpulsionDialog);
    

        function closeExpulsionDialog() {
            document.querySelector("#cannotbeexpelled .closebutton").removeEventListener("click", closeExpulsionDialog);
            document.querySelector("#cannotbeexpelled .okbutton").removeEventListener("click", closeExpulsionDialog);
            document.querySelector("#cannotbeexpelled").classList.add("hide");
        }
    }

    function makeExpelled(student) {
        student.expelled = true;
        buildList();
    }

    //Prefects
    document.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;

    document.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

    function clickPrefect() {
        if (student.prefect === true) {
            student.prefect = false;
        } else {
            tryToMakeAPrefect(student);
        }

        buildList();
    }
    
    // document.querySelector("[data-single-expelled]").textContent = "EXPELLED";
}

function isExpelled(student) {
    return student.expelled === true;
}

function hackTheSystem() {

    isHackOngoing = true;
    
    document.querySelector("body").classList.add("hackingbackground");
    //Add hacked student to student list
    const hackedStudent = makeHackedStudent();
    allStudents.push(hackedStudent);
    buildList();
    console.log(allStudents);
    document.querySelector(".slogan").textContent = "we are watching you";
    document.querySelector(".slogan").style.color = "red";
    messWithBloodstatus();
}

//Messing with bloodstatus
function messWithBloodstatus() {
  allStudents.forEach(student => {
        const bloodtypes = [true, false];
        const value = bloodtypes[Math.floor(Math.random() * bloodtypes.length)];
            if (student.pureblood === true) {
                student.pureblood = value;
                console.log(student.pureblood);
            } else {
                student.pureblood = true;
            }
    })
    buildList();  
}

function makeHackedStudent() {
    const hackedStudent = Object.create(Student);

    hackedStudent.firstname = "Liv";
    hackedStudent.middlename = "Lilholt";
    hackedStudent.lastname = "Thrane";
    hackedStudent.nickname = undefined;
    hackedStudent.house = "Slytherin";
    hackedStudent.photo = "";
    hackedStudent.gender = "girl";
    hackedStudent.bloodstatus = "Halfblood";
    hackedStudent.expelled = false;
    hackedStudent.prefect = false;
    hackedStudent.inquisitorial = false;
    return hackedStudent;
}