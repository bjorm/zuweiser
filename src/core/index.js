import {getRowsAsObjects} from './reader'
import {convertStudent, convertCourse} from './model'

export {match} from './matcher'
export {readExcel, getOverview} from './reader'

export function readCourses({ workbook, config }) {
    let rawCourses = getRowsAsObjects(workbook, config.courses.worksheet)
    let courses = rawCourses.map(rawCourse => convertCourse(rawCourse, config.courses.fields))
    return { courses, workbook, config }
}

export function readStudents({ workbook, courses, config }) {
    let rawStudents = getRowsAsObjects(workbook, config.student.worksheet)
    let students = rawStudents.map(rawStudent => convertStudent(rawStudent, config.student.fields))
    return { workbook, students, courses, config }
}