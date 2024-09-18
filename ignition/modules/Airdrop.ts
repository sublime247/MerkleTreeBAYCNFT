import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const baycAddress = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const merkleRoot = "0x32a79f511d483751bcb4a0328a9a90714f3232aac877697522a54bb9cfa01d8c"

const AirdropModule = buildModule("AirdropModule", (m) => {

    const merkle = m.contract("Airdrop", [baycAddress, merkleRoot, ]);

    return { merkle };
});

export default AirdropModule;


