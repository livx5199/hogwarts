"use strict";

window.addEventListener("DOMContentLoaded", init);

const allStudents = [];
const Student = {
    firstname: "",
    middlename: "",
    lastname: "",
    nickname: "",
    house: "",
    photo: "",
}

function init() {
    loadJson();
}

function loadJson() {
    //fetching json document
    fetch("students.json")
        //responding to fetch
        .then(response => response.json())
        //taking the rendered json data and sending it to prepareObjects-function
        .then(jsonData => {
            cleanData(jsonData);
        });
}

function cleanData(data) {
    data.forEach(object => {
        jsonObject.fullname.
    })
}

function prepareObjects(data) {
    data.forEach(object => {

    })
    console.log(data);
    displayList();
}

function displayList() {
    //clears the list
    document.querySelector("#list tbody").innerHTML = "";

    //builds a new list
    allStudents.forEach(displayStudent);
}

function displayStudent(student) {

}