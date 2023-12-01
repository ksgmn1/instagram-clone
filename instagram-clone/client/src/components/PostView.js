import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 게시물 상세보기의 렌더링 처리
import PostTemplate from "./post-template/PostTemplate";
// 서버 요청 함수
import { getPost, deletePost, likePost, unlikePost } from "../service/post";
// 대기 상태 표시
import Spinner from "./Spinner";
import AuthContext from "./auth/AuthContext";

export default function PostView() {
  // URL로 전달된 게시물의 id
  const { id } = useParams();
  // 게시물 저장
  const [post, setPost] = useState(null);
  // 페이지 이동
  const navigate = useNavigate();
  // 유저 데이터
  const { user } = useContext(AuthContext);

  // 키 스테이트 확인
  console.log(post);

  // 상세보기 페이지에 필요한 데이터 요청
  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData(){
    try {
      // 게시물 가져오기 요청
      const data = await getPost(id);

      // post 업데이트
      setPost(data.post);

    } catch (error) {
      // 가져오기에 실패했을 때 404페이지로 이동시킨다.
      navigate("/notfound", {replace : true});
      // navigate(URL, opts)
      // replace : true - 현재 페이지를 대체한다.
    }
  }

  // 좋아요 처리
  async function handleLike(id) {
    try {
      await likePost(id)

      // post 업데이트
      const updatedPost = {
        ...post,
        liked : true, // 좋아요 여부
        likesCount : post.likesCount + 1 // 좋아요 갯수
      }

      setPost(updatedPost);

    } catch(error) {
      alert(error);
    }
  };

  // 좋아요 취소 처리
  async function handleUnlike(id) {
    try {
      await unlikePost(id);

      const updatedPost = {
        ...post,
        liked: false,
        likesCount: post.likesCount - 1
      }

      setPost(updatedPost);

    } catch(error) {
      alert(error);
    }
  };

  // 게시물 삭제 처리
  async function handleDelete(id) {
    try {
      // 게시물 삭제 요청
      await deletePost(id);

      // 피드페이지로 대체
      navigate("/", {replace : true});
      
    } catch(error) {
      alert(error);
    }
  };
  
  // 게시물을 가져오는 중
  if (!post) {
    return <Spinner />
  }

  // 렌더링
  return(
    <PostTemplate
    id={post.id}
    username={post.user.username}
    avatarUrl ={post.user.avatarUrl}
    photoUrls={post.photoUrls}
    caption={post.caption}
    likesCount={post.likesCount}
    commentCount={post.commentCount}
    displayDate={post.displayDate}
    liked={post.liked}
    handleLike={handleLike}
    handleUnlike={handleUnlike}
    handleDelete={handleDelete}
    isMaster={user.username === post.user.username}
    />
  )
  
};