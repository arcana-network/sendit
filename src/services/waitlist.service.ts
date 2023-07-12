async function addUserToWaitlist(
  email: string,
  address: string,
  community?: string
) {
  const data = {
    email,
    address,
  };
  if (community) {
    data["community"] = Number(community);
  }
  const response = await fetch(import.meta.env.VITE_WAITLIST_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}

export { addUserToWaitlist };
