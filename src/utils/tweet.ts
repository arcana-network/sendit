function composeAndSendTweet(tweet: string) {
  return window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
    "_blank"
  );
}

function composeAndSendDM(userId: string, message: string) {
  console.log(
    `https://twitter.com/messages/compose?recipient_id=${userId}&text=${encodeURIComponent(
      message
    )}`
  );
  return window.open(
    `https://twitter.com/messages/compose?recipient_id=${userId}&text=${encodeURIComponent(
      message
    )}`,
    "_blank"
  );
}

export { composeAndSendTweet, composeAndSendDM };
