# BoredApeNFT Airdrop Contract

This contract is designed to facilitate an airdrop of tokens to holders of Bored Ape Yacht Club (BAYC) NFTs.

## Overview

The contract uses a Merkle tree to verify the eligibility of users to claim tokens. The Merkle tree is constructed from a list of user addresses and corresponding token amounts. Users can claim their tokens by providing a valid Merkle proof.

## Functions

### `claimAirdrop`

Allows a user to claim their tokens by providing a valid Merkle proof.

* `_amount`: The amount of tokens to claim
* `_merkleProof`: The Merkle proof to verify the user's eligibility

### `updateMerkleroot`

Allows the contract owner to update the Merkle root.

* `_merkleroot`: The new Merkle root

### `withdrawRemainingToken`

Allows the contract owner to withdraw any remaining tokens in the contract.

## Events

### `AirdropClaimed`

Emitted when a user successfully claims their tokens.

* `_user`: The address of the user who claimed tokens
* `_amount`: The amount of tokens claimed

### `AirdropWithdrawn`

Emitted when the contract owner withdraws remaining tokens.

* `_tokenBalance`: The amount of tokens withdrawn
* `successMessage`: A success message

### `Debug`

Emitted for debugging purposes.

* `leaf`: The leaf node of the Merkle tree
* `proofValid`: Whether the Merkle proof is valid

## Requirements

* The contract must be deployed on a compatible Ethereum network.
* The BAYC NFT contract must be deployed and configured correctly.
* The token contract must be deployed and configured correctly.

## Security Considerations

* The contract uses a Merkle tree to verify user eligibility, which provides a secure and efficient way to verify claims.
* The contract owner has the ability to update the Merkle root, which should be done with caution to avoid disrupting the airdrop process.
* The contract has a `withdrawRemainingToken` function that allows the contract owner to withdraw any remaining tokens, which should be done with caution to avoid losing tokens.

## License

This contract is licensed under the MIT License.