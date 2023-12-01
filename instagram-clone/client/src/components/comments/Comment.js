import { useState } from "react";
import { Link } from "react-router-dom";

export default function Comment({
  id,
  username,
  avatarUrl,
  content,
  displayDate,
  handleDelete
}) {

  // 더보기 메뉴(모달) 관리
  const [modalOpen, setModalOpen] = useState(false);

  // 삭제 버튼 클릭 처리
  async function handleDeleteClick() {
    try {
      // id 전달
      await handleDelete(id);

      // 댓글 삭제 후 modal 닫기
      setModalOpen(false);

    } catch(error){
      alert(error);
    }
  }

  // 모달 닫기 처리
  function handleOverlay(e) {
    if(e.target === e.currentTarget) {
      setModalOpen(false);
    }
  }

  // 더보기 메뉴 (모달)
  const modal = (
    <div
    className="fixed inset-0 flex justify-center items-center bg-black/[0.2] z-10"
    onClick={handleOverlay}
    >
      <ul className="bg-white w-60 rounded-xl">
        <li className="border-b">
          <button
          className="w-full px-4 py-2 text-sm font-semibold text-red-500"
          onClick={handleDeleteClick}
          >삭제</button>
        </li>
        <li>
          <button
          className="text-sm font-semibold w-full px-4 py-2"
          onClick={() => setModalOpen(false)}
          >
            닫기
            </button>
        </li>
      </ul>
    </div>
  )

  return(
    <li className="py-4 flex border-b">
      {/* 유저 아바타 */}
      <div className="shrink-0">
        <Link to={`/profiles/${username}`}>
          <img
          src={avatarUrl}
          className="w-8 h-8 object-cover border rounded-full"
          />
        </Link>
      </div>

      {/* 댓글 내용 */}
      <div className="grow ml-4">
        <Link to={`/profiles/${username}`} className="font-semibold">
          {username} {" "}
        </Link>
        {content}
        <p>
          <small className="font-xs test-gray-400">{displayDate}</small>
        </p>
      </div>

    {/* 더보기 버튼 */}
      <div className="ml-4">
      <svg
        className="w-1 cursor-pointer"
        onClick={() => setModalOpen(true)}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 128 512"
        >
        <path d="M64 360C94.93 360 120 385.1 120 416C120 446.9 94.93 472 64 472C33.07 472 8 446.9 8 416C8 385.1 33.07 360 64 360zM64 200C94.93 200 120 225.1 120 256C120 286.9 94.93 312 64 312C33.07 312 8 286.9 8 256C8 225.1 33.07 200 64 200zM64 152C33.07 152 8 126.9 8 96C8 65.07 33.07 40 64 40C94.93 40 120 65.07 120 96C120 126.9 94.93 152 64 152z"/>
      </svg>
      </div>

      {/* 모달 */}    
      {modalOpen && modal}

    </li>
  )
};