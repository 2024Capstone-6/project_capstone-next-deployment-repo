import { Cookies } from "react-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const cookies = new Cookies();

async function customFetch(url: string, options: any = {}): Promise<Response> {
  const accessToken = cookies.get("accessToken");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    // 챗봇이나 음성 요청 등에만 credentials 붙임
    ...(url.includes("chatbot") ? { credentials: "include" } : {}),
  });

  if (response.status === 401) {
    const refreshToken = cookies.get("refreshToken");
    if (!refreshToken) return Promise.reject(new Error("Unauthorized"));

    const newAccessToken = await refreshAccessToken(refreshToken);
    if (!newAccessToken) return Promise.reject(new Error("Unauthorized"));

    cookies.set('accessToken', newAccessToken,{path:'/'});
    headers.Authorization = `Bearer ${newAccessToken}`;

    response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      ...(url.includes("chatbot") ? { credentials: "include" } : {}),
    });
  }

  return response;
}

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch(`${BASE_URL}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {refreshToken:refreshToken} ),
    });
    if (!response.ok) throw new Error("Refresh token expired");
    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
}

export default customFetch;
