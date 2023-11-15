import { Connection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";

async function getTwitterRequestToken(connection: Connection) {
  return await connection.sendMessage(SOCKET_IDS.TWITTER_REQUEST_TOKEN, {
    callback_url: window.location.href,
  });
}

async function openTwitterLogin(connection: Connection) {
  const { request_url } = await getTwitterRequestToken(connection);
  //   const url = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestToken}`;
  window.open(request_url, "_blank");
}

async function handleTwitterRedirect(
  connection: Connection,
  oauthToken: string,
  oauthVerifier: string
) {
  return await connection.sendMessage(SOCKET_IDS.TWITTER_HANDLE_REDIRECT, {
    oauthToken,
    oauthVerifier,
  });
}

export { getTwitterRequestToken, openTwitterLogin, handleTwitterRedirect };
