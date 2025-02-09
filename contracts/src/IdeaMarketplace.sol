// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract IdeaMarketplace is ERC721URIStorage, ERC2981, Ownable {
    uint128 private _tokenIdCounter;

    mapping(uint256 => mapping(address => uint256)) public offers;
    struct Score {
        uint8 originality;
        uint8 feasibility;
        uint8 marketDemand;
        uint8 complexity;
        uint8 completeness;
    }

    mapping(uint256 => Score) private ideaScores;

    event IdeaMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string metadataURI
    );
    event OfferPlaced(
        uint256 indexed tokenId,
        address indexed offeror,
        uint256 amount
    );
    event OfferWithdrawn(
        uint256 indexed tokenId,
        address indexed offeror
    );
    event OfferAccepted(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 salePrice
    );
    event ScoresSet(
        uint256 indexed tokenId,
        uint8 originality,
        uint8 feasibility,
        uint8 marketDemand,
        uint8 complexity,
        uint8 completeness
    );

    constructor() ERC721("IdeaNFT", "IDEA") ERC2981() Ownable(msg.sender) {}

    function mintIdea(address to, string calldata tokenURI_, Score calldata _ideaScores) external {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        _setTokenRoyalty(tokenId, to, 50);

        setScores(
            tokenId,
            _ideaScores.originality,
            _ideaScores.feasibility,
            _ideaScores.marketDemand,
            _ideaScores.complexity,
            _ideaScores.completeness
        );

        emit IdeaMinted(tokenId, to, tokenURI_);
    }

    function placeOffer(uint256 tokenId) external payable {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(msg.value > 0, "Offer must be > 0");
        require(msg.sender != ownerOf(tokenId), "Cannot offer on own token");

        offers[tokenId][msg.sender] = msg.value;
        emit OfferPlaced(tokenId, msg.sender, msg.value);
    }

    function withdrawOffer(uint256 tokenId) external {
        uint256 offeredAmount = offers[tokenId][msg.sender];
        require(offeredAmount > 0, "No offer to withdraw");

        offers[tokenId][msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: offeredAmount}("");
        require(sent, "Failed to send Ether");

        emit OfferWithdrawn(tokenId, msg.sender);
    }

    function acceptOffer(uint256 tokenId, address offeror) external {
        require(ownerOf(tokenId) == msg.sender, "Caller is not token owner");

        uint256 salePrice = offers[tokenId][offeror];
        require(salePrice > 0, "No offer from this address");

        offers[tokenId][offeror] = 0;

        (address royaltyReceiver, uint256 royaltyAmount) = royaltyInfo(tokenId, salePrice);
        uint256 sellerAmount = salePrice;
        if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
            sellerAmount = salePrice - royaltyAmount;
            (bool royaltySent, ) = payable(royaltyReceiver).call{value: royaltyAmount}("");
            require(royaltySent, "Failed to send royalty");
        }

        (bool sent, ) = payable(msg.sender).call{value: sellerAmount}("");
        require(sent, "Failed to send Ether to seller");

        _transfer(msg.sender, offeror, tokenId);

        emit OfferAccepted(tokenId, msg.sender, offeror, salePrice);
    }

    function setScores(
        uint256 tokenId,
        uint8 originality,
        uint8 feasibility,
        uint8 marketDemand,
        uint8 complexity,
        uint8 completeness
    ) private {
        require(originality >= 1 && originality <= 10, "Originality out of range");
        require(feasibility >= 1 && feasibility <= 10, "Feasibility out of range");
        require(marketDemand >= 1 && marketDemand <= 10, "Market Demand out of range");
        require(complexity >= 1 && complexity <= 10, "Complexity out of range");
        require(completeness >= 1 && completeness <= 10, "Completeness out of range");

        ideaScores[tokenId] = Score({
            originality: originality,
            feasibility: feasibility,
            marketDemand: marketDemand,
            complexity: complexity,
            completeness: completeness
        });

        emit ScoresSet(
            tokenId,
            originality,
            feasibility,
            marketDemand,
            complexity,
            completeness
        );
    }

    function getScores(uint256 tokenId)
        external
        view
        returns (
            uint8 originality,
            uint8 feasibility,
            uint8 marketDemand,
            uint8 complexity,
            uint8 completeness
        )
    {
        Score memory s = ideaScores[tokenId];
        return (
            s.originality,
            s.feasibility,
            s.marketDemand,
            s.complexity,
            s.completeness
        );
    }

    function setRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external {
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

    receive() external payable {}
    fallback() external payable {}
}
