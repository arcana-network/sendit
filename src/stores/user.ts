import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS, LEADERBOARD_TYPES } from "@/constants/socket-ids";
import useRewardsStore from "@/stores/rewards";

type User = {
  points: number;
  rank: number;
  rewards: number;
};

const useUserStore = defineStore("user", {
  state: () =>
    ({
      points: 0,
      rank: 0,
      rewards: 0,
    } as User),
  actions: {
    async fetchUserPointsAndRank() {
      const socket = useSocketConnection();
      const rewardsStore = useRewardsStore();
      const response = await socket.sendMessage(SOCKET_IDS.GET_PROFILE, null);
      this.points = response.points;
      const leaderboardResponse = await socket.sendMessage(
        SOCKET_IDS.GET_LEADERBOARD,
        {
          ltype: LEADERBOARD_TYPES.GLOBAL,
        }
      );
      this.rank = leaderboardResponse.user_rank;
      await rewardsStore.fetchRewards();
      this.rewards = rewardsStore.rewards.length;
    },
  },
});

export default useUserStore;
