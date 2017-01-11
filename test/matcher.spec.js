/* globals describe, it */
const assert = require('assert')
const expect = require('expect.js')

const {match} = require('../src/matcher')
const {Student, Course} = require('../src/model')

function hasExactParticipants(activity, ...students) {
    assert.equal(activity.students.length, students.length)
    students.forEach((student, index) => {
        assert.equal(student, activity.students[index]) 
    })
}

describe('matcher module', () => {
    describe('#match()', () => {
        it('should match single participant to single activity', () => {
            const student = new Student({ priorities: [1], id: 1 })
            const course = new Course({ id: 1, name: 'activity 1', limit: 1 })

            const {students, courses} = match({ students: [student], courses: [course] })

            assert.equal(students[0].matched, true)
            assert.equal(courses[0].students[0], student)
            assert.equal(courses[0].students.length, 1)
        })

        it('should not match any more participants to an activity once its limit is reached', () => {
            const student1 = new Student({ priorities: [1], id: 1 })
            const student2 = new Student({ priorities: [1], id: 2 })
            const course = new Course({ id: 1, name: 'activity 1', limit: 1 })

            const {students, courses} = match({ students: [student1, student2], courses: [course] })

            assert.equal(students[0].matched, true)
            assert.equal(courses[0].students[0], student1)
            assert.equal(courses[0].students.length, 1)
            assert.equal(student2.matched, false)
        })

        it('should match multiple participants and activities', () => {
            const student1 = new Student({ priorities: [1, 2, 3], id: 1 })
            const student2 = new Student({ priorities: [1, 3, 2], id: 2 })
            const student3 = new Student({ priorities: [1, 3, 2], id: 3 })
            const student4 = new Student({ priorities: [3, 2, 1], id: 4 })
            const student5 = new Student({ priorities: [3, 1, 2], id: 5 })
            const course1 = new Course({ id: 1, name: 'activity 1', limit: 2 })
            const course2 = new Course({ id: 2, name: 'activity 2', limit: 2 })
            const course3 = new Course({ id: 3, name: 'activity 3', limit: 1 })

            match({ 
                students: [student1, student2, student3, student4, student5], 
                courses: [course1, course2, course3] 
            })

            hasExactParticipants(course1, student1, student2)         
            hasExactParticipants(course2, student3, student5)
            hasExactParticipants(course3, student4)
        })

        it('should fail if participants ids are not unique', () => {
            const student1 = new Student({ priorities: [], id: 1 })
            const student2 = new Student({ priorities: [], id: 1 })

            expect(match)
                .withArgs({ students: [student1, student2], courses: [] })
                .to.throwException(/Participants' ids not unique/)
        })

        it('should fail if course ids are not unique', () => {
            const course1 = new Course({ id: 1 })
            const course2 = new Course({ id: 1 })

            expect(match)
            .withArgs({ students: [], courses: [course1, course2] })
            .to.throwException(/Activities' ids not unique/)
        })

        it('should fail if chosen activity does not exist', () => { 
            const student1 = new Student({ priorities: [2], id: 1 })
            const course1 = new Course({ id: 1, name: 'activity 1', limit: 1 })

            expect(match)
            .withArgs({ students: [student1], courses: [course1] })
            .to.throwException(/Activity does not exist/)
        })

        it('should fail if choices per participant are not unique', () => {
            const student1 = new Student({ priorities: [1, 1], id: 1 })
            const course1 = new Course({ id: 1, name: 'activity 1', limit: 1 })

            expect(match)
            .withArgs({ students: [student1], courses: [course1] })
            .to.throwException(/Choices not unique/)
        })
    })
})