import { defineStore } from "pinia";
import { useConnection } from "@/stores/connection";
import activePiniaInstance from "@/stores";
import { SOCKET_IDS } from "@/constants/socket-ids";
import { ethers } from "ethers";

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
  gaslessOptedIn: boolean;
  gaslessAddress: string;
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
      gaslessOptedIn: false,
      gaslessAddress: "",
    } as User),
  actions: {
    async fetchUserPointsAndRank() {
      const response = (await conn.sendMessage(
        SOCKET_IDS.GET_PROFILE,
        null
      )) as any;
      this.gaslessOptedIn = response.gasless_opted_in || false;
      if (this.gaslessOptedIn) {
        const res = await conn.sendMessage(SOCKET_IDS.GET_GASLESS_INFO, {
          chain_id: 137,
          address: Buffer.from(ethers.getBytes(this.address)),
        });
        this.gaslessAddress = ethers.hexlify(res.scw_address);
      }
      const xpBreakdown = (await conn.sendMessage(
        SOCKET_IDS.GET_XP_BREAKDOWN,
        null
      )) as { task_id: number; total_points?: number; total_ponts?: number }[];
      this.points = 0; // reset points
      if (xpBreakdown?.length > 0) {
        const xpBreakdownObj = {} as XPBreakdown;
        for (const { task_id, total_points, total_ponts } of xpBreakdown) {
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
    async createGaslessWallet() {
      await conn.sendMessage(SOCKET_IDS.OPT_IN_GASLESS, null);
      this.gaslessOptedIn = true;
    },
  },
});

export default useUserStore;
