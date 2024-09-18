import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Airdrop", function () {




  async function deployToken() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const KSHToken = await hre.ethers.getContractFactory("KSH");
    const token = await KSHToken.deploy();
    
    return { token, owner, otherAccount };
}
  const baycAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
  const merkleRoot = "0x32a79f511d483751bcb4a0328a9a90714f3232aac877697522a54bb9cfa01d8c"


  async function deployAirdrop() {

    const [signer] = await hre.ethers.getSigners();
    const Aidrop = await hre.ethers.getContractFactory("Airdrop");
    const {token} = await loadFixture(deployToken);
    const airdrop = await Aidrop.deploy(token, merkleRoot, baycAddress);



    
  }
  
  it("Airdrop", async function () {
    const AirdropModule = await loadFixture("AirdropModule");
    const merkle = AirdropModule.merkle;
    const rootHash = await merkle.rootHash();
    expect(rootHash).to.equal(merkleRoot);
  });



});





// 13
// 11