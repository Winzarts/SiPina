const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Terjadi kesalahan pada server");
  }

  return data;
}

export const api = {
  barang: {
    getAll: () => apiRequest("/barang"),
    create: (payload: any) => apiRequest("/barang", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id: string | number, payload: any) => apiRequest(`/barang/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...payload, id_barang: id }),
    }),
    delete: (id: string | number) => apiRequest(`/barang/${id}`, {
      method: "DELETE",
    }),
  },
  kelas: {
    getAll: () => apiRequest("/kelas"),
    create: (payload: any) => apiRequest("/kelas", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id: string | number, payload: any) => apiRequest(`/kelas/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...payload, id_kelas: id }),
    }),
    delete: (id: string | number) => apiRequest(`/kelas/${id}`, {
      method: "DELETE",
    }),
  },
  kategori: {
    getAll: () => apiRequest("/kategori"),
    create: (payload: any) => apiRequest("/kategori", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id: string | number, payload: any) => apiRequest(`/kategori/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...payload, id_kategori: id }),
    }),
    delete: (id: string | number) => apiRequest(`/kategori/${id}`, {
      method: "DELETE",
    }),
  },
  peminjaman: {
    getAll: () => apiRequest("/peminjaman"),
    getStats: () => apiRequest("/peminjaman/stats"),
    getById: (id: string | number) => apiRequest(`/peminjaman/${id}`),
    create: (payload: any) => apiRequest("/peminjaman", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    kembali: (id: string | number, payload: any) => apiRequest(`/peminjaman/${id}/kembali`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    update: (id: string | number, payload: any) => apiRequest(`/peminjaman/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    delete: (id: string | number) => apiRequest(`/peminjaman/${id}`, {
      method: "DELETE",
    }),
  },
  auth: {
    getMe: () => apiRequest("/auth/me"),
    createPetugas: (payload: any) => apiRequest("/auth/create-petugas", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    getListPetugas: () => apiRequest("/auth/petugas"),
    logout: () => apiRequest("/auth/logout", {
      method: "POST",
    }),
  },
  sekolah: {
    getAll: () => apiRequest("/sekolah"),
    getById: (id: string | number) => apiRequest(`/sekolah/${id}`),
    create: (payload: any) => apiRequest("/sekolah", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id: string | number, payload: any) => apiRequest(`/sekolah/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    delete: (id: string | number) => apiRequest(`/sekolah/${id}`, {
      method: "DELETE",
    }),
  }
};
