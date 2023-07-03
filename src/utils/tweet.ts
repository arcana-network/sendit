function composeAndSendTweet(tweet: string) {
  return window.open(
    `https://twitter.com/intent/tweet?text=${encodeURI(tweet)}`,
    "_blank"
  );
}

export { composeAndSendTweet };
