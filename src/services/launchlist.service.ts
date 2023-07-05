import axios from "axios";

type LaunchListUser = {
  email: string;
};

export async function addUserToLaunchList(user: LaunchListUser) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_LAUNCHLIST_URL}`,
      user
    );
    if (response.status === 200) {
      return true;
    }
    throw new Error("Failed to add user to launch list");
  } catch (e) {
    throw e;
  }
}
