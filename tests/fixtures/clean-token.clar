;; CleanToken — a well-written SIP-010 token (no audit findings expected)

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token cleantoken)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-OWNER     (err u100))
(define-constant ERR-NOT-SENDER    (err u101))
(define-constant ERR-ZERO-AMOUNT   (err u103))
(define-constant ERR-SAME-ADDR     (err u104))

(define-data-var token-name    (string-ascii 32)          "CleanToken")
(define-data-var token-symbol  (string-ascii 10)          "CLN")
(define-data-var token-decimals uint                      u6)
(define-data-var token-uri     (optional (string-utf8 256)) none)

;; Returns the token name
(define-read-only (get-name)   (ok (var-get token-name)))

;; Returns the token symbol
(define-read-only (get-symbol) (ok (var-get token-symbol)))

;; Returns the number of decimals
(define-read-only (get-decimals) (ok (var-get token-decimals)))

;; Returns balance for the given account
(define-read-only (get-balance (account principal))
  (ok (ft-get-balance cleantoken account)))

;; Returns the current total supply
(define-read-only (get-total-supply) (ok (ft-get-supply cleantoken)))

;; Returns the optional token URI
(define-read-only (get-token-uri) (ok (var-get token-uri)))

;; Transfers tokens from sender to recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-SENDER)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (not (is-eq sender recipient)) ERR-SAME-ADDR)
    (try! (ft-transfer? cleantoken amount sender recipient))
    (match memo m (print m) 0x)
    (ok true)))

;; Updates the token metadata URI (owner only)
(define-public (set-token-uri (new-uri (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (var-set token-uri new-uri)
    (ok true)))

(begin
  (try! (ft-mint? cleantoken u1000000000000 CONTRACT-OWNER)))
