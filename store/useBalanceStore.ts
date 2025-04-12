import { create } from 'zustand';
import { sumAmountByCategory } from '@/lib/prisma/transaction.service';
import { TRANSACTION_CATEGORY } from '@prisma/client'; // Import the enum

// Define the structure for the balance state
interface BalanceState {
  messageBalance: number; // Renamed from dailyBalance
  tokenBalance: number;   // Renamed from weeklyBalance
  storageBalance: number; // Renamed from monthlyBalance
  isLoading: boolean;
  error: string | null;
  fetchBalances: () => Promise<void>;
  // Consider adding functions here if balances need to be updated optimistically
  // after a transaction, before re-fetching.
}

/**
 * Zustand store for managing user balances related to usage limits.
 */
export const useBalanceStore = create<BalanceState>((set) => ({
  // Initial state
  messageBalance: 0,
  tokenBalance: 0,
  storageBalance: 0,
  isLoading: false,
  error: null,

  /**
   * Fetches the current balances for daily, weekly, and monthly limits
   * by summing transactions for the respective categories.
   */
  fetchBalances: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch each balance by calling the service function for the specific category.
      const message = await sumAmountByCategory(TRANSACTION_CATEGORY.MESSAGE);
      const token = await sumAmountByCategory(TRANSACTION_CATEGORY.TOKEN);
      const storage = await sumAmountByCategory(TRANSACTION_CATEGORY.STORAGE);

      set({
        messageBalance: message,
        tokenBalance: token,
        storageBalance: storage,
        isLoading: false,
      });
    } catch (err) {
      console.error("Failed to fetch balances:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching balances";
      set({
        error: errorMessage,
        isLoading: false,
        messageBalance: 0, // Reset balances on error
        tokenBalance: 0,
        storageBalance: 0,
      });
    }
  },
}));

// Example usage (in a component):
// import { useBalanceStore } from '@/store/useBalanceStore';
// import { useEffect } from 'react';
//
// const MyComponent = () => {
//   const { messageBalance, tokenBalance, storageBalance, isLoading, error, fetchBalances } = useBalanceStore();
//
//   useEffect(() => {
//     fetchBalances(); // Fetch balances when component mounts
//   }, [fetchBalances]);
//
//   if (isLoading) return <div>Loading balances...</div>;
//   if (error) return <div>Error loading balances: {error}</div>;
//
//   return (
//     <div>
//       <p>Message Balance: {messageBalance}</p>
//       <p>Token Balance: {tokenBalance}</p>
//       <p>Storage Balance: {storageBalance}</p>
//     </div>
//   );
// };
