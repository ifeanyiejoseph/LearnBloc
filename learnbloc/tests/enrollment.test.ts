import { describe, it, expect, beforeEach } from "vitest"

const mockContract = {
  admin: "STADMIN123",
  enrollments: new Map<string, boolean>(),
  coursePrices: new Map<number, number>(),
  courseOwners: new Map<number, string>(),

  isAdmin(caller: string) {
    return caller === this.admin
  },

  registerCourse(caller: string, courseId: number, price: number, educator: string) {
    if (!this.isAdmin(caller)) {
      return { error: 100 } // ERR-NOT-AUTHORIZED
    }
    this.coursePrices.set(courseId, price)
    this.courseOwners.set(courseId, educator)
    return { value: true }
  },

  enroll(caller: string, courseId: number, payment: number) {
    const price = this.coursePrices.get(courseId)
    const educator = this.courseOwners.get(courseId)
    const key = `${caller}-${courseId}`

    if (price === undefined || educator === undefined) {
      return { error: 103 } // ERR-INVALID-COURSE
    }

    if (payment !== price) {
      return { error: 104 } // ERR-INVALID-FEE
    }

    if (this.enrollments.has(key)) {
      return { error: 101 } // ERR-ALREADY-ENROLLED
    }

    // simulate STX transfer success
    this.enrollments.set(key, true)
    return { value: true }
  },

  isEnrolled(student: string, courseId: number) {
    return this.enrollments.get(`${student}-${courseId}`) === true
  },

  dropStudent(caller: string, student: string, courseId: number) {
    if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED

    const key = `${student}-${courseId}`
    if (!this.enrollments.has(key)) return { error: 102 } // ERR-NOT-ENROLLED

    this.enrollments.delete(key)
    return { value: true }
  },

  transferAdmin(caller: string, newAdmin: string) {
    if (!this.isAdmin(caller)) return { error: 100 }
    this.admin = newAdmin
    return { value: true }
  },
}

describe("LearnBloc Enrollment Contract", () => {
  beforeEach(() => {
    mockContract.admin = "STADMIN123"
    mockContract.enrollments.clear()
    mockContract.coursePrices.clear()
    mockContract.courseOwners.clear()
  })

  it("registers a course by admin", () => {
    const result = mockContract.registerCourse("STADMIN123", 1, 5000000, "STEDUCATOR1")
    expect(result).toEqual({ value: true })
  })

  it("fails to register course by non-admin", () => {
    const result = mockContract.registerCourse("STUSER1", 1, 5000000, "STEDUCATOR1")
    expect(result).toEqual({ error: 100 })
  })

  it("allows enrollment with correct fee", () => {
    mockContract.registerCourse("STADMIN123", 2, 5000000, "STEDUCATOR2")
    const result = mockContract.enroll("STSTUDENT1", 2, 5000000)
    expect(result).toEqual({ value: true })
    expect(mockContract.isEnrolled("STSTUDENT1", 2)).toBe(true)
  })

  it("fails enrollment with wrong fee", () => {
    mockContract.registerCourse("STADMIN123", 3, 5000000, "STEDUCATOR3")
    const result = mockContract.enroll("STSTUDENT2", 3, 1000000)
    expect(result).toEqual({ error: 104 })
  })

  it("fails duplicate enrollment", () => {
    mockContract.registerCourse("STADMIN123", 4, 1000000, "STEDUCATOR4")
    mockContract.enroll("STSTUDENT3", 4, 1000000)
    const result = mockContract.enroll("STSTUDENT3", 4, 1000000)
    expect(result).toEqual({ error: 101 })
  })

  it("drops a student from a course", () => {
    mockContract.registerCourse("STADMIN123", 5, 2000000, "STEDUCATOR5")
    mockContract.enroll("STSTUDENT4", 5, 2000000)
    const result = mockContract.dropStudent("STADMIN123", "STSTUDENT4", 5)
    expect(result).toEqual({ value: true })
    expect(mockContract.isEnrolled("STSTUDENT4", 5)).toBe(false)
  })

  it("fails to drop student by non-admin", () => {
    mockContract.registerCourse("STADMIN123", 6, 3000000, "STEDUCATOR6")
    mockContract.enroll("STSTUDENT5", 6, 3000000)
    const result = mockContract.dropStudent("STUSER", "STSTUDENT5", 6)
    expect(result).toEqual({ error: 100 })
  })

  it("transfers admin rights", () => {
    const result = mockContract.transferAdmin("STADMIN123", "STNEWADMIN")
    expect(result).toEqual({ value: true })
    expect(mockContract.admin).toBe("STNEWADMIN")
  })
})
