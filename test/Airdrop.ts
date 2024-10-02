import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
const helpers = require("@nomicfoundation/hardhat-network-helpers");






describe("Airdrop", function () {
  const baycAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";


  async function deployToken() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const KSHToken = await hre.ethers.getContractFactory("ADT");
    const token = await KSHToken.deploy();
    
    return { token, owner, otherAccount };
  }



  async function deployAirdrop() {
    const [owner,  otherAccount,] = await hre.ethers.getSigners();
    const { token } = await loadFixture(deployToken);
    const bayHolder2 = "0x76C1cFe708ED1d2FF2073490727f3301117767e9";
    const bayHolder = "0x7c1958Ba95AB3170f6069DADF4de304B0c00000C";
    const leafNodes = [owner, bayHolder,bayHolder2, otherAccount].map((addrs) => keccak256(ethers.solidityPacked(
      ["address", "uint256"], [bayHolder2, ethers.parseUnits("10", 18)]
    )));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true
    });
    const rootHash = merkleTree.getHexRoot();
    console.log("Merkle Root: ", rootHash);
    const Aidrop = await hre.ethers.getContractFactory("Airdrop");
    const airdrop = await Aidrop.deploy(token, rootHash, baycAddress);
    return { airdrop, token, owner, rootHash,otherAccount, baycAddress,merkleTree };
    
  }
  
  describe("Deployment", function () {
    it("Should check of owner is set correctly", async function () {
      const { owner, airdrop } = await loadFixture(deployAirdrop);
      expect(await airdrop.owner()).to.equal(owner);
      console.log("Owner: ", owner.address);

    });
    it("Should check of baycNFT is set correctly", async function () {
      const { owner, airdrop, baycAddress } = await loadFixture(deployAirdrop);
      expect(await airdrop.bayc()).to.equal(baycAddress);
      console.log("baycNFT: ", baycAddress);

    });
    it("Should check of rootHash is set correctly", async function () {
      const {  airdrop, baycAddress,rootHash } = await loadFixture(deployAirdrop);
      expect(await airdrop.merkleRoot()).to.equal(rootHash);
      console.log("RootHash", rootHash);

    });

  });

  

  describe("ClaimAirdrop", function () { 
    it("Should check if user can claim airdrop", async function () {
      const bayHolder2 = "0x76C1cFe708ED1d2FF2073490727f3301117767e9";
      const bayHolder = "0x7c1958Ba95AB3170f6069DADF4de304B0c00000C";
      const { airdrop, owner, otherAccount, token , merkleTree} = await loadFixture(deployAirdrop);
      await helpers.impersonateAccount(bayHolder2);

      const impersonatedSigner = await ethers.getSigner(bayHolder2);
      await owner.sendTransaction({
        to: bayHolder2,
        value: ethers.parseEther("3.0"), // 1 ETH
      });

      // Transfer some token to the contract
      const trfAmount = ethers.parseUnits("100", 18);
      await token.transfer(airdrop, trfAmount);
      expect((await token.balanceOf(airdrop))).to.equal(trfAmount);

      const baycContract = await ethers.getContractAt("IERC721", baycAddress);
      const balance = await baycContract.balanceOf(impersonatedSigner.address);
      console.log(balance);
      expect(balance).to.be.gt(0); 

      //   Get Merkle proof
      const amountTobeClaimed = ethers.parseUnits("10", 18);
      const leaf = keccak256(ethers.solidityPacked(["address", "uint256"], [bayHolder2, amountTobeClaimed]))
      const proof = merkleTree.getHexProof(leaf);
      console.log("The Proof for user:", proof);

     await airdrop.connect(impersonatedSigner).claimAirdrop(amountTobeClaimed, proof);
      // expect(claim).to.be.revertedWithCustomError(airdrop, "NOTBAYCHOLDER");
      


  // await expect( await airdrop.connect(otherAccount).claimAirdrop(amountTobeClaimed, proof)).to.be.revertedWithCustomError(airdrop, 'NOTBAYCHOLDER');
  // await expect( await airdrop.claimAirdrop(amountTobeClaimed, proof)).to.be.revertedWith('Invalid Merkle proof');




    });
    
    
  });



});



// 13
// 11