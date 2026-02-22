# SIP-010 Token Template

Generate a fully compliant SIP-010 fungible token contract using the `stxforge add token` command.

## Usage

```bash
stxforge add token
```

You will be prompted for:

| Prompt | Description | Example |
|--------|-------------|---------|
| Token name | Full name of your token | `MyToken` |
| Token symbol | Ticker (2-10 uppercase letters) | `MTK` |
| Decimals | Decimal places (0–18) | `6` |
| Initial supply | Base units minted at deploy | `1000000000000` |
| Mintable | Enable role-based minting | `Yes` |
| Burnable | Enable token burning | `No` |
| Capped | Enable max supply cap | `Yes` |
| Max supply | Max supply cap (base units) | `1000000000000` |

### Non-Interactive Mode

```bash
stxforge add token \
  --name "MyToken" \
  --symbol "MTK" \
  --decimals 6 \
  --supply 1000000000000 \
  --mintable \
  --burnable \
  --capped
```

## Generated Files

| File | Description |
|------|-------------|
| `contracts/mytoken.clar` | Fully compliant SIP-010 Clarity contract |
| `tests/mytoken.test.ts` | Clarinet test suite (happy path + edge cases) |
| `Clarinet.toml` | Updated with new contract entry |
| `README.md` | Token usage snippet injected |

## SIP-010 Functions

All generated contracts implement the complete SIP-010 trait:

| Function | Type | Description |
|----------|------|-------------|
| `transfer` | public | Transfer tokens between principals |
| `get-name` | read-only | Returns token name |
| `get-symbol` | read-only | Returns token symbol |
| `get-decimals` | read-only | Returns number of decimals |
| `get-balance` | read-only | Returns balance of a principal |
| `get-total-supply` | read-only | Returns current total supply |
| `get-token-uri` | read-only | Returns optional metadata URI |

## Optional Capabilities

### Mintable

When enabled, a `mint` function is added with role-based access:

```clarity
(define-public (mint (amount uint) (recipient principal))
  ...)

(define-public (set-minter (new-minter principal))
  ...)
```

### Burnable

When enabled, a `burn` function is added:

```clarity
(define-public (burn (amount uint) (owner principal))
  ...)
```

### Capped Supply

When enabled, the token is defined with a max supply and `mint` enforces it:

```clarity
(define-fungible-token mytoken u1000000000000) ;; capped at max
(define-constant MAX-SUPPLY u1000000000000)
```

## Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u100 | `ERR-OWNER-ONLY` | Caller is not the contract owner/minter |
| u101 | `ERR-NOT-TOKEN-OWNER` | tx-sender does not match token sender |
| u102 | `ERR-INSUFFICIENT-BALANCE` | Not enough balance |
| u103 | `ERR-INVALID-AMOUNT` | Amount is zero or negative |
| u104 | `ERR-INVALID-RECIPIENT` | Sender and recipient are the same |
| u105 | `ERR-MAX-SUPPLY-REACHED` | Mint would exceed max supply (capped only) |
