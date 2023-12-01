/*
validator
폼데이터 유효성 검사 (클라이언트 측)

1 isEmail - 이메일 검사
2 isUsername - 아이디 검사
3 isPassword - 비밀번호 검사
*/

export function isEmail(email) {
  // 이메일 검사 패턴 (정규식)
  const patt = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/

  // 올바른 이메일인 경우
  if (email.match(patt)) {
    return true;
  }

  return false;
}

export function isUsername(username) {
  // 아이디 검사 패턴
  const patt = /^[a-zA-Z0-9]{5,}$/

  if (username.match(patt)) {
    return true;
  }

  return false;
}

export function isPassword (password) {
  if (password.trim().length >= 5) {
    return true;
  }

  return false;
}