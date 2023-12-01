import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  // 로컬스토리지에서 user의 초기값을 가져온다 -> 로그인 상태 유지
  const initialUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(initialUser);

  // 유저상태(state) 감시자 - 유저 동기화
  useEffect(() => {
    if (user) { // 로그인 후 실행
      // 로컬스토리지에 유저데이터를 저장한다
      localStorage.setItem("user", JSON.stringify(user));
    } else { // 로그아웃 후 실행
      // 로컬스토리지에서 유저데이터를 삭제한다
      localStorage.removeItem("user");
    }
  }, [user])

  // 하위컴포넌트에게 전달되는 데이터
  const value = { user, setUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}