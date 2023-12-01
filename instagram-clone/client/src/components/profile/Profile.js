import { useState, useEffect, useContext, useReducer, useInsertionEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
// 프로필 정보
import ProfileInfo from "./ProfileInfo";
// 타임라인의 썸네일
import PostItem from "./PostItem";
// 게시물 업로드 모달
import PostForm from "../PostForm";
// 서버 요청 함수들
import { getProfile, getTimeline, follow, unfollow } from "../../service/profile";
// 대기상태 표시
import Spinner from "../Spinner";

export default function Profile() {
  // username 파라미터
  const { username } = useParams();
  // value 객체
  const { user, setUser } = useContext(AuthContext);
  // 프로필 데이터
  const [profile, setProfile] = useState(null);
  // 타임라인 데이터
  const [posts, setPosts] = useState([]);
  // 모달창 관리
  const [modalOpen, setModalOpen] = useState(false);
  // 페이지 이동
  const navigate = useNavigate();

  // 키 스테이트 추적
  console.log(profile, posts);

  // 프로필 페이지에 필요한 데이터 요청
  useEffect(() => {
    fetchData()
  }, [username]); // username deps : 다른 프로필 페이지로 이동할 때

    async function fetchData() {
    try{
      // 프로필 초기화
      setProfile(null)

      // 프로필 정보
      const profileData = await getProfile(username);
      // 타임라인
      const timelineData = await getTimeline(username);

      // 응답객체로 업데이트
      setProfile(profileData.profile)
      setPosts(timelineData.posts);

    }catch { // 프로필 가져오기에 실패했을 때 404페이지로 이동
      navigate("/notfound", { replace : true});
    }
  }

  // 팔로우 처리
  async function handleFollow() {
    try {
      // 팔로우 요청
      await follow(username)

      // profile 업데이트
      setProfile({...profile, isFollowing: true});

    } catch(error) {
      alert(error);
    }
  };

  // 언팔로우 처리
  async function handleUnfollow() {
    try {
      // 언팔로우 요청
      await unfollow(username)

      // profile 업데이트
      setProfile({...profile, isFollowing : false});

    } catch (error) {
      alert(error);
    }
  };

  // 로그아웃 처리
  async function handleSignout() {
    // confirm: 사용자가 "예" 하면 true, "아니오"하면 false를 리턴한다
    const confirmed = window.confirm("로그아웃 하시겠습니까?");

    if (confirmed) {
      setUser(null);
    }
  };

  // 제목 업데이트
  useEffect(() => {
    document.title = `${username} - Instagram`;
  }, []);

  // 타임라인
  const timeline = posts.map(post => (
    <PostItem
    key={post.id}
    id={post.id}
    thumbnailUrl={post.photoUrls[0]}
    likesCount={post.likesCount}
    commentCount={post.commentCount}
    />
  ))

  // 게시물 업로드 모달
  const modal = (
    <div
    className="fixed inset-0 bg-black/[0.2] z-10"
    onClick={(e) => {
      // 리액트에서 모달 닫는 방법
      // e.currentTarget = 오버레이
      if (e.target === e.currentTarget) {
        // 오버레이를 닫는다.
        setModalOpen(false)
      }
    }}
    >
      {/* 업로드 폼 */}
      <PostForm/>
    </div>
  )

  // 프로필 가져오는 중
  if (!profile) {
    return <Spinner />
  }

  return (
    <>
      {/* 프로필 정보 */}
      <ProfileInfo
      username = {profile.username}
      name = {profile.name}
      avatarUrl = {profile.avatarUrl}
      bio = {profile.bio}
      postCount={profile.postCount}
      followerCount={profile.followerCount}
      followingCount={profile.followingCount}
      isFollowing={profile.isFollowing}
      handleSignOut={handleSignout}
      handleFollow={handleFollow}
      handleUnfollow={handleUnfollow}
      isMaster={user.username === username}
      />

      <div className="border-t my-4"></div>

      {/* 타임라인 */}
      {timeline.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 mb-2">
          {timeline}
        </ul>
      ) : (
        <p className=" text-center">{profile.username} 게시물이 없습니다</p>
      )}
      {/* 모달 버튼 */}
      <svg
      className="opacity-40 w-12 fixed right-8 bottom-8 hover:opacity-80 cursor-pointer z-10"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      onClick={() => setModalOpen(true)}
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
    </svg>

    {/* Create form */}
    {modalOpen && modal}
  </>
)
}