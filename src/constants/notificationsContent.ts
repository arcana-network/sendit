const notificationsContent = {
  0: ({ points }) => ({
    title: `You have earned ${points} points`,
    body: "",
    path: "Leaderboard",
    shoutout: false,
  }),
  256: ({ from, value }) => ({
    title: `Received ${value} from ${from}`,
    body: `You have received ${value} from ${from}. Give a shoutout on Twitter to earn XP.`,
    path: "History",
    shoutout: true,
  }),
  2: (data) => ({
    title: "Invite Claimed",
    body: "You friend has accepted your invite to join SendIt. You have earned 40 XP!",
    path: "",
    shoutout: false,
  }),
  3: (data) => ({
    title: "Invite Claimed",
    body: "Welcome to SendIt. You have earned 40 XP!",
    path: "",
    shoutout: false,
  }),
};

export default notificationsContent;
