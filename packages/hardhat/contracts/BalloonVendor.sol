pragma solidity >=0.8.4;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BalloonToken.sol";
import "./verifiers/LessThanSignedAge.sol";

contract BalloonVendor is Ownable {

  uint256 public tokensPerEth = 100;
  uint16 public earliestBirthYear = 2013;
  // TODO: better solution for "trusted authorities"
  bytes32 public thirdPartyPublicKeyX = hex"ba5734d8f7091719471e7f7ed6b9df170dc70cc661ca05e688601ad984f068b0";
  bytes32 public thirdPartyPublicKeyY = hex"d67351e5f06073092499336ab0839ef8a521afd334e53807205fa2f08eec74f4";

  event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
  event SellTokens(address seller, uint256 amountOfTokens, uint256 amountOfETH);
  event FreeToken(address FreeLoader, uint256 amountOfTokens);

  BalloonToken public balloonToken;
  UltraVerifier public ageVerifier;

  function preparePublicInputs(
    bytes32[] memory _publicInputs,
    bytes32 publicInput,
    uint256 offset,
    uint256 length
  ) private returns (bytes32[] memory) {
    // TODO: move this to separate library
    for (uint256 i = 0; i < length; i++) {
        _publicInputs[i + offset] = (publicInput >> ((length - 1 - i) * 8)) & bytes32(uint256(0xFF));
    }
    return _publicInputs;
  }

  constructor(address _balloonToken, address _ageVerifier) {
    balloonToken = BalloonToken(_balloonToken);
    ageVerifier = UltraVerifier(_ageVerifier);
  }

  modifier onlyKids(bytes calldata proof) {
    bytes32[] memory publicInputs = new bytes32[](85);
    publicInputs[0] = bytes32(uint256(earliestBirthYear));
    publicInputs = preparePublicInputs(publicInputs, thirdPartyPublicKeyX, 1, 32);
    publicInputs = preparePublicInputs(publicInputs, thirdPartyPublicKeyY, 33, 32);
    publicInputs = preparePublicInputs(publicInputs, bytes32(uint256(uint160(msg.sender))), 65, 20);
    require(ageVerifier.verify(proof, publicInputs));
    _;
  }

  function changeAgeRestriction(uint16 _earliestBirthYear, address _ageVerifier) public onlyOwner {
    earliestBirthYear = _earliestBirthYear;
    ageVerifier = UltraVerifier(_ageVerifier);
  }

  function buyTokens() public payable {
    uint256 amountOfTokens = msg.value * tokensPerEth;
    balloonToken.transfer(msg.sender, amountOfTokens);
    emit BuyTokens(msg.sender, msg.value, amountOfTokens);
  }

  function redeemFreeToken(bytes calldata proof) public onlyKids(proof) {
    // TODO: only allow once per address
    balloonToken.transfer(msg.sender, 1);
    emit FreeToken(msg.sender, 1);
  }

  function withdraw() public onlyOwner {
    payable(this.owner()).transfer(address(this).balance);
  }

  function sellTokens(uint256 _amount) public {
    balloonToken.transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(_amount / tokensPerEth);
    emit SellTokens(msg.sender, _amount, _amount / tokensPerEth);
  }

}
