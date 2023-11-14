import { defineStore } from "pinia";
import { useConnection } from "@/stores/connection";
import activePiniaInstance from "@/stores";
import { SOCKET_IDS } from "@/constants/socket-ids";

const conn = useConnection(activePiniaInstance);

type XPBreakdown = Record<string, number>;

const XPBreakdownTasks = {
  256: "referreePoints",
};

type User = {
  points: number;
  rank: number;
  xpBreakdown: XPBreakdown;
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
      xpBreakdown: {},
    } as User),
  actions: {
    async fetchUserPointsAndRank() {
      const response = (await conn.sendMessage(
        SOCKET_IDS.GET_PROFILE,
        null
      )) as any;
      const xpBreakdown = (await conn.sendMessage(
        SOCKET_IDS.GET_XP_BREAKDOWN,
        null
      )) as { task_id: number; total_ponts?: number; total_points?: number }[];
      this.points = 0; // reset points
      if (xpBreakdown?.length > 0) {
        const xpBreakdownObj = {} as XPBreakdown;
        for (const { task_id, total_ponts, total_points } of xpBreakdown) {
          this.points += total_points || total_ponts || 0;
          if (XPBreakdownTasks[task_id]) {
            xpBreakdownObj[XPBreakdownTasks[task_id]] =
              total_points || total_ponts || 0;
          }
        }
        this.xpBreakdown = xpBreakdownObj;
      }
      this.followedOnTwitter = response.followed_on_twitter;
      // this.points = response.points;
      this.rank = response.global_rank ?? 0;
    },
  },
});

export default useUserStore;
