import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// 서버 요청 처리
import { getComments, createComment, deleteComment } from "../../service/comment";
// 댓글 폼
import Form from "./Form"
// 각각의 댓글
import Comment from "./Comment";
// 대기 상태 표시
import Spinner from "../Spinner";

export default function Comments() {
  // 게시물의 아이디
  const { id } = useParams();
  // 에러 처리
  const [error, setError] = useState(null);
  // 대기 상태 관리
  const [isLoaded, setIsLoaded] = useState(false);
  // 댓글 저장
  const [comments, setComments] = useState([]);
   
  // 키 스테이트 추적
  console.log(comments);

  // 댓글 가져오기 요청
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // 서버 요청
      const data = await getComments(id);

      // comments 업데이트
      setComments([...comments, ...data.comments]);
      // 배열을 연결하는 구조 - 더보기 기능과 관련
      /*
        ...comments : 기존에 있는 댓글
        ...data.comments : 새롭게 요청한 댓글

        클라이언트측에서 서버에서 받아온 데이터를 누적한다.
      */

    } catch(error) {
      // 에러 처리
      setError(error)
    } finally {
      // 대기상태를 끝낸다.
      setIsLoaded(true);
    }
  }

  // 댓글 추가 처리
  async function handleAddComment(content) {
    const data = await createComment(id, content);

    const updatedComments = [data.comment, ...comments];
    setComments(updatedComments);

  };

  // 댓글 삭제 처리
  async function handleDelete(id) {
    // 삭제 요청
    await deleteComment(id);

    // comments 업데이트
    const remainingComments = comments.filter(comment => comment.id !== id);

    setComments(remainingComments);
    
  };

  // 댓글 목록
  const commentList = comments.map(comment => (
    <Comment
    key={comment.id}
    id={comment.id}
    username={comment.user.username}
    avatarUrl={comment.user.avatarUrl}
    content={comment.content}
    displayDate={comment.displayDate}
    handleDelete={handleDelete}
    />
  ))

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">댓글</h3>
      
      {/* 댓글 폼 */}
      <Form handleAddComment={handleAddComment} />

      {/* 댓글 목록 */}
      {commentList.length > 0 ? (
        <ul>
          {commentList}
        </ul>
      ) : (
        <p className="text-center"> 댓글이 없습니다.</p>
      )}

      {/* 대기 상태 표시 - 더보기 기능과 관련 */}
      {!isLoaded && <Spinner />}

      {/* 에러 메시지 표시 */}
      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
};