// 데이터베이스 연결
const mongoose = require("mongoose");
// 모델
const User = require("./models/User");
const Post = require("./models/Post");
// seed 파일 호출시 개발자가 전달한 인자
const userArgs = process.argv.slice(2);
const [directive, MONGODB_URI] = userArgs;

// 올바른 몽고DB 주소가 아닌 경우
if (!MONGODB_URI.startsWith("mongodb")) {
  console.log("ERROR: You need to specify a valid mongodb URL.");
  return;
}

// 개발자의 명령어 확인
if (directive === "run") { // 씨드데이터 생성 명령어
  seedDatabase();
} else if (directive === "revert") { // 씨드데이터 초기화 명령어
  dropDatabase()
} else { // 잘못된 명령어 
  return console.log("ERROR: Invalid command");
}


// 씨드데이터 생성 함수
async function seedDatabase() {
  try {

    //  데이터베이스 연결
    await mongoose.connect(MONGODB_URI);
  
    // 생성할 유저 목록
    const users = [
    {
      username : "michelangelo",
      name : "Michelangelo",
      avatar: "michelangelo.jpg",
      bio : "나는 대리석 안에서 천사를 보았고 그를 자유롭게 해줄 때까지 조각했다."
    },
    {
      username : "jobs",
      name : "Steve jobs",
      avatar: "jobs.jpeg",
      bio : "이야 아이폰 많이 좋아졌다."
    },
    {
      username : "dog",
      name : "Mr.Loyal",
      avatar: "dog.jpeg",
      bio : "멍"
    },
    ]

    // 유저 생성
    for (let i=0; i < User.length; i++) {
      // 모델의 인스턴스 생성
      const user = new User();

      // 필드값 정의
      user.username = users[i].username;
      user.name = users[i].name;
      user.avatar = users[i].avatar;
      user.bio = users[i].bio;

      // 도큐먼트 저장
      await user.save();

      console.log(user);
    }

    // 생성할 게시물 목록
    const posts = [
      {
        photos : ["david.jpg"],
        caption : "David, Galleria dell`accademia, Florence"
      },
      {
        photos : ["pieta_1.jpg", "pieta_2.jpg"],
        caption : "Pieta, St. Peter's Basilica, Rome"
      },
      {
        photos : ["bacchus.jpg"],
        caption : "Bacchus, Museo Nazionale del Bargello, Florence"
      },
      {
        photos : ["angel.jpg"],
        caption : "Angel, Basilica of San Domenico, Bologna"
      },
    ]

    // 미켈란젤로
    const user = await User.findOne({ username: "michelangelo" });

    // 게시물 생성
    for (let i=0; i < posts.length; i++) {
      // 모델의 인스턴스 생성
      const post = new Post();
      
      // 필드값 정의
      post.photos = posts[i].photos
      post.caption = posts[i].caption
      post.user = user._id; // 미켈란젤로의 게시물

      // 도큐먼트 저장
      await post.save();

      console.log(post);
    }

    // 성공 메시지
    console.log("seed database has completed");

  } catch (error) { // 에러 처리
    console.error(error);
  } finally {
    // DB 연결 종료
    mongoose.connection.close();
  }
};

// 씨드데이터 초기화 함수
async function dropDatabase() {
  try {
    // DB 연결
    await mongoose.connect(MONGODB_URI);
    // DB 삭제
    await mongoose.connection.dropDatabase();
    // 초기화 성공 메시지
    console.log("drop database has been completed");

  } catch (error) {
    // 에러처리
    console.log(error);
  } finally {
    // DB 연결 종료
    mongoose.connection.close();
  }
};

