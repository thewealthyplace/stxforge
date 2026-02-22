;; VulnerableContract — intentionally bad contract for audit testing
;; This contract deliberately violates all 6 STX rules.

(define-fungible-token badtoken)
(define-map balances principal uint)

;; STX-001: map-set without asserts!
(define-public (unsafe-set (key principal) (val uint))
  (begin
    (map-set balances key val)  ;; no asserts! guard
    (ok true)))

;; STX-002: contract-call? without try!
(define-public (unsafe-call (target <ft-trait>))
  (begin
    (contract-call? .other-contract do-something)  ;; not wrapped
    (ok true)))

;; STX-003: tx-sender used for auth
(define-public (auth-action)
  (begin
    (asserts! (is-eq tx-sender 'SP1ABC) (err u99))
    (var-set some-var u1)
    (ok true)))

;; STX-005: no doc comment above this function
(define-public (undocumented-function)
  (begin
    (asserts! (is-eq tx-sender 'SP1ABC) (err u99))
    (ok true)))

;; STX-006: no principal check at all
(define-public (open-to-anyone)
  (begin
    (var-set some-var u99)
    (ok true)))

(define-data-var some-var uint u0)
