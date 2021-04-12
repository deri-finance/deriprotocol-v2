// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import '../interface/IERC20.sol';
import '../interface/IUniswapV2Pair.sol';
import '../interface/IUniswapV2Router02.sol';
import '../library/SafeMath.sol';
import '../library/SafeERC20.sol';

contract BTokenHandlerSUSHIHUSDT {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 constant Q112 = 2**112;

    // Kovan
    address public constant uniswapRouter = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public constant uniswapPair = 0x7aD933b3Efed714eBFdaDC48AF35f2d5239F4eB4;
    address public constant sushi = 0xA1E0a0709f1eFE65833a088a4426da6d6BC14b9D;
    address public constant usdt = 0x77F120dF3A2e518BdFDE4330a6140c77103271DA;
    uint256 public constant decimals0 = 18;
    uint256 public constant decimals1 = 6;

    uint256 public price0CumulativeLast1;
    uint256 public price0CumulativeLast2;
    uint256 public blockTimestampLast1;
    uint256 public blockTimestampLast2;

    uint256 public price;

    constructor () {
        price0CumulativeLast2 = IUniswapV2Pair(uniswapPair).price0CumulativeLast();
        (, , blockTimestampLast2) = IUniswapV2Pair(uniswapPair).getReserves();
        IERC20(sushi).approve(uniswapRouter, type(uint256).max);
    }

    function getPrice() public returns (uint256) {
        (uint256 reserve0, uint256 reserve1, uint256 timestamp) = IUniswapV2Pair(uniswapPair).getReserves();
        if (timestamp != blockTimestampLast2) {
            price0CumulativeLast1 = price0CumulativeLast2;
            blockTimestampLast1 = blockTimestampLast2;
            price0CumulativeLast2 = IUniswapV2Pair(uniswapPair).price0CumulativeLast();
            blockTimestampLast2 = timestamp;
        }
        if (blockTimestampLast1 != 0) {
            price = (price0CumulativeLast2 - price0CumulativeLast1) / (blockTimestampLast2 - blockTimestampLast1) * 10**(decimals0 - decimals1 + 18) / Q112;
        } else {
            price = reserve1 * 10**(decimals0 - decimals1 + 18) / reserve0;
        }
        return price;
    }

    function swap(uint256 maxAmountIn, uint256 minAmountOut) public returns (uint256, uint256) {
        IERC20(sushi).safeTransferFrom(msg.sender, address(this), maxAmountIn.rescale(18, decimals0));
        uint256 balance01 = IERC20(sushi).balanceOf(address(this));

        address[] memory path = new address[](2);
        path[0] = sushi;
        path[1] = usdt;
        IUniswapV2Router02(uniswapRouter).swapTokensForExactTokens(
            minAmountOut.rescale(18, decimals1),
            balance01,
            path,
            address(this),
            block.timestamp + 3600
        );

        uint256 balance02 = IERC20(sushi).balanceOf(address(this));
        uint256 balance12 = IERC20(usdt).balanceOf(address(this));
        IERC20(sushi).safeTransfer(msg.sender, balance02);
        IERC20(usdt).safeTransfer(msg.sender, balance12);

        return ((balance01 - balance02).rescale(decimals0, 18), balance12.rescale(decimals1, 18));
    }

}
