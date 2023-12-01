import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// 렌더링 처리
import PostTemplate from "./post-template/PostTemplate";
// 서버 요청 처리
import { getFeed, deletePost, likePost, unlikePost } from "../service/post";
import Spinner from "./Spinner";
import AuthContext from "./auth/AuthContext";

export default function Feed() {
  // 로그인 유저
  const { user } = useContext(AuthContext)
  const [error, setError] = useState(null);
  const [isLoaded, setIsloaded] = useState(false);
  // 피드 게시물
  const [posts, setPosts] = useState([]);
  // 피드 게시물의 총 갯수 - 더보기 기능
  const [postCount, setPostCount] = useState(0);
  // skip, limit - 더보기 기능
  const [skip, setSkip] = useState(0);
  const limit = 5;

  // 키 스테이트 추적
  console.log(posts);

  // 피드 가져오기 요청

  useEffect(() => {
    fetchData();
  }, [skip]); // skip이 업데이트 될 때 다시 피드 가져오기 요청

  async function fetchData() {
    try{
      // 에러 및 대기상태 초기화
      setError(null);
      setIsloaded(false);

      // 서버 요청
      const data = await getFeed(limit, skip);

      // posts 업데이트
      const updatedPosts = [...posts, ...data.posts];

      setPosts(updatedPosts);

      // postCount 업데이트
      setPostCount(data.postCount);

    } catch(error) {
      setError(error);
    } finally {
      setIsloaded(true)
    }
  };

  // 좋아요 처리
  async function handleLike(id) {
    try {
      // 좋아요 요청
      await likePost(id);
      
      // posts 업데이트
      const updatedPosts = posts.map(post => {
        if(post.id === id) {
          return {
            ...post,
            liked : true,
            likesCount : post.likesCount + 1
          }
        }
        return post;
      })

      setPosts(updatedPosts);

    } catch(error) {
      alert(error);
    }
  }

  // 좋아요 취소 처리
  async function handleUnlike(id) {
    try {
      // 좋아요 취소 요청
      await unlikePost(id)

      // post 업데이트
      const updatedPosts = posts.map(post => {
        if(post.id === id) {
          return {
            ...post,
            liked : false,
            likesCount : post.likesCount - 1
          }
        }
        return post;
      })

      setPosts(updatedPosts);

    } catch(error){
      alert(error);
    }
  };

  // 게시물 삭제 처리
  async function handleDelete(id) {
    try {
      await deletePost(id);

      const remainingPosts = posts.filter(post => {
        if(id !== post.id) {
          return post;
        }
      });

      setPosts(remainingPosts);

    } catch(error) {
      alert(error)
    }
  };

  // 피드 리스트
  const postList = posts.map(post => (
    <PostTemplate
      key={post.id}
      id={post.id}
      username={post.user.username}
      avatarUrl={post.user.avatarUrl}
      photoUrls={post.photoUrls}
      caption={post.caption}
      liked={post.liked}
      likesCount={post.likesCount}
      commentCount={post.commentCount}
      displayDate={post.displayDate}
      handleLike={handleLike}
      handleUnlike={handleUnlike}
      handleDelete={handleDelete}
      isMaster={user.username === post.user.username}
    />
  ))

  // 더 가져올 게시물이 있는지 확인
  // postCount : db에 있는 총 피드 게시물의 갯수
  // posts.length : 클라이언트측에서 가지고 있는 게시물의 갯수
  const doseMoreExists = postCount > posts.length;

  // 더보기 버튼
  const showMoreBtn = (
    <div className="flex justify-center my-2">
      <button
      className="p-1 text-blue-500 font-semibold"
      onClick={() => setSkip(skip + limit)}
      >
        더보기
      </button>
    </div>
  )
  
  return(
    <>
      {postList.length > 0 ? (
        <ul>
          {postList}
        </ul>
      ) : (
        <div className="p-8 text-center">
          <Link
          to="/explore"
          className="text-blue-500"
          >
            인스타그램 탐색하기
          </Link>
        </div>
      )
    }

    {/* 더 가져올 게시물이 있을 때 더보기 버튼 렌더링 */}
    {doseMoreExists && showMoreBtn}

    {/* 대기상태 표시 */}
    {!isLoaded && <Spinner />}

    {/* 에러 메시지 */}
    {error && <p className="text-red-500">{error.message}</p>}

    </>
  )
};