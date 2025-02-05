// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol"; 

contract IdeaMarketplace is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _nextTokenId;

    mapping(uint256 => address) public originalCreators;

    event IdeaMinted(uint256 indexed tokenId, address indexed creator, string metadataURI);

    constructor() ERC721("IdeaNFT", "IDEA") ERC2981() Ownable(msg.sender) {}

    function mintIdea(address to, string memory metadataURI) external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        originalCreators[tokenId] = to;
        emit IdeaMinted(tokenId, to, metadataURI);
    }

    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
