# EVM Puzzle Documentation

## Puzzle 1: Jump to Destination

### solution :

Send a transaction to the smart contract with `8 wei`.

## Puzzle 2: Conditional Jump Based on Call Value

### solution :

The CODESIZE is 10 (because we have 10 bytes of code).
We want to jump to 06, so we need the SUB to result in 6.
To get 6 from SUB, we need to send 4 wei with the transaction (because 10 - 4 = 6).

## Puzzle 3: Jump Based on Call Data Size

### solution :

Send a transaction to the contract with exactly `4 bytes` of data.
This will set the `CALLDATASIZE` to `4`, which is the address of `JUMPDEST`.

## Puzzle 4: CALLVALUE and XOR for Jumps

### solution :

Send the contract `6` Ether (but like, not real Ether – we're practicing).
That will make our XOR handshake work just right and lead us to `JUMPDEST`.

## Puzzle 5: Duplication, Multiplication, and Equality Check

### solution :

We need to send an Ether amount that, when squared, equals `256`.
That amount is `16` because `16` times `16` equals `256`.

## Puzzle 6: Using CALLDATALOAD for JUMP

### solution :

We need to send calldata with the first 32 bytes structured so that `CALLDATALOAD` will place the value `0A` on the stack. In Ethereum, numbers are stored in big-endian format.
The correct calldata will be `0x000000000000000000000000000000000000000000000000000000000000000A`, ensuring the stack's top value is `0A` when the `JUMP` instruction is called.

## Puzzle 7:

### solution :

The solution `0x60016000F3` is a sequence of bytecode that does the following:

- `0x60` (`PUSH1`): Pushes a byte onto the stack.
- `0x01`: The byte pushed, indicating the size of the code for the `RETURN` operation.
- `0x60` (`PUSH1`): Pushes another byte onto the stack.
- `0x00`: The byte pushed, indicating the memory offset for the `RETURN` operation.
- `0xF3` (`RETURN`): Returns the one byte of code at the specified memory offset.

## Puzzle 8:

### solution :

The resulting calldata is `0x60FD60005360016000F3`. When this data is used in the `CREATE` operation, it deploys a new contract containing just the `REVERT` opcode.

## Puzzle 9:

With these points in mind, the call value is set to `2`, and the call data is a 4-byte string of zeros:

```json
{ "data": "0x00000000", "value": 2 }
```

## Puzzle 10:

### solution :

The system of equations we have to solve is this:

CODESIZE = 27 (1b in hex) is always
CALLVALUE must be <= 27 to make GT(CALLVALUE, CODESIZE) return 1
CALLVALUE = 15 (0F in hex) to make ADD(0A, CALLVALUE) return 19
CALLDATASIZE must be a multiple of 3 to make ISZERO(MOD(0x0003, CALLDATASIZE)) return 1
A possible solution could be:

CALLVALUE = 15
CALLDATA = 0xFFFFFF
