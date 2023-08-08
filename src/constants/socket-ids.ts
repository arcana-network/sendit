const SOCKET_IDS = {
  SEND_TX: 1,
  GET_LEADERBOARD: 2,
  GET_PROFILE: 3,
  SET_PROFILE: 4,
  REDEEM_REWARDS: 5,
  EMAIL_INVITE: 6,
  GET_CHAINS: 7,
  NOTIFICATION: 8,
  NOTIFICATION_MARK_AS_READ: 9,
  GET_TX_HISTORY: 10,
  TWITTER_USERNAME_TO_ID: 11,
  TWITTER_ID_TO_USERNAME: 12,
  VERIFY_INVITE: 13,
  VERIFY_TWEET: 14,
  GET_GAS_STATION: 160,
  PING: 255,
  VERIFY_TWITTER_FOLLOW: 16,
};

const LEADERBOARD_TYPES = {
  GLOBAL: "g".charCodeAt(0),
  WEEKLY: "w".charCodeAt(0),
};

const TOKEN_TYPES = {
  NATIVE: 0,
  ERC20: 1,
};

const GAS_SUPPORTED_CHAINS = [137, 80001];

export { SOCKET_IDS, LEADERBOARD_TYPES, TOKEN_TYPES, GAS_SUPPORTED_CHAINS };
