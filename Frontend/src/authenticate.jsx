const API = "http://127.0.0.1:8000";

export const fetchWithRefresh = async (url, options = {}) => {
  let access = localStorage.getItem("access");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(`${API}/refresh/`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      localStorage.clear();
      window.location.reload();
      return;
    }

    const data = await refreshResponse.json();
    localStorage.setItem("access", data.access);

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.access}`,
      },
      credentials: "include",
    });
  }

  return response;
};
