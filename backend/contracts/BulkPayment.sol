// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BulkPaymentContract is ReentrancyGuard {
    // Events for tracking payments
    event NativeBulkPayment(address indexed initiator, uint256 totalAmount);
    event ERC20BulkPayment(address indexed initiator, address indexed tokenAddress, uint256 totalAmount);
    event PaymentFailed(address indexed recipient, uint256 amount, bool isNative);

    // Bulk payment function for native ETH
    function bulkPayNative(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        payable 
        nonReentrant 
    {
        // Validate input arrays match
        require(recipients.length == amounts.length, "Mismatched input arrays");
        
        // Calculate total amount to distribute
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        // Ensure sufficient funds
        require(msg.value >= totalAmount, "Insufficient native ETH");
        
        // Distribute payments
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = payable(recipients[i]).call{value: amounts[i]}("");
            
            if (!success) {
                emit PaymentFailed(recipients[i], amounts[i], true);
            }
        }
        
        // Refund excess ETH
        if (msg.value > totalAmount) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalAmount}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit NativeBulkPayment(msg.sender, totalAmount);
    }
    
    // Bulk payment function for ERC20 tokens
    function bulkPayERC20(
        IERC20 token, 
        address[] calldata recipients, 
        uint256[] calldata amounts
    ) 
        external 
        payable
        nonReentrant 
    {
        // Validate input arrays match
        require(recipients.length == amounts.length, "Mismatched input arrays");
        
        // Calculate total amount to distribute
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        // Check sender's balance and allowance
        require(
            token.balanceOf(msg.sender) >= totalAmount, 
            "Insufficient token balance "
        );

        
        // Distribute tokens
        for (uint256 i = 0; i < recipients.length; i++) {
            bool success = token.transferFrom(msg.sender, recipients[i], amounts[i]);
            
            if (!success) {
                emit PaymentFailed(recipients[i], amounts[i], false);
            }
        }
        
        emit ERC20BulkPayment(msg.sender, address(token), totalAmount);
    }
    
    // Fallback to receive native ETH
    receive() external payable {}
}