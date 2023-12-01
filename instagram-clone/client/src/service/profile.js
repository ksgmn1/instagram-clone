import { server, getBearerToken } from "./header";

/*
  profile

    1 getProfiles - 프로필 여러개 가져오기 요청
    2 getProfile - 프로필 상세보기 요청
    3 getTimeline - 타임라인 가져오기 요청
    4 getFollowers - 팔로워 리스트 요청
    5 getFollowingUsers - 팔로잉 리스트 요청
    6 follow - 팔로우 요청
    7 unfollow - 언팔로우 요청
*/

export async function getProfiles(username) {
  // 프로필 검색
  const res = await fetch(`${server}/profiles/?username=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function getProfile(username) {
  // username 매개변수
  const res = await fetch(`${server}/profiles/${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function getTimeline(username) {
  // 특정 유저의 게시물보기
  const res = await fetch(`${server}/posts/?username=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function getFollowers(username) {
  const res = await fetch(`${server}/profiles/?followers=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function getFollowingUsers(username) {
  const res = await fetch(`${server}/profiles/?following=${username}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function follow(username) {
  const res = await fetch(`${server}/profiles/${username}/follow`, {
    method: "POST",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}

export async function unfollow(username) {
  const res = await fetch(`${server}/profiles/${username}/unfollow`, {
    method: "DELETE",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
}