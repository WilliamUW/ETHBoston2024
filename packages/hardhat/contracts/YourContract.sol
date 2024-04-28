//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
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

		objects.push(
			Object(
				_name,
				_description,
				_imageUrl,
				_latitude,
				_longitude,
				nftOwner
			)
		);
	}

	function deleteObject(uint256 index) public {
		require(index < objects.length, "Invalid index");
		delete objects[index];
	}

	function readObjects() public view returns (Object[] memory) {
		return objects;
	}

	// Events: a way to emit log statements from smart contract that can be listened to by external parties
	event GreetingChange(
		address indexed greetingSetter,
		string newGreeting,
		bool premium,
		uint256 value
	);

	// Constructor: Called once on contract deployment
	// Check packages/hardhat/deploy/00_deploy_your_contract.ts
	constructor(address _owner) {
		owner = _owner;
		insertObject(
			"USS Constitution",
			"Ahoy there! I'm the USS Constitution, also affectionately known as 'Old Ironsides.' Launched in 1797, I've bravely sailed through history and am still afloat, defying time at my home in Charlestown Navy Yard. Come aboard and hear tales of my victorious battles and the secrets of my sturdy frame!",
			"https://upload.wikimedia.org/wikipedia/commons/e/ed/USS_Constitution_fires_a_17-gun_salute.jpg",
			42366371,
			-71057141,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		insertObject(
			"Old State House",
			"Greetings from the heart of Boston! I am the Old State House, a witness to the birth of America. Built in 1713, I've stood here longer than most, seeing the Sons of Liberty pass right under my balconies. Walk through my doors to step back in time and feel the fervor of revolution!",
			"https://upload.wikimedia.org/wikipedia/commons/3/3e/Old_State_House%2C_Washington_St%2C_Boston_%28493457%29_%2810773321993%29.jpg",
			42358485,
			-71059445,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		insertObject(
			"Bunker Hill Monument",
			"Hello from the heights of Charlestown! I am the Bunker Hill Monument, marking the site of a fierce Revolutionary War battle in 1775. Though I was completed much later in 1843, my stones tell stories of bravery and the fiery beginnings of a nation. Climb my steps for a view worth the ascent!",
			"https://www.nps.gov/common/uploads/cropped_image/primary/4025D7AF-C181-8A91-80CA9058F48DB795.jpg?width=1600&quality=90&mode=crop",
			42376606,
			-71059122,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		insertObject(
			"Boston Common",
			unicode"Hello from the green heart of Boston! I am Boston Common, the oldest public park in America, where shepherds once grazed their flocks. Since 1634, I've seen picnickers, protesters, and everything in between. Whether it’s a snowy day or sunny afternoon, I'm your perfect urban escape!",
			"https://images.squarespace-cdn.com/content/v1/5bd469dd2727be0524ab0289/1613093676402-T2YPZRQ14EGOP86P6K4H/Boston+Common.jpg",
			42354570,
			-71065181,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		insertObject(
			"Faneuil Hall",
			unicode"Step right up, hear the echoes of history! I'm Faneuil Hall, Boston's bustling meeting hall and marketplace since 1743. Dubbed 'The Cradle of Liberty,' I've hosted speeches by America's founding fathers and modern-day leaders alike. Wander my halls to catch whispers of liberty and rebellion!",
			"https://www.nps.gov/npgallery/GetAsset/FAAF4B53-F0DD-498C-9C02-6668ABFDB922/proxy/hires",
			42360096,
			-71050427,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		// Insert The Old North Church
		insertObject(
			"The Old North Church",
			unicode"Listen closely—I am The Old North Church, famous for my role in the American Revolution when two lanterns signaled the approach of British troops in 1775. Nestled in historic North End, I've been a beacon of hope and freedom since 1723. Visit me and step into a pivotal night in America's fight for freedom!",
			"https://upload.wikimedia.org/wikipedia/commons/a/a9/Boston_-_Old_North_Church_%2848718566608%29.jpg",
			42365984,
			-7105643,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		// Insert The Old South Meeting House
		insertObject(
			"The Old South Meeting House",
			unicode"Hello from downtown Boston! I am The Old South Meeting House, where the voices of John Hancock and Samuel Adams once stirred Bostonians to action in the Boston Tea Party of 1773. Built in 1729, my walls have absorbed the sounds of debate and democracy for centuries. Visit to feel the spirit of American independence!",
			"https://www.nps.gov/bost/planyourvisit/images/OSMH-web_4.jpg",
			42354487,
			-71057324,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		// Insert The Massachusetts State House
		insertObject(
			"The Massachusetts State House",
			unicode"Greetings from Beacon Hill! I am The Massachusetts State House, a grand symbol of government and law since 1798. My golden dome shines over the city as a beacon of the Commonwealth's ideals and history. Tour my halls to discover the rich tapestry of Massachusetts' governance and heritage!",
			"https://upload.wikimedia.org/wikipedia/commons/9/90/Massachusetts_State_House_Boston_November_2016.jpg",
			42357344,
			-71063387,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);

		// Insert The Boston Tea Party Ships & Museum
		insertObject(
			"The Boston Tea Party Ships & Museum",
			unicode"Ahoy there! I am The Boston Tea Party Ships & Museum, your portal to 1773 when tea-filled chests met the salty harbor water. Opened in 2012, I bring to life one of the most iconic protests in American history. Board my ships, toss some tea, and immerse yourself in the revolution!",
			"https://a.cdn-hotels.com/gdcs/production34/d1385/4a7846c2-ba91-4798-925e-b1e3bfcc58c9.jpg",
			4235168,
			-7105152,
			0x0E5d299236647563649526cfa25c39d6848101f5
		);
	}

	// Modifier: used to define a set of rules that must be met before or after a function is executed
	// Check the withdraw() function
	modifier isOwner() {
		// msg.sender: predefined variable that represents address of the account that called the current function
		require(msg.sender == owner, "Not the Owner");
		_;
	}
}
