import axios from "axios";
import { getToken } from "./util";

// Axios 인스턴스 설정
const instance = axios.create({
  // 백엔드 배포 주소
  baseURL: "http://54.180.157.2:8000"
});

//interceptor를 통한 header 설정
instance.interceptors.request.use(async (config) => {
  config.headers["content-type"] = "application/json; charset=utf-8";
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  config.headers["Accept"] = "*/*";

  //getToken는 로컬 스토리지에 토큰이 있다면 반환한다 없다면 null 값 반환
  config.headers["authorization"] = await getToken();
  return config;
});

export const userApi = {
  // 회원 가입
  signup: (user) => instance.post("/api/v1/users/signup", user),

  // 이메일 중복 확인
  checkemail: (user) => instance.post("/api/v1/users/checkemail", user),

  // 닉네임 중복 확인
  checknick: (user) => instance.post("/api/v1/users/checknick", user),

  // 로그인
  login: (user) => instance.post("/api/v1/users/login", user),

  // 로그인 유지
  loginCheck: (user) => instance.get("/api/v1/users/logincheck", user),

  // 로그아웃
  logout: (user) => instance.post("/api/v1/users/logout", user)
};

export const eventPostApi = {
  //이벤트 게시판 전체 불러오기
  getEventPostList : data => instance.get("/api/v1/post/", data),
        
  //이벤트 게시물 추가하기
  addEventPost : data => instance.post("/api/v1/post", data),

  //이벤트 게시물 불러오기
  getEventPost: postId => instance.get(`/api/v1/post/${postId}`),

  //이벤트 게시물 수정하기
  editEventPost : post => instance.patch(`/api/v1/post/postupdate/${post.postId}`, post), 

  //이벤트 게시물 삭제하기 
  deleteEventPost: postId => instance.patch(`/api/v1/post/postdelete/${postId}`),

  likeEventPost : postId => instance.patch(`/api/v1/like/${postId}`),

  };


export const combinationPostApi = {
  // 꿀조합 게시글 작성하기
  postCombinationPost: (post) => instance.post("/api/v1/post", post),

  // 꿀조합 게시글 수정하기
  patchCombinationPost: (post) => instance.patch(`/api/v1/post/postupdate/${post.postId}`, post),

  // 꿀조합 게시글 삭제하기
  deleteCombinationPost: (postid) => instance.patch(`/api/v1/post/postdelete/${postid}`),

  // 꿀조합 게시글 불러오기
  getCombinationList: () => instance.get("/api/v1/post"),

  // 꿀조합 상세포스트 불러오기
  getCombinationPost: (postid) => instance.get(`/api/v1/post/${postid}`)
};

export const uploadApi = {
  imageUpload: async function (imgObj) {
    try {
      const req = { postImg: imgObj };
      let formData = new FormData();
      for (let entry of Object.entries(req)) {
        formData.append(entry[0], entry[1]);
      }
      const response = await axios.post("http://54.180.157.2:8000/api/v1/post/uploadimg", formData);
      if (response.statusText === "OK") return response;
    } catch (err) {
      alert(err);
    }
  }
};

export const searchApi = {
  searchTag: (tagList) => instance.get("/api/v1/condition", tagList)
};
