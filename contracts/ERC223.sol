pragma solidity ^0.4.18;
import "./ERC20.sol";

// ----------------------------------------------------------------------------------------------
// KNOW Token by Kryptono Limited.
// An ERC223 standard
//
// author: Kryptono Team
// Contact: William@kryptono.exchange

contract ERC223 is ERC20{
    function transfer(address _to, uint _value, bytes _data) public returns (bool success);
    function transfer(address _to, uint _value, bytes _data, string _custom_fallback) public returns (bool success);
    event Transfer(address indexed _from, address indexed _to, uint _value, bytes indexed _data);
}