// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Airdrop {
    bytes32 public merkleRoot;
    address public tokenAddress;
    address public owner;
    address public bayc;

    mapping(address => bool) hasClaimed;

    constructor(address _tokenAddress, bytes32 _merkleRoot, address _bayc) {
        tokenAddress = _tokenAddress;
        merkleRoot = _merkleRoot;
        bayc = _bayc;
        owner = msg.sender;
    }

    error TokenHasBeenClaimed();
    error NotOwner();
    error AddressZerodetected();
    error NOTBAYCHOLDER();

    function OnlyOwner() private view {
        if (msg.sender != owner) {
            revert NotOwner();
        }
    }

    event AirdropClaimed(address indexed _user, uint256 _amount);
    event AirdropWithdrawn(uint _tokenBalance, string successMessage);
    event Debug(bytes32 leaf, bool proofValid);


    function ownsNFT(address _user) private view returns (bool) {
          IERC721 baycNft = IERC721(bayc);
        return baycNft.balanceOf(_user) > 0;
    }

    function claimAirdrop(
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) external {
        if (msg.sender == address(0)) {
            revert AddressZerodetected();
        }
        if (hasClaimed[msg.sender]) {
            revert TokenHasBeenClaimed();
        }
        if (!ownsNFT(msg.sender)) {
            revert NOTBAYCHOLDER();
        }
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

        bool proofValid = MerkleProof.verify(_merkleProof, merkleRoot, leaf);
        emit Debug(leaf, proofValid); // Debug event

        require(proofValid, "Invalid Merkle proof");

        hasClaimed[msg.sender] = true;
        require(
            IERC20(tokenAddress).transfer(msg.sender, _amount),
            "Token transfer failed"
        );

        emit AirdropClaimed(msg.sender, _amount);
    }






    function updateMerkleroot(bytes32 _merkleroot) external {
        OnlyOwner();
        merkleRoot = _merkleroot;
    }









    function withdrawRemainingToken() external {
        OnlyOwner();
        uint256 _tokenBalance = IERC20(tokenAddress).balanceOf(address(this));
        require(_tokenBalance > 0, "You have not token left");

        require(
            IERC20(tokenAddress).transfer(owner, _tokenBalance),
            "Transaction Fail"
        );

        emit AirdropWithdrawn(_tokenBalance, "Successful");
    }
}
