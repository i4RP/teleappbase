import { Address } from 'viem';
import { sepolia } from 'viem/chains';

export const gameCoinABI = [
  {
    inputs: [{ name: '', type: 'address' }],
    name: 'gameCoinBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'depositAndApproveUSDT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'useGameCoin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const GAME_COIN_ADDRESS = '0x359394D70Ca0565C9F5e85D9182ae62D4bcfE745';

export function formatGameCoinBalance(balance: bigint): string {
  const decimals = 6; // USDTと同じ小数点以下の桁数を想定
  const divisor = BigInt(10 ** decimals);
  
  if (balance === BigInt(0)) {
    return '0.00';
  }
  
  const integerPart = balance / divisor;
  const fractionalPart = balance % divisor;
  
  const formattedFractional = fractionalPart.toString().padStart(decimals, '0').slice(0, 2);
  
  return `${integerPart}.${formattedFractional}`;
}
