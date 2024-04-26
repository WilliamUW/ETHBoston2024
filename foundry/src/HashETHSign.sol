// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RwaCollateralManager {
    // Mapping from token ID to RWA collateral agreement hash
    mapping(uint256 => string) public collateralAgreements;

    // Event to log the registration of a new RWA collateral agreement
    event RwaCollateralAgreementRegistered(uint256 indexed tokenId, string agreementHash);

    // Function to register a new RWA collateral agreement hash
    function registerCollateralAgreement(uint256 tokenId, string calldata agreementHash) external {
        require(bytes(collateralAgreements[tokenId]).length == 0, "Collateral agreement already registered for this token");
        collateralAgreements[tokenId] = agreementHash;
        emit RwaCollateralAgreementRegistered(tokenId, agreementHash);
    }

    // Function to get the RWA collateral agreement hash for a specific token
    function getCollateralAgreement(uint256 tokenId) external view returns (string memory) {
        require(bytes(collateralAgreements[tokenId]).length != 0, "No collateral agreement registered for this token");
        return collateralAgreements[tokenId];
    }
}
