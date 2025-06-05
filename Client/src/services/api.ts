import axios from "axios";
import { User } from "../types/user";
import { CredentialResponse } from "@react-oauth/google";
import { AuthResponse } from "../types/user";
import { config } from "../config";

const API_BASE_URL = config.apiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const registerUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      fullName,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to register";
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to login";
  }
};

interface GoogleSigninResponse extends AuthResponse {
  isNewUser: boolean;
}

export const googleSignin = async (
  credentialResponse: CredentialResponse
): Promise<GoogleSigninResponse> => {
  try {
    const response = await api.post<GoogleSigninResponse>(
      "/auth/google",
      credentialResponse
    );
    return response.data;
  } catch (error: any) {
    console.error("googleSignin error");
    throw error;
  }
};

export const updateProfile = async (
  userId: string,
  formData: FormData,
  accessToken: string | null
) => {
  try {
    const response = await api.put(`/auth/profile/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Failed to update profile";
  }
};

export const usersService = {
  getUserProfile: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Failed to fetch user profile";
    }
  },

  //continue- access token
  updateProfile: async (
    updateUser: User,
    formData: FormData,
    accessToken: string | null
  ) => {
    try {
      const response = await api.put(
        `/auth/profile/${updateUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Failed to update profile";
    }
  },
};

// בדיקה אם המשתמש קיים לפי מייל
export const checkUserExists = async (email: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/users/email/${email}`);
  console.log("checkUserExists response:", res);

  if (!res.ok) return false;

  const data = await res.json();
  console.log("checkUserExists data:", data);

  return data.exists === true;
};

export default api;
