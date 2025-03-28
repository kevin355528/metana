# EVM more Puzzle Documentation

## Puzzle 1:

### solution :

JUMPDEST is located at 0x47 (71 in decimal).

From 00 to 03, CALLVALUE \*\* CALLDATASIZE must to equal to 71.

To achieve that, let take CALLDATASIZE equal to 1

## Puzzle 2:

### solution :

From 00 to 05, the bytecode is just copying the calldata into memory.

From 06 to 0B, it creates a contract with the calldata.

From 0C to 15, it calling the contract that was created with the given calldata.

In order to solve this puzzle, we need to create a contract of size 0A.

calldata: 0x64600a6000f3600052600a601bf3

## Puzzle 3:

### solution :

From 00 to 0B, it creating a contract with the calldata we have given.

From 0C to 013, the contract delegate calling the contract that is deployed with the given calldata.

From 14 to 19, it checking the storage slot having AA (170 in decimal).

To solve this challange we need to create a contract that store AA at storage slot 5.

calldata: 0x6560aa600555006000526006601af3

## Puzzle 4:

### solution :

From 00 to 01, byte code push the callvalue onto the stack.

From 02 to 0D the bytecode creating the contract with callvalue.

From 0E to 11, it is checking the balance of create contract, the balance must be 1/2 the of the callvalue.

the value to send: 2

the calldata: 0x60008080806001815af100

## Puzzle 5:

### solution :

calldatasize > 32 bytes

msize which is multiple of 32 bytes

msize - calldatasize = 3

calldata: 0x00000000000000000000000000000000000000000000000000000000 000000000000000000000000000000000000000000000000000000000000000000

## Puzzle 6:

### solution :

we need to find a callvalue to add with that 32 bytes ((2\*\*256)-16) where that result should be equal to 1.

by adding 0xf(16) to 32 bytes on the stack can overflow and result will become 0.

to get the result 1 we need to provide callvalue of 17.

the value to send: 17

## Puzzle 7:

### solution :

Out of loop 5 gas.

Inside loop 43 gas.

Final loop 43 - 11 = 32 gas, skipping PUSH, JUMP.

the value to send: 4

## Puzzle 8:

### solution :

looks like complicate but not. let us break it.

From 00 to 05, we observe to move further the callvalue must be 0.

From 08 to 13, the bytecode copy the calldata into memory and create a contract with it.

From 14 to 20, calling the contract that was deployed with calldata.

From 29 to 2D checking balance before and after are same or not.

In order to solve this we challenge, just creation code is enough without need of runtime code.

the calldata: 0x60006000f3

## Puzzle 9:

### solution :

From 00 to 08, computing the keccak256 hash of the callvalue.

From 09 to 0B, right shifting 0xF8 (31 bytes) the keccak256 hash.

we left with the left most 1 bytes and that must be A8.

the value to send: 47

## Puzzle 10:

### solution :

From 00 to 2B, the bytecode loads the first 32 bytes of the calldata, done AND operation with F0F0...

From 2c to 36, the bytecode just loads second 32 bytes from the calldata and done OR operation with previous result.

To solve this puzzle, we need to provide 64 bytes of calldata, such that after two operation the result must be in ABAB...

the calldata: 0xA4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A4A40B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B0B
