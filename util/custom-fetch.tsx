import { Cookies } from "react-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const cookies = new Cookies()


async function customFetch(url: string, options:any = {}):Promise<Response> {
  const accessToken = cookies.get('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL}${url}`, { headers, ...options });

  if (response.status === 401) {
    const refreshToken = cookies.get("refreshToken")
    if (!refreshToken) {
      // handleLogout();
      return Promise.reject(new Error('Unauthorized'));
    }
    // 엑세스 토큰 재발급
    const newAccessToken = await refreshAccessToken(refreshToken);
    // 만약 엑세스토큰 재발급 실패시 로그아웃
    if (!newAccessToken) {
      // handleLogout();
      // Promise reject로 비동기 오류 출력
      return Promise.reject(new Error('Unauthorized'));
    }

    cookies.set('accessToken', newAccessToken,{path:'/'});
    headers.Authorization = `Bearer ${newAccessToken}`;
    // 최종적으로 내가사용한 URL에 요청 보냄
    response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  }

  return response;
}
// 리프레시토큰 검증 후 엑세스토큰 생성
async function refreshAccessToken(refreshToken:string) {
  try {
    const response = await fetch(`${BASE_URL}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {refreshToken:refreshToken} ),
    });
    console.log("response : ",response)

    console.log("refresh token : ",refreshToken)
    // 리프레시 토큰 만료
    if (!response.ok) throw new Error('Refresh token expired');

    const data = await response.json();
    return data.accessToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
}

// 리프레시토큰 만료시 로그아웃
// const handleLogout = ()=> {
//   const router = useRouter()

//   console.log('리프레시 토큰도 만료됨. 로그아웃 처리');
//   cookies.remove('accessToken');
//   cookies.remove('refreshToken');
//   router.push('/login')
// }

export default customFetch;