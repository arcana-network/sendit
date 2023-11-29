const content = {
  TWITTER_REDIRECT_MSG: "Redirecting back to Sendit. Please wait...",
  UNDER_MAINTENANCE: {
    TITLE: "We are Under Maintenance",
    MESSAGE: "We will be back shortly!",
  },
  LOGIN: {
    OKX_CONNECTING: "Connecting to OKXWallet...",
    SOCIAL_LOGIN: "Logging in...",
    PASSWORDLESS_LOGIN: (email: string) =>
      `Click on the verification mail sent to ${email}...`,
  },
  REQUEST_PAYMENTS: {
    REJECT: "Rejecting request...",
  },
  SWITCH_ACCOUNT: {
    TITLE: "Switching account...",
    SUB_TITLE:
      "Accounts switched by the wallet. Please approve the new signature request to continue.",
  },
  CONNECTING: {
    GENERIC: "Connecting...",
  },
  FAUCET_FUNDS: {
    AIRDROP_PROGRESS: "Airdrop in progress...",
  },
  INIT: {
    GENERIC: "Initializing...",
  },
  TX_HISTORY: {
    LOADING: "Loading transaction history...",
    LOADING_MORE: "Loading more transactions...",
  },
  AIRDROP: {
    CLAIM_STATUS: {
      INIT: "Claim Initiated",
      COMPLETE: "Claim Completed",
      VERIFIED: "Account Verified",
    },
    FETCHING_DETAILS: "Fetching airdrop details...",
    CLAIMING: "Claiming airdrop...",
  },
  LEADERBOARD: {
    LOADING: (duration: string) => `Fetching ${duration} leaderboard...`,
    LOADING_MORE: (duration: string) =>
      `Fetching more from ${duration} leaderboard...`,
  },
  TWEET_VERIFYING: "Verifying tweet...",
};

const errors = {
  SELF_TX_ERROR: "self-transactions are not permitted",
  INVALID_TX: "Invalid transaction",
  OKX_NOT_INSTALLED:
    "OKXWallet is not installed. Please install OKXWallet to continue.",
  OKX_FAILED_TO_CONNECT: "Failed to connect to OKXWallet. Please try again.",
  FAUCET_FUNDS_AIRDROP_CLAIMED: "Airdrop already claimed for this account",
  SOCKET_CONNECTION_ERROR: "Error connecting to socket",
  SIGNATURE_REJECTED: "Signature rejected",
  AIRDROP: {
    CLAIM_STATUS: {
      GENERIC_FAILURE: "Claim Failed - Verification Unsuccessful.",
      TWITTER_ALREADY_LINKED:
        "Claim Failed - Twitter account already linked to another wallet.",
      TWITTER_ACCOUNT_CREATED_AFTER:
        "Claim Failed - Twitter account was created post 01 Sep'23.",
    },
    NOT_LIVE: (phaseName: string) => `Airdrop ${phaseName} is not live yet.`,
  },
  TWEET_VERIFY_ERROR: "Error verifying tweet. Please try again.",
  TOKEN_REQUEST: {
    EXPIRED: {
      TITLE: "Token Request Expired",
      MESSAGE:
        "The request for the tokens has expired as it has been over a week since the request was created.",
    },
    ALREADY_SENT: {
      TITLE: "Tokens Already Sent",
      MESSAGE: "The requested tokens have already been sent to the recipient.",
    },
    CANCELLED: {
      TITLE: "Token Request Cancelled",
      MESSAGE: "The request for the tokens was cancelled by the requester.",
    },
    REJECTED: {
      TITLE: "Token Request Rejected",
      MESSAGE:
        "The request for the tokens is already been rejected by someone.",
    },
  },
};

export { content, errors };
