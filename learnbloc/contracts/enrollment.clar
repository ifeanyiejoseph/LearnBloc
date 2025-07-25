;; LearnBloc - Enrollment Contract
;; Author: You

(define-data-var admin principal tx-sender)

;; Maps a student to enrolled course IDs
(define-map enrollments { student: principal, course-id: uint } bool)

;; Maps course ID to price (in microSTX)
(define-map course-prices uint uint)

;; Maps course ID to educator address
(define-map course-owners uint principal)

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-ENROLLED u101)
(define-constant ERR-NOT-ENROLLED u102)
(define-constant ERR-INVALID-COURSE u103)
(define-constant ERR-INVALID-FEE u104)

;; Admin check
(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;; Register a course (admin only)
(define-public (register-course (course-id uint) (price uint) (educator principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-set course-prices course-id price)
    (map-set course-owners course-id educator)
    (ok true)))

;; Enroll in a course (student pays educator)
(define-public (enroll (course-id uint))
  (let (
    (course-price (default-to u0 (map-get? course-prices course-id)))
    (educator (map-get? course-owners course-id))
  )
    (begin
      (asserts! (is-some educator) (err ERR-INVALID-COURSE))
      (asserts! (is-eq course-price (to-uint tx-value)) (err ERR-INVALID-FEE))
      (asserts! (is-none (map-get? enrollments { student: tx-sender, course-id: course-id })) (err ERR-ALREADY-ENROLLED))
      (let ((educator-addr (unwrap! educator (err ERR-INVALID-COURSE))))
        (stx-transfer? course-price tx-sender educator-addr))
      (map-set enrollments { student: tx-sender, course-id: course-id } true)
      (ok true))))

;; Check if a student is enrolled in a course
(define-read-only (is-enrolled (student principal) (course-id uint))
  (default-to false (map-get? enrollments { student: student, course-id: course-id })))

;; Drop a course (admin only)
(define-public (drop-student (student principal) (course-id uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? enrollments { student: student, course-id: course-id })) (err ERR-NOT-ENROLLED))
    (map-delete enrollments { student: student, course-id: course-id })
    (ok true)))

;; Transfer admin
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)))
