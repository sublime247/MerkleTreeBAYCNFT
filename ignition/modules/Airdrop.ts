import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const baycAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const merkleRoot = "0x32a79f511d483751bcb4a0328a9a90714f3232aac877697522a54bb9cfa01d8c"
const token = "0x3637A3932b39d6e5AE9961C7fC1d68C621A68D5B";

const AirdropModule = buildModule("AirdropModule", (m) => {

    const merkle = m.contract("Airdrop", [token, merkleRoot, baycAddress]);

    return { merkle };
});

export default AirdropModule;


