import { server, getBearerToken } from "./header";

/*
  post

    1 getFeed - 피드 가져오기 요청
    2 getPost - 게시물 상세보기 요청
    3 createPost - 게시물 생성 요청
    4 deletePost - 게시물 삭제 요청
    5 likePost - 게시물 좋아요 요청
    6 unlikePost - 게시물 좋아요 취소 요청
*/

export async function getFeed(limit, skip) {
  // limit, skip - 더보기 기능 구현
  // 요청 쿼리 - limit, skip
  const res = await fetch(`${server}/posts/feed?limit=${limit}&skip=${skip}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function getPost(id) {
  const res = await fetch(`${server}/posts/${id}`, {
    headers: { 
      "Authorization": getBearerToken() 
    }
  });

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function createPost(formData) {
  const res = await fetch(`${server}/posts`, {
    method: "POST",
    headers: { 
      "Authorization": getBearerToken() 
    },
    body: formData // 파일
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function deletePost(id) {
  // id 매개변수 (게시물의 id)
  const res = await fetch(`${server}/posts/${id}`, {
    method: "DELETE",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function likePost(id) {
  const res = await fetch(`${server}/posts/${id}/like`, {
    method: "POST",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};

export async function unlikePost(id) {
  const res = await fetch(`${server}/posts/${id}/unlike`, {
    method: "DELETE",
    headers: { 
      "Authorization": getBearerToken() 
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText + "Error");
  }

  return await res.json();
};