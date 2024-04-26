// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/SignedNFTAgreement.sol";

contract SignedNFTAgreementScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SignedNFTAgreement contract
        SignedNFTAgreement signedNFTAgreement = new SignedNFTAgreement(
            vm.envAddress("LENDER_ADDRESS"),
            vm.envUint("LOAN_AMOUNT"), 
            vm.envUint("INTEREST_RATE"),
            vm.envUint("LOAN_DURATION"),
            vm.envString("RWA_COLLATERAL_AGREEMENT_HASH")
        );

        vm.stopBroadcast();
    }
}
