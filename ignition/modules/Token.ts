import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const TokenModule = buildModule("ADTModule", (m) => {

    const token = m.contract("ADT");

    return { token };
});

export default TokenModule;


