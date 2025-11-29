const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Token storage
let authToken: string | null = localStorage.getItem("qff_token");

const setToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem("qff_token", token);
  } else {
    localStorage.removeItem("qff_token");
  }
};

const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
};

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const Api = {
  // ============ AUTH ============
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    setToken(data.access_token);
    return data;
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration failed");
    }
    const data = await res.json();
    setToken(data.access_token);
    return data;
  },

  logout: () => {
    setToken(null);
  },

  getMe: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
  },

  isLoggedIn: () => !!authToken,

  // ============ ADMIN ============
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
  },

  updateUser: async (userId: string, data: { email?: string; role?: string; is_active?: boolean }) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update user");
    return res.json();
  },

  deleteUser: async (userId: string) => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return res.json();
  },

  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },

  // ============ CORE FEATURES ============
  health: async () => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
  },

  getBalance: async () => {
    const res = await fetch(`${API_BASE}/balance`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch balances");
    return res.json();
  },

  analyze: async (tx: any) => {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tx)
    });
    if (!res.ok) throw new Error("Analyze failed");
    return res.json();
  },

  getQuote: async (tx: any) => {
    const res = await fetch(`${API_BASE}/quote`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tx)
    });
    if (!res.ok) throw new Error("Quote failed");
    return res.json();
  },

  getRoute: async (tx: any) => {
    const res = await fetch(`${API_BASE}/route`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tx)
    });
    if (!res.ok) throw new Error("Route failed");
    return res.json();
  },

  quantumEstablish: async (intercept_prob?: number) => {
    let url = `${API_BASE}/quantum-establish`;
    if (intercept_prob !== undefined) {
      url += `?intercept_prob=${intercept_prob}`;
    }
    const res = await fetch(url, { 
      method: "POST",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Quantum key establishment failed");
    return res.json();
  },

  quantumStatus: async () => {
    const res = await fetch(`${API_BASE}/quantum-status`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Quantum status failed");
    return res.json();
  },

  pqcInfo: async () => {
    const res = await fetch(`${API_BASE}/pqc-info`);
    if (!res.ok) throw new Error("PQC info failed");
    return res.json();
  },

  execute: async (tx: any, key?: string, risk_score: number = 100) => {
    const res = await fetch(`${API_BASE}/execute`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...tx, key, risk_score })
    });
    if (!res.ok) throw new Error("Execute failed");
    return res.json();
  },

  history: async (limit: number = 50) => {
    const res = await fetch(`${API_BASE}/history?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("History fetch failed");
    return res.json();
  },

  metrics: async () => {
    const res = await fetch(`${API_BASE}/metrics`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Metrics failed");
    return res.text();
  }
};
