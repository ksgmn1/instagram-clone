import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

export default function AuthRequired({ children }) {

  // 유저 데이터
  const { user } = useContext(AuthContext);

  // 로그아웃 상태일 때
  if (!user) {
    // 로그인페이지로 이동시킨다.
    return <Navigate to="/accounts/login" replace={true} />
  }

  return children;
}