//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract  is ERC721 {
    uint256 private _tokenIdCounter = 5;

	// State Variables
	address public immutable owner;
	string public greeting = "Building Unstoppable Apps!!!";
	bool public premium = false;
	uint256 public totalCounter = 0;
	mapping(address => uint) public userGreetingCounter;

	struct Object {
        string name;
        string description;
        string imageUrl;
        int256 latitude;
        int256 longitude;
		address owner;
    }

    Object[] public objects;

	function insertObject(
        string memory _name,
        string memory _description,
        string memory _imageUrl,
        int256 _latitude,
        int256 _longitude,
		address nftOwner
    ) public {
		require(bytes(_name).length > 0, "Name cannot be empty");
		require(bytes(_description).length > 0, "Description cannot be empty");
		require(bytes(_imageUrl).length > 0, "_imageUrl cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(nftOwner, tokenId);

        objects.push(Object(_name, _description, _imageUrl, _latitude, _longitude, nftOwner));
    }

	function deleteObject(uint256 index) public {
		require(index < objects.length, "Invalid index");
		delete objects[index];
	}

	function readObjects() public view returns (Object[] memory) {
        return objects;
    }

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner) ERC721("MonuMint NFT", "YNFT") {
		owner = _owner;
		        insertObject("USS Constitution",
            "Ahoy there! I'm the USS Constitution, also affectionately known as 'Old Ironsides.' Launched in 1797, I've bravely sailed through history and am still afloat, defying time at my home in Charlestown Navy Yard. Come aboard and hear tales of my victorious battles and the secrets of my sturdy frame!",
            "https://upload.wikimedia.org/wikipedia/commons/e/ed/USS_Constitution_fires_a_17-gun_salute.jpg",
            42366371,
            -71057141,
            0x0E5d299236647563649526cfa25c39d6848101f5);

        insertObject("Old State House",
            "Greetings from the heart of Boston! I am the Old State House, a witness to the birth of America. Built in 1713, I've stood here longer than most, seeing the Sons of Liberty pass right under my balconies. Walk through my doors to step back in time and feel the fervor of revolution!",
            "https://upload.wikimedia.org/wikipedia/commons/3/3e/Old_State_House%2C_Washington_St%2C_Boston_%28493457%29_%2810773321993%29.jpg",
            42358485,
            -71059445,
            0x0E5d299236647563649526cfa25c39d6848101f5);

        insertObject("Bunker Hill Monument",
            "Hello from the heights of Charlestown! I am the Bunker Hill Monument, marking the site of a fierce Revolutionary War battle in 1775. Though I was completed much later in 1843, my stones tell stories of bravery and the fiery beginnings of a nation. Climb my steps for a view worth the ascent!",
            "https://www.nps.gov/common/uploads/cropped_image/primary/4025D7AF-C181-8A91-80CA9058F48DB795.jpg?width=1600&quality=90&mode=crop",
            42376606,
            -71059122,
            0x0E5d299236647563649526cfa25c39d6848101f5);

        insertObject("Boston Common",
        	unicode"Hello from the green heart of Boston! I am Boston Common, the oldest public park in America, where shepherds once grazed their flocks. Since 1634, I've seen picnickers, protesters, and everything in between. Whether it’s a snowy day or sunny afternoon, I'm your perfect urban escape!",
            "https://images.squarespace-cdn.com/content/v1/5bd469dd2727be0524ab0289/1613093676402-T2YPZRQ14EGOP86P6K4H/Boston+Common.jpg",
            42354570,
            -71065181,
            0x0E5d299236647563649526cfa25c39d6848101f5);

        insertObject("Faneuil Hall",
            unicode"Step right up, hear the echoes of history! I'm Faneuil Hall, Boston's bustling meeting hall and marketplace since 1743. Dubbed 'The Cradle of Liberty,' I've hosted speeches by America's founding fathers and modern-day leaders alike. Wander my halls to catch whispers of liberty and rebellion!",
            "https://www.nps.gov/npgallery/GetAsset/FAAF4B53-F0DD-498C-9C02-6668ABFDB922/proxy/hires",
            42360096,
            -71050427,
            0x0E5d299236647563649526cfa25c39d6848101f5);
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}

}
