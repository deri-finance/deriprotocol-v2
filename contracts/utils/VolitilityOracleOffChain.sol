// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import '../interface/IVolitilityOracle.sol';

contract VolitilityOracleOffChain is IVolitilityOracle {

    string  public symbol;
    address public signatory;
    uint256 public delayAllowance;

    uint256 public timestamp;
    uint256 public volitility;

    constructor (string memory symbol_, address signatory_, uint256 delayAllowance_) {
        symbol = symbol_;
        signatory = signatory_;
        delayAllowance = delayAllowance_;
    }

    function setDelayAllowance(uint256 delayAllowance_) external {
        require(msg.sender == signatory, 'only signatory');
        delayAllowance = delayAllowance_;
    }

    function getVolitility() external override view returns (uint256) {
        require(block.timestamp - timestamp < delayAllowance, 'volitility expired');
        return volitility;
    }

    // update oracle volitility using off chain signed volitility
    // the signature must be verified in order for the volitility to be updated
    function updateVolitility(uint256 timestamp_, uint256 volitility_, uint8 v_, bytes32 r_, bytes32 s_) external override {
        uint256 lastTimestamp = timestamp;
        if (timestamp_ > lastTimestamp) {
            if (v_ == 27 || v_ == 28) {
                bytes32 message = keccak256(abi.encodePacked(symbol, timestamp_, volitility_));
                bytes32 hash = keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n32', message));
                address signer = ecrecover(hash, v_, r_, s_);
                if (signer == signatory) {
                    timestamp = timestamp_;
                    volitility = volitility_;
                }
            }
        }
    }

}
