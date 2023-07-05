function composeAndSendTweet(tweet: string) {
  return window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
    "_blank"
  );
}

export { composeAndSendTweet };
