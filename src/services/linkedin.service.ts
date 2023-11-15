async function generateLinkedinAuthorization() {
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id={your_client_id}&redirect_uri={your_callback_url}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social"
  );
  const data = await response.json();
  return data;
}

async function handleLinkedinRedirect() {
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code={your_code}&redirect_uri={your_callback_url}&client_id={your_client_id}&client_secret={your_client_secret}"
  );
  const data = await response.json();
  return data;
}
