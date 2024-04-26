// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/// @title SignedNFTAgreement 
/// @author Mehdi R. 
/// @notice Receives NFTs as collateral for a loan and releases them when the loan is repaid 
/// @dev The contract allows to deposit RWA collateral agreement signed via ETHSign
contract SignedNFTAgreement is ERC721Holder, ReentrancyGuard, Ownable {
    // Parties invovled details 
    address payable sender; 
    address payable buyer; 
    
    // NFT collateral details
    address public nftAddress;
    uint256 public tokenId;
    bool public isLocked;

    // Optional RWA collateral agreement signed via ETHSign
    string public rwaCollateralAgreementHash;

    // Loan conditions specified at deployment
    uint256 public loanAmount;
    uint256 public interestRate; // in basis points to allow decimals
    uint256 public loanDuration; // in seconds

    // Events for locking and releasing NFTs
    event CollateralLocked(address indexed nftAddress, uint256 indexed tokenId);
    event CollateralReleased(address indexed nftAddress, uint256 indexed tokenId);
    event RWACollateralAgreementAdded(string agreementHash);

    constructor(
        address newOwner,
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _loanDuration,
        string memory _rwaCollateralAgreementHash
    )  Ownable(newOwner) {
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        loanDuration = _loanDuration;
        rwaCollateralAgreementHash = _rwaCollateralAgreementHash;
        transferOwnership(newOwner);
    }

    // Function to udpdate loan amout 
    function updateLoanAmount(uint256 _loanAmount) external onlyOwner {
        loanAmount = _loanAmount;
    }

    // Function to update interest rate
    function updateInterestRate(uint256 _interestRate) external onlyOwner {
        interestRate = _interestRate;
    }

    // Function to update loan duration
    function updateLoanDuration(uint256 _loanDuration) external onlyOwner {
        loanDuration = _loanDuration;
    }

    // Function to lock collateral
    ///@param nftAddress - the address of the NFT
    ///@param _tokenId - the tokenId of the NFT
    function lockCollateral(address nftAddress, uint256 _tokenId) external nonReentrant onlyOwner {  //@audit - 
        require(!isLocked, "NFT is already locked as collateral"); //@audit - NFT should not be used as collateral 
        IERC721 nft = IERC721(nftAddress); 
        require(nft.ownerOf(_tokenId) == owner(), "Contract owner does not own the NFT"); 

        nft.safeTransferFrom(owner(), address(this), tokenId);
        isLocked = true;

        emit CollateralLocked(nftAddress, tokenId);
    }

    // Function to release collateral
    function releaseCollateral() external nonReentrant onlyOwner {
        require(isLocked, "NFT is not locked as collateral");

        IERC721 nft = IERC721(nftAddress);
        nft.safeTransferFrom(address(this), owner(), tokenId);
        isLocked = false;

        emit CollateralReleased(nftAddress, tokenId);
    }
}
