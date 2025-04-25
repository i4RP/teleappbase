import { useWriteContract } from 'wagmi';
import { GAME_COIN_ADDRESS, gameCoinABI } from '../contracts/GameCoin';
import { sepolia } from 'viem/chains';

export function useDepositAndApproveUSDT() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();
  
  const depositAndApproveUSDT = async (amount: bigint) => {
    return writeContractAsync({
      address: GAME_COIN_ADDRESS as `0x${string}`,
      abi: gameCoinABI,
      functionName: 'depositAndApproveUSDT',
      args: [amount],
      chainId: sepolia.id,
    });
  };
  
  return { depositAndApproveUSDT, isPending, isSuccess, error };
}

export function useUseGameCoin() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();
  
  const useGameCoin = async (amount: bigint) => {
    return writeContractAsync({
      address: GAME_COIN_ADDRESS as `0x${string}`,
      abi: gameCoinABI,
      functionName: 'useGameCoin',
      args: [amount],
      chainId: sepolia.id,
    });
  };
  
  return { useGameCoin, isPending, isSuccess, error };
}
