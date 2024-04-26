// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console.sol";
import {Test, console2} from "forge-std/Test.sol";
import {SignedNFTAgreement} from "../src/SignedNFTAgreement.sol";

contract SignedNFTAgreementTest is Test {
    SignedNFTAgreement public signedNFTAgreement;

    address initialOwner = makeAddr("owner");

    function setUp() public {
        signedNFTAgreement = new SignedNFTAgreement(
            initialOwner,
            20,
            15,
            1 days,
            ''
        );
    }

    function testUpdateLoanAmount() public {
        vm.prank(initialOwner);
        signedNFTAgreement.updateLoanAmount(900);
        uint256 amount = signedNFTAgreement.loanAmount();
        assertEq(amount, 900, 'amount has not been updated');
    }


}
