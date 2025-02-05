// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol"; // For royalties

contract IdeaMarketplace is ERC721URIStorage, Ownable, ERC2981 {
    uint256 private _nextTokenId;

    mapping(uint256 => address) public originalCreators;

    event IdeaMinted(uint256 indexed tokenId, address indexed creator, string metadataURI);

    constructor() ERC721("IdeaNFT", "IDEA") {}

    /// @notice Mint an NFT representing an idea
    /// @param to The recipient of the NFT
    /// @param metadataURI The IPFS CID of the idea's metadata
    function mintIdea(address to, string memory metadataURI) external {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        originalCreators[tokenId] = to; // Store the original creator

        emit IdeaMinted(tokenId, to, metadataURI);
    }

    /// @notice Set royalty info (optional, for marketplace resale royalties)
    /// @param tokenId The token ID
    /// @param receiver The address that receives royalties
    /// @param feeNumerator The royalty percentage (e.g., 500 = 5%)
    function setRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
    }

    /// @notice Supports ERC-2981 (royalty standard)
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC2981) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
