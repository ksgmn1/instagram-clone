import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getProfiles } from "../service/profile";
import Spinner from "./Spinner";

export default function Explore() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  // 검색결과 저장
  const [profiles, setProfiles] = useState([]);
  // input에 오토포커스 기능
  const inputRef = useRef(null);

  // 키 스테이트 추적
  console.log(profiles);

  // 오토포커스
  useEffect(() => {
    inputRef.current.focus();
  }, [])

  // 검색기능을 처리하는 함수
  async function search(username){
    try {
      // 검색어가 없을 때 검색결과 초기화
      if (!username) {
        return setProfiles([]);
      }

      // 에러, 대기상태 초기화
      setError(null);
      setIsLoaded(false);

      // 프로필 가져오기 요청
      const { profiles } = await getProfiles(username);

      // profiles 업데이트
      setProfiles(profiles);

    } catch(error){
      setError(error);
    } finally{
      setIsLoaded(true);
    }
  };

  // 프로필 리스트
  const profileList = profiles.map(profile => (
    <li className="flex items-center justify-between my-2">
      <Link
      to={`/profiles/${profile.username}`}
      className="flex items-center"
      >
        <img
        src={profile.avatarUrl}
        className="w-10 h-10 object-cover rounded-full"
        />
        <div className="ml-2">
          <h3 className="block font-semibold">
            {profile.username}
          </h3>
          <span className="block text-gray-400 text-sm">
            {profile.name}
          </span>
        </div>
      </Link>

      {profile.isFollowing && (
        <div className="ml-2 text-sm text-blue-500 font-semibold">
          팔로잉
        </div>
      )}
    </li>
  ))

  return (
    <div className="px-4">
      <h3 className="text-lg font-semibold my-4">검색</h3>

      {/* 검색 창 */}
      <div className="mb-4">
        <input
        type="text"
        className="border px-2 py-1 rounded w-full outline-none"
        onChange={({ target }) => search(target.value)}
        placeholder="프로필 검색"
        ref={inputRef}
        />
      </div>

      {/* 검색 결과 */}
      {isLoaded ? (
        <ul>
          {profileList}
        </ul>
      ) : (
        <Spinner />
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500">{error.message}</p>
      )}
    </div>
  )
};