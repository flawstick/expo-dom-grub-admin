import axios from "axios";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface LoginState {
  token: string | null;
  userInfo: any;
  isLoggedIn: boolean;
  setToken: (token: string | null) => Promise<void>;
  setUserInfo: (userInfo: any) => void;
  logout: () => Promise<void>;
  login: (
    username: string,
    password: string,
    tenantId: string,
  ) => Promise<void>;
  response: any;
  isLoading: boolean;
  error: any;
}

export const useLoginStore = create<LoginState>((set) => ({
  token: null,
  userInfo: null,
  isLoggedIn: false,
  response: null,
  isLoading: false,
  error: null,

  setToken: async (token: string | null) => {
    if (token === null) {
      await SecureStore.deleteItemAsync("userToken");
    } else {
      await SecureStore.setItemAsync("userToken", token);
    }
    set({ token, isLoggedIn: !!token });
  },

  setUserInfo: (userInfo) => {
    set({ userInfo });
    if (userInfo?.firstName) {
      SecureStore.setItemAsync("firstName", userInfo.firstName);
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("userToken");
    set({ token: null, userInfo: null, isLoggedIn: false });
  },

  login: async (username: string, password: string, tenantId: string) => {
    set({ isLoading: true, error: null });

    const authUrl = "https://api.aionsites.com/auth/login";

    try {
      const maxRetries = 3;
      let attempt = 0;
      let response;

      while (attempt < maxRetries) {
        attempt += 1;
        try {
          response = await axios.post(
            authUrl,
            {
              credentials: { username, password },
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-tenant-id": tenantId,
              },
              timeout: 10000, // Set timeout to 10 seconds
            },
          );

          if (response.data.token) {
            break;
          } else {
            throw new Error("Login failed, no token received");
          }
        } catch (err) {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
          } else {
            throw err;
          }
        }
      }

      set({ token: response?.data.token });
      set({ userInfo: response?.data.userData, response: response?.data });
    } catch (err: any) {
      console.error("Error during login request:", err);

      if (err.response) {
        console.error("Response error:", err.response);
        set({ error: err.response.data });
      } else if (err.request) {
        console.error("Request made but no response received:", err.request);
        set({
          error:
            "No response received from server. Check your network connection.",
        });
      } else {
        console.error("Error setting up the request:", err.message);
        set({ error: err.message });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Function to initialize the login store with existing SecureStore data
export async function initializeUserStore() {
  const token = await SecureStore.getItemAsync("userToken");
  const firstName = await SecureStore.getItemAsync("firstName");
  useLoginStore.setState({
    token,
    userInfo: { firstName },
    isLoggedIn: !!token,
  });
}
