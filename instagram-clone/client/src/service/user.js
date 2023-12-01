import { server, getBearerToken } from "./header";

/*
  유저 요청

    1 createUser - 유저 생성 요청
    2 signIn - 로그인 요청
    3 updateProfile - 프로필 정보 수정 요청
    4 updateAvatar - 프로필 사진 수정 요청
*/

export async function createUser(newUser) {

  /*
    fetch(URL, opts)
    서버 요청 함수
    결과로 프로미스 객체를 리턴한다.
  */
  const res = await fetch(`${server}/users`, {
    // 요청 메서드
    method: "POST",
    // 요청 헤더 - JSON
    headers: { "Content-Type": "application/json" },
    // 요청 바디
    body: JSON.stringify(newUser)
  })

  // 응답코드가 200 (OK)이 아닌 경우
  if (!res.ok) {
    // 에러 메시지를 던진다
    throw new Error(res.statusText + "Error");
  }

  // 응답 객체를 리턴한다.
  return await res.json();
};

export async function signIn(email, password) {
  const res = await fetch(`${server}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error")
  }

  return await res.json();
};

export async function updateProfile(editedProfile) {
  const res = await fetch(`${server}/users/user`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      // 로그인 토큰
      "Authorization": getBearerToken() 
    },
    body: JSON.stringify(editedProfile)
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function updateAvatar(formData) {
  const res = await fetch(`${server}/users/user`, {
    method: "PUT",
    headers: { 
      "Authorization": getBearerToken() 
    },
    body: formData // 파일 전송
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};