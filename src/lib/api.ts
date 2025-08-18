// Base API configuration and utilities
const API_BASE_DEV = process.env.NEXT_PUBLIC_API_BASE_DEV || "http://192.168.0.87:3001/api";
const API_BASE_PROD = process.env.NEXT_PUBLIC_API_BASE_PROD || "https://back-end-production-17b6.up.railway.app/api";

// Use development URL for now, switch based on environment
export const API_BASE =
  process.env.NODE_ENV === "production" ? API_BASE_PROD : API_BASE_DEV;

// Token management
export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// Function to decode JWT token and extract user information
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Function to get user info from token
export const getUserFromToken = (): {
  id?: string;
  role?: string;
  municipalityId?: string;
} | null => {
  const token = getToken();
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.id,
    role: decoded.role || decoded.type,
    municipalityId: decoded.id, // For municipalities, the ID is the municipality ID
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  console.log("🔐 isAuthenticated - Token exists:", !!token);
  return !!token;
};

// Get authentication headers
export const getAuthHeaders = () => {
  const token = getToken();
  console.log("🔐 getAuthHeaders - Token exists:", !!token);
  console.log(
    "🔐 getAuthHeaders - Token value:",
    token ? `${token.substring(0, 20)}...` : "null"
  );
  console.log("🔐 getAuthHeaders - Full token:", token);

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  console.log("🔐 getAuthHeaders - Final headers:", headers);
  console.log(
    "🔐 getAuthHeaders - Authorization header:",
    headers.Authorization
  );
  return headers;
};

// Refresh token function
export const refreshToken = async () => {
  const refreshTokenValue = getRefreshToken();
  if (!refreshTokenValue) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setTokens(data.token, data.refreshToken);
    return data.token;
  } catch (error) {
    clearTokens();
    // Don't redirect automatically, let the calling code handle it
    throw error;
  }
};

// Central API call function with automatic token refresh
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // Check if this is a local API route (starts with /auth/me)
    if (endpoint === "/auth/me") {
      console.log("🔐 apiCall - Using local API route for auth/me");
      const authHeaders = getAuthHeaders();
      console.log("🔐 apiCall - Auth headers for local route:", authHeaders);

      const response = await fetch("/api/auth/me", {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    }

    // For other endpoints, use the backend
    const headers = {
      ...getAuthHeaders(),
      ...options.headers,
    };

    const fullUrl = `${API_BASE}${endpoint}`;

    console.log("🔐 apiCall - Starting request...");
    console.log("🔐 apiCall - API_BASE:", API_BASE);
    console.log("🔐 apiCall - endpoint:", endpoint);
    console.log("🔐 apiCall - Full URL:", fullUrl);
    console.log(
      "🔐 apiCall - Expected URL should be:",
      `${API_BASE}${endpoint}`
    );
    console.log("🔐 apiCall - Headers being sent:", headers);
    console.log("🔐 apiCall - Token present:", !!getToken());
    console.log("🔐 apiCall - Options:", options);

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    console.log("🔐 apiCall - Response status:", response.status);
    console.log("🔐 apiCall - Response URL:", response.url);

    if (response.status === 401) {
      console.log("🔐 apiCall - Received 401, attempting token refresh");
      // Try to refresh token
      try {
        await refreshToken();
        // Retry the original request with new token
        const retryResponse = await fetch(fullUrl, {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }

        return await retryResponse.json();
      } catch (refreshError) {
        // Refresh failed, clear tokens but don't redirect automatically
        clearTokens();
        throw new Error("Authentication failed");
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};
