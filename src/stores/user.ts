import { defineStore } from "pinia";
import { useConnection } from "@/stores/connection";
import activePiniaInstance from "@/stores";
import { SOCKET_IDS } from "@/constants/socket-ids";

const conn = useConnection(activePiniaInstance);

type User = {
  points: number;
  rank: number;
  address: string;
  followedOnTwitter: boolean;
};

const useUserStore = defineStore("user", {
  state: () =>
    ({
      points: 0,
      rank: 0,
      rewards: 0,
      address: "",
      followedOnTwitter: false,
    } as User),
  actions: {
    async fetchUserPointsAndRank() {
      const response = (await conn.sendMessage(
        SOCKET_IDS.GET_PROFILE,
        null
      )) as any;
      this.followedOnTwitter = response.followed_on_twitter;
      this.points = response.points;
      this.rank = response.global_rank;
    },
  },
});

export default useUserStore;
