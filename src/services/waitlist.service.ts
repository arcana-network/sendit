async function addUserToWaitlist(email: string, address: string) {
  const response = await fetch(import.meta.env.VITE_WAITLIST_URL, {
    method: "POST",
    body: JSON.stringify({
      email,
      address,
    }),
  });
  const data = await response.json();
  return data;
}

export { addUserToWaitlist };
