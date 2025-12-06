# LootiScript Error Tests

This folder contains test files for all errors that can be detected by the VSCode Extension.

## File Structure

### Syntax Errors (E1xxx)
- `syntax-e1001-unterminated-function.loot` - Function not closed with 'end'
- `syntax-e1002-too-many-end.loot` - Extra 'end' statement without opening
- `syntax-e1004-unexpected-token.loot` - Missing parenthesis/bracket
- `syntax-e1008-unterminated-string.loot` - String not closed with quote

### API Validation Errors (E7100)
- `api-e7100-screen-errors.loot` - Invalid properties on screen API
- `api-e7100-audio-errors.loot` - Invalid properties on audio API
- `api-e7100-keyboard-errors.loot` - Invalid properties on keyboard API
- `api-e7100-gamepad-errors.loot` - Invalid properties on gamepad API
- `api-e7100-storage-errors.loot` - Invalid properties on storage API
- `api-e7100-sprites-errors.loot` - Nested properties on sprites (always error)
- `api-e7100-map-errors.loot` - Nested properties on map (always error)

### Warnings (Wxxxx)
- `warning-w1001-api-assignment.loot` - Assignment to API variables

## How to Use

1. Open the test file you want to verify in VSCode
2. Open the Problems panel (`Ctrl+Shift+M`)
3. View the errors/warnings that appear

Each file is designed to trigger only one type of error, making it easy for individual testing.

## Notes

**Errors NOT detected in VSCode:**
- Runtime errors (E2xxx) - only appear at runtime
- Compilation errors (E3xxx) - only appear at compile time
- Scene errors (E5xxx) - only appear at runtime

These errors cannot be tested via the VSCode extension because they require a runtime environment.
