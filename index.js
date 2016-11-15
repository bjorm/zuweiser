const _ = require('lodash');

const {readExcel, getRowsAsObjects} = require('./reader');
const {match} = require('./matcher');
const {writeMatch} = require('./writer');
const {convertStudent, convertCourse} = require('./model');

const config = {
    filename: './projektwoche.xlsx',
    student: { 
        worksheet: 'Schüler',
        fields: {
            id: 'id',
            name: 'Name',
            firstName: 'Vorname',
            prio1: 'Prio 1',
            prio2: 'Prio 2',
            prio3: 'Prio 3'
        }
    },
    courses: { 
        worksheet: 'Kurse',
        fields: {
            limit: 'Max. Teilnehmer',
            id: 'id',
            name: 'Name'
        }
    }
};

function readCourses(workbook) {
    let rawCourses = getRowsAsObjects(workbook, config.courses.worksheet);
    let courses = rawCourses.map(rawCourse => convertCourse(rawCourse, config.courses.fields));
    return { courses, workbook };
}

function readStudents({ workbook, courses }) {
    let rawStudents = getRowsAsObjects(workbook, config.student.worksheet);
    let students = rawStudents.map(rawStudent => convertStudent(rawStudent, config.student.fields));
    return { workbook, students, courses };
}

readExcel(config.filename)
    .then(readCourses)
    .then(readStudents)
    .then(match)
    .then(writeMatch);

