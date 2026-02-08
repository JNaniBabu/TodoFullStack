const baseURL = "http://127.0.0.1:8000";

export const authFetch = async (url, options = {}) => {
  let access = localStorage.getItem("access");
  let refresh = localStorage.getItem("refresh");

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    "Authorization": `Bearer ${access}`,
  };

  let response = await fetch(baseURL + url, options);

  // If access token expired
  if (response.status === 401) {
    const refreshRes = await fetch(baseURL + "/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    const refreshData = await refreshRes.json();

    // store new access
    localStorage.setItem("access", refreshData.access);

    // retry original request
    options.headers["Authorization"] = `Bearer ${refreshData.access}`;
    response = await fetch(baseURL + url, options);
  }

  return response;
};

export default authFetch