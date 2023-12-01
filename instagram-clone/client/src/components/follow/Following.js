import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// 서버 요청 처리
import { getFollowingUsers, follow, unfollow } from "../../service/profile";
// 각 프로필 렌더링 처리
import ProfileItem from "./Profileitem";
// 대기 상태
import Spinner from "../Spinner";

export default function Following() {
  // 매개변수
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // 프로필 저장
  const [profiles, setProfiles] = useState([]);

  // 키 스테이트 추적
  console.log(profiles);

  // 프로필 가져오기 요청
  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    try {
      // 팔로잉 프로필 가져오기 요청
      const data = await getFollowingUsers(username);

      // profiles 업데이트
      setProfiles([...profiles, ...data.profiles]);

    } catch(error) {
      setError(error);
    } finally {
      setIsLoaded(true);
    }
  };

  // 팔로우 처리
  async function handleFollow(username) {
    try {
      // 팔로우 요청
      await follow(username)

      // profiles 업데이트
      const updatedProfiles = profiles.map(profile => {
        if(profile.username === username) {
          return { ...profile, isFollowing : true}
        }

        return profile;
      })

      setProfiles(updatedProfiles);

    } catch (error) {
      alert(error);
  }
}
  
  // 언팔로우 처리
  async function handleUnfollow(username) {
    try {
      // 언팔로우 요청
      await unfollow(username)

      // profiles 업데이트
      const updatedProfiles = profiles.map(profile => {
        if(profile.username === username) {
          return {...profile, isFollowing : false}
        }
        
        return profile;
      })

      setProfiles(updatedProfiles);

    } catch (error) {
      alert(error);
    }
  };

  // 프로필 리스트
  const followingList = profiles.map(profile => (
    <ProfileItem
      key={profile.id}
      username={profile.username}
      name={profile.name}
      avatarUrl={profile.avatarUrl}
      isFollowing={profile.isFollowing}
      handleFollow={handleFollow}
      handleUnfollow={handleUnfollow}
    />
  )
)

return (
  <div className="px-2">
    <h3 className="text-lg my-4 font-semibold">{username}의 팔로잉</h3>

    {/* 프로필 리스트 */}
    {followingList.length > 0 ? (
      <ul>
        {followingList}
      </ul>
    ) : (
      <p>0 following</p>
    )}

    {/* 대기상태 표시 */}
    {!isLoaded && <Spinner />}

    {/* 에러 메시지 */}
    {error && (
      <p className="text-red-500">{error.message}</p>
    )}
  </div>
)
};
