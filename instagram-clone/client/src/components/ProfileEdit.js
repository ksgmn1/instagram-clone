import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
// 서버 요청 함수
import { updateProfile, updateAvatar } from "../service/user";
import AuthContext from "./auth/AuthContext";

export default function ProfileEdit() {
  // 인증 처리
  const { user, setUser } = useContext(AuthContext);
  // 이름
  const [newName, setNewName] = useState(user.name);
  // 자기소개
  const [newBio, setNewBio] = useState(user.bio);
  // 제출버튼 활성화 관리
  const disabled = user.name === newName && user.bio === newBio;

  // 키스테이트 추적
  console.log(user);

  // 폼 제출 처리
  async function handleSubmit(e) {
    try {
      e.preventDefault();

      // 새 프로필
      const editedProfile = {
        name : newName,
        bio : newBio
      };

      // 프로필 수정 요청
      const { user } = await updateProfile(editedProfile);

      // 유저 업데이트
      setUser(user);

      // 성공 메시지
      alert("수정되었습니다.");

    } catch (error) {
      alert(error);
    }
  };

  // 파일 처리  ( 사진 수정 )
  async function handleFile(e) {
    try {
      // 클라이언트가 업로드한 파일
      const file = e.target.files[0];

      // 컨텐츠 타입 - 파일 전송할 때 form data 타입을 사용한다
      const formData = new FormData();

      // 폼데이터에 파일을 추가한다
      formData.append("avatar", file);
      // append(key, value)

      // 서버 요청
      const { user }  = await updateAvatar(formData);

      // 응답객체로 user 업데이트
      setUser(user);

      // 완료 메시지
      alert("업로드되었습니다.")
    } catch(error) {
      alert(error);
    }
  };

  // 제목 업데이트
  useEffect(() => {
    document.title = "프로필 수정 - Instagram";
  }, [])

  return (
    <div className="mt-8 px-4">
      {/* 사진 업로드 폼 */}
      <div className="flex mb-4">
        <img
        src={user.avatarUrl}
        className="w-16 h-16 object-cover rounded-full border"
        />

        <div className="flex flex-col grow items-start ml-4">
          <h3>{user.username}</h3>

          <label className="text-sm font-semibold text-blue-500 cursor-pointer">
            <input
            type="file"
            className="hidden"
            onChange={handleFile}
            // 클라이언트측 파일 포맷 필터링
            accept="image/png, image/jpg, image/jpeg"
            />
            사진 업로드
          </label>
        </div>
      </div>
      {/* 정보 폼 */}
      <form onSubmit={handleSubmit}>
        {/* 이름 입력란 */}
        <div className="mb-2">
          <label htmlFor="name" className="block font-semibold">이름</label>
          <input
          type="text"
          id="name"
          name="name"
          className="border px-2 py-1 rounded w-full"
          value={newName}
          onChange={({ target }) => setNewName(target.value)}
          />
        </div>

        {/* 자기소개 입력란 */}
        <div className="mb-2">
          <label htmlFor="bio" className="block font-semibold">소개</label>
          <textarea
          id="bio"
          row="3"
          name="bio"
          className="border px-2 py-1 rounded w-full resize-none"
          value={newBio}
          onChange={({ target }) => setNewBio(target.value)}
          />
        </div>

        {/* 제출 및 취소 버튼 */}
        <div className="flex">
          <button
          type="submit"
          className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2
          disabled:opacity-[0.2]"
          disabled={disabled}
          >
            저장
          </button>

          <Link
          to={`/profiles/${user.username}`}
          className="text-sm font-semibold bg-gray-200 rounded-lg px-4 py-2 ml-2"
          >
            취소
          </Link>
        </div>
      </form>

    </div>
  )
  
};