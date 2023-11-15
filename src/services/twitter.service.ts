import { SOCKET_IDS } from "@/constants/socket-ids";

async function getTwitterRequestToken(connection: any) {
  return await connection.sendMessage(SOCKET_IDS.TWITTER_REQUEST_TOKEN);
}

async function openTwitterLogin(connection: any) {
  const url = await getTwitterRequestToken(connection);
  window.open(url, "_blank");
}

async function handleTwitterRedirect(
  connection: any,
  data: {
    oauth_token: string;
    oauth_verifier: string;
  }
) {
  return await connection.sendMessage(SOCKET_IDS.TWITTER_HANDLE_REDIRECT, {
    oauth_token: data.oauth_token,
    oauth_verifier: data.oauth_verifier,
  });
}

export { getTwitterRequestToken, openTwitterLogin, handleTwitterRedirect };
