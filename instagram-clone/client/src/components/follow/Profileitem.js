import { useContext } from "react";
import { Link } from "react-router-dom"
import AuthContext from "../auth/AuthContext";

export default function Profileitem({
  username,
  avatarUrl,
  name,
  isFollowing,
  handleFollow,
  handleUnfollow
}) {

  // 로그인 유저 데이터
  const {user} = useContext(AuthContext);
  // 본인 확인
  const isMaster = username === user.username;

  // 팔로우, 언팔로우 버튼
  const followButton = (
    <button
    className="bg-blue-500 text-white text-sm px-4 py-2 font-semibold p-2
    rounded-lg"
    onClick={() => handleFollow(username)}
    >
      팔로우
    </button>
  )

  const unfollowButton = (
    <button
    className="bg-gray-200 text-sm px-4 py-2 font-semibold p-2 rounded-lg"
    onClick={() => handleUnfollow(username)}
    >
      팔로잉
    </button>
  )

  return(
    <li className="flex justify-between items-center mb-2">
      <Link
      to={`/profiles/${username}`}
    className="inline-flex items-center"
  >
    <img src={avatarUrl}
    className="w-12 h-12 object-cover rounded-full border"
    />
    <div className="ml-2">
      <h3 className="block font-semibold">
        {username}
      </h3>
      <span className="block text-gray-400 text-sm">
        {name}
      </span>
    </div>
  </Link>

   {/* 본인 프로필이 아닌 경우에만 팔로우/언팔로우 버튼 렌더링 */} 
  {!isMaster && (
    isFollowing ? unfollowButton : followButton
  )}
    </li>
  )
  };