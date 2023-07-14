import { defineStore } from "pinia";
import { fetchRewards as fetchRewardsFromAnkr } from "@/services/ankr.service";

type RewardState = {
  name: string;
  imageUrl: string;
  tokenId: string;
  contractAddress: string;
};

const useRewardsStore = defineStore("rewards", {
  state: () => ({
    rewards: [] as RewardState[],
  }),
  actions: {
    async fetchRewards(walletAddress: string) {
      const rewards = await fetchRewardsFromAnkr(walletAddress);
      if (rewards) {
        this.rewards = rewards;
      }
      setInterval(async () => {
        const rewards = await fetchRewardsFromAnkr(walletAddress);
        if (rewards) {
          this.rewards = rewards;
        }
      }, 3000);
    },
  },
});

export default useRewardsStore;
