// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract YourContract is ERC721 {

    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;
    
    constructor() ERC721("MonuMints", "Monu") {
        s_tokenCounter = 0;
    }

    struct Landmark {
        string name;
        string description;
        string imageUrl;
        int256 latitude;
        int256 longitude;
    }

     
    Landmark[] public landmarks;

    //////////////// Functions ////////////////

    function mintNft(
        string memory _name,
        string memory _description,
        string memory _tokenUri,
        int256 _latitude,
        int256 _longitude) public {
        s_tokenIdToUri[s_tokenCounter] = _tokenUri;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        landmarks.push(Landmark(
            _name, _description, _tokenUri, _latitude, _longitude
            ));
    }
    

    function mintNftWithDefaults(
        string memory _name,
        string memory _description,
        string memory _tokenUri
    ) public {
        s_tokenIdToUri[s_tokenCounter] = _tokenUri;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        landmarks.push(Landmark(_name, _description, _tokenUri, -79, 43));
    }

//////////////// View Functions ////////////////
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return s_tokenIdToUri[tokenId];
    } 

    // This reads all of the objects in the array
    function readObjects() public view returns (Landmark[] memory) {
        return landmarks;
    }
}