import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { getFollowers, follow, unfollow } from "../../service/profile";
import ProfileItem from "./Profileitem";
import Spinner from "../Spinner";

export default function Followers() {
  // username 매개변수
  const {username} = useParams();
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
    try{
    // 팔로워 프로필 가져오기 요청
    const data = await getFollowers(username);

    // profile 업데이트
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
      
    } catch(error){
      alert(error);
    }
  }

  // 언팔로우 처리
  async function handleUnfollow(useraname) {
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
  const followerList = profiles.map(profile => (
    <ProfileItem
    key={profile.id}
    username={profile.username}
    name={profile.name}
    avatarUrl={profile.avatarUrl}
    isFollowing={profile.isFollowing}
    handleFollow={handleFollow}
    handleUnfollow={handleUnfollow}
  />
  ))

  return(
    <div className="px-2">
      <h3 className="text-lg my-4 font-semibold">{username}의 팔로워</h3>

      {followerList.length > 0 ? (
        <ul>
          {followerList}
        </ul>
      ) : (
        <p>팔로워가 없습니다</p>
      )}

      {/* 대기 상태 */}
      {!isLoaded && <Spinner />}

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
};