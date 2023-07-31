import { defineStore } from "pinia";
import useSocketConnection from "@/use/socketConnection";
import { SOCKET_IDS, LEADERBOARD_TYPES } from "@/constants/socket-ids";

type User = {
  points: number;
  rank: number;
  address: string;
};

const useUserStore = defineStore("user", {
  state: () =>
    ({
      points: 0,
      rank: 0,
      rewards: 0,
      address: "",
    } as User),
  actions: {
    async fetchUserPointsAndRank() {
      const socket = useSocketConnection();
      const response = (await socket.sendMessage(
        SOCKET_IDS.GET_PROFILE,
        null
      )) as any;
      this.points = response.points;
      const leaderboardResponse = (await socket.sendMessage(
        SOCKET_IDS.GET_LEADERBOARD,
        {
          ltype: LEADERBOARD_TYPES.GLOBAL,
          offset: 0,
          limit: 3,
        }
      )) as any;
      this.rank = leaderboardResponse.user_rank;
    },
  },
});

export default useUserStore;
