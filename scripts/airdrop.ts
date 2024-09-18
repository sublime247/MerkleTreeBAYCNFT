import { ethers } from "hardhat";
import fs from "fs";
import csv from "csv-parser";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";



const leafNodes: Buffer[] = [];

fs.createReadStream( "airdrop.csv")
	.pipe(csv())
	.on("data", (row: { address: string; amount: number }) => {
		const address = row.address;
		console.log("Address:", address);

		const amount = ethers.parseUnits(row.amount.toString(), 18);
		console.log("Amount:", amount.toString());
		const leaf = keccak256(
			ethers.solidityPacked(["address", "uint256"], [address, amount])
		);
		leafNodes.push(leaf);
	})
	.on("end", () => {
		const merkleTree = new MerkleTree(leafNodes, keccak256, {
			sortPairs: true,
		});

		const rootHash = merkleTree.getHexRoot();
		console.log("Merkle Root:", rootHash);

		const address = "0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c";
		const amount = ethers.parseUnits("10", 18);

		const leaf = keccak256(
			ethers.solidityPacked(["address", "uint256"], [address, amount])
		);

		console.log("Leaf:", leaf.toString("hex"));

		const proof = merkleTree.getHexProof(leaf);
		console.log("The Proof for user:", proof);

		const verify = merkleTree.verify(proof, leaf, rootHash);
		console.log("Verify:", verify);
	});


		