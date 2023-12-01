import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../service/post";

export default function PostCreate() {
  // 클라이언트가 선택한 파일 저장
  const [files, setFiles] = useState([]);
  // 사진에 대한 설명
  const [caption, setCaption] = useState("");
  // 페이지 이동
  const navigate = useNavigate();

  // 폼 제출 처리
  async function handleSubmit(e) {
    try {
      e.preventDefault();

      // 컨텐츠 타입 - form data (파일 업로드)
      const formData = new FormData();

      // 반복작업
      files.forEach(file => {
        // 폼 데이터에 파일 추가
        formData.append("photos", file);
        // aapend(key, value)
      })

      // 폼 데이터에 캡션 추가
      formData.append("caption", caption);

      // 게시물 생성 요청
      await createPost(formData);

      // 피드로 이동
      navigate("/");

    } catch (error) {
      alert(error);
    }
  };

  // 이미지 미리보기
  const photoPreviewList = files.map(file => (
    <li key={file.name} className="pt-[100%] relative">
      <img
      className="absolute inset-0 w-full h-full object-cover"
      // URL.createObjectURL(file) : file에 접근할 수 있는 URL을 생성한다.
      src={URL.createObjectURL(file)}
      alt={file.name}
      />
    </li>
  ))

  return(
    <form
    className="bg-white max-w-xs mt-20 mx-auto rounded-2xl"
    onSubmit={handleSubmit}
    >
      {/* 타이틀 */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-center">게시물 업로드</h3>
      </div>

      <div className="p-4">
        {/* 업로드 버튼 */}
        <label className="inline-block mb-2 font-semibold text-sm px-4 py-2 bg-gray-200
        rounded-lg cursor-pointer">
          <input
          type="file"
          className="hidden"
          // Array.from: length 속성을 가진 객체를 배열타입으로 변환한다.
          onChange={({ target }) => setFiles(Array.from(target.files))}
          // 여러개의 파일을 선택할 수 있다.
          multiple = {true}
          // 클라이언트 측 파일 포맷 필터링
          accept = "image/jpg, image/png image/jpeg"
          />
          사진 선택 +
        </label>
     

      {/* 사진 미리보기 */}
      {files.length > 0 && (
        <ul className="grid grid-cols-3 mb-2">
          {photoPreviewList}
        </ul>
      )}

      {/* 캡션 */}
      <div className="mb-2">
        <label
        htmlFor="caption"
        className="block font-semibold"
        >
          사진에 대해서 설명해주세요
        </label>
        <textarea
        rows="2" // 2줄 까지 입력가능
        id="caption"
        className="block w-full px-2 py-1 rounded border resize-none"
        onChange={({target}) => setCaption(target.value)}
        value={caption}
        />
      </div>

      {/* 제출버튼 */}
      <button
      type="submit"
      className="px-4 py-2 text-sm font-semibold bg-blue-500 rounded-lg text-white
      disabled:opacity-[0.2]"
      disabled={files.length < 1}
      >
        업로드
      </button>
      </div>
    </form>
  )
};