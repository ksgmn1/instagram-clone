// 서버 주소
export const server = "http://localhost:3000/api";

// 로컬스토리지에서 로그인 토큰을 가져오는 함수
export function getBearerToken() {
  const user = JSON.parse(localStorage.getItem("user"));

  return "Bearer " + user.access_token;
}