// 모델
const User = require("../models/User");
const Following = require("../models/Following");
const Post = require("../models/Post");
const Likes = require("../models/Likes");
// 에러 처리
const createError = require("http-errors");


/*
    Post Controller

    1 feed - 피드
    2 find - 게시물 여러개 가져오기
    3 findOne - 게시물 한개 가져오기
    4 create - 게시물 생성
    5 deleteOne - 게시물 삭제
    6 like - 좋아요 처리
    7 unlike - 좋아요 취소 처리
*/

exports.feed = async (req, res, next) => {
    try {

        // 검색 조건 추가
        
        // 로그인 유저가 팔로잉하는 유저리스트
        const followingUsers = await Following.find({ user: req.user._id});
        // 필드 추출
        const followingIds = followingUsers
        .map(followingUser => followingUser.following);

        // 검색조건 - 팔로우하는 유저들, 로그인 유저 본인
        const where = { user: [...followingIds, req.user._id]}

        // limit, skip - 더보기, 페이지 기능 구현에 사용된다

        // 한번 데이터를 전송할 때 보낼 도큐먼트의 수
        const limit = req.query.limit || 5;
        // 전송할 때 건너뛸 도큐먼트의 수
        const skip = req.query.skip || 0;

        // 검색
        const posts = await Post.find(where)
        .populate({ // 게시물 작성자에 대한 정보
            path : "user", // 필드
            select : "username avatar avatarUrl" // User모델에서 추출할 필드
        })
        .populate("commentCount") // 댓글 갯수
        .populate({ // 게시물 좋아요 여부
            path: "liked", // 가상필드의 이름 (Post.js의 liked가상필드)
            match : {user: req.user._id} // 도큐먼트 검색 조건
        })
        .sort({ createdAt : "desc"}) // 도큐먼트 정렬 기준 (생성일 기준 내림차순)
        .skip(skip)
        .limit(limit)
        
        // 조건에 맞는 피드 게시물의 갯수
        const postCount = await Post.countDocuments(where);

        // 서버의 응답
        res.json({ posts, postCount});

    } catch(error) {
        next(error);
    }
}
exports.find = async (req, res, next) => {
    try {

        // 검색 조건
        const where = {};
       
        // 특정유저의 타임라인을 보는 경우 (검색 조건)
        if ("username" in req.query) {
            // req.query.username : 클라이언트가 전달한 username
            const user = await User.findOne({ username : req.query.username});

            // 유저가 존재하지 않을 때 404에러 처리
            if( !user ) {
                throw new createError.NotFound("User is not found");
            }

            // 검색 조건 추가
            where.user = user._id;
        }

        // 검색
        const posts = await Post
        .find(where)
        .populate("commentCount") // 댓글의 갯수
        .sort({ createAt: "desc" }) // 정렬 (생성일 기준 내림차순)

        // 결과 게시물의 갯수
        const postCount = await Post.countDocuments(where);

        // 서버연결
        res.json({ posts, postCount });

    } catch (error) {
        next(error);
    }
};

exports.findOne = async (req, res, next) => {
    try {

        // 검색

        // req.params.id : 클라이언트가 전송한 id
        const post = await Post.findById(req.params.id)
        //  Model.findById(id) : id로 도큐먼트 검색
        .populate({ // 게시물 작성자에 대한 정보
            path : "user",
            select : "username avatar avatarUrl" // 추출할 필드
        })
        .populate("commentCount") // 댓글 갯수
        .populate({ // 좋아요 여부
            path: "liked",
            match: {user: req.user._id}
        })

        // 존재하지 않는 게시물일 경우
        if (!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 서버의 응답
        res.json({ post });

    } catch (error) {
        next(error);
    }
};
exports.create = async (req, res, next) => {
    try {

        // 클라이언트가 업로드한 파일
        const files = req.files;

        // 파일을 전송하지 않는 경우
        if (!files || files.length < 1) {
            //400 에러 처리
            throw new createError.BadRequest("File is required");
        }

        // 게시물 생성처리

        // 파일데이터에서 이름 추출
        const photoNames = files.map(file => file.filename);

        // 모델의 인스턴스 생성
        const post = new Post({
            photos : photoNames,
            caption : req.body.caption,
            user: req.user._id
        });

        // 저장
        await post.save();

        // 서버의 응답
        res.json({ post });

    } catch (error) {
        next(error)
    }
};

exports.deleteOne = async (req, res, next) => {
    try {
        // 삭제할 게시물 검색
        // req.params.id : 클라이언트가 전송한 id
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않을 때
        if (!post) {
            // 404 에러 처리
            throw new createError.NotFound("Post is not found");
        }

        // 본인 게시물인지 확인
        const isMaster = req.user._id.toString() === post.user.toString();
        // ObjectId를 비교하기 위해서 문자열로 변환한다.

        // 본인 게시물이 아닌 경우
        if (!isMaster) {


            // 400 에러 처리
            throw new createError.BadRequest("Incorrect User");
        }

        // 삭제 처리
        await post.deleteOne();

        // 서버의 응답
        res.json({ post });

    } catch (error) {
        next(error);
    }
};
exports.like = async (req, res, next) => {
    try {
        // 좋아요 할 게시물 검색

        // req.params.id : 클라이언트가 전송한 id
        const post = await Post.findById(req.params.id)

        // 게시물이 존재하지 않는 경우
        if (!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 이미 좋아요한 게시물인지 확인
        const liked = await Likes
        .findOne({ user: req.user._id, post: post._id });

        // 좋아요한 게시물이 아닌 경우 좋아요 처리
        if (!liked) {
            // Likes 도큐먼트 생성
            const likes = new Likes({
                user: req.user._id,
                post: post._id
            })

            await likes.save();

            // 게시물의 좋아요 갯수를 1증가시킨다.
            post.likesCount++;
            await post.save();
        }

        // 서버의 응답
        res.json({ post });

    } catch (error) {
        next(error);
    }
};

exports.unlike = async (req, res, next) => {
    try {
        // 좋아요 취소할 게시물 검색
        
        // req.params.id : 게시물의 id
        const post = await Post.findById(req.params.id)

        // 게시물이 존재하지 않는 경우
        if (!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 좋아요 했던 게시물인지 확인
        const liked = await Likes
        .findOne({ user: req.user._id, post: post._id });

        // 좋아요 했던 게시물이 맞다면 취소 처리
        if (liked) {
            // 도큐먼트 삭제
            await liked.deleteOne();

            // 게시물의 좋아요 갯수를 1 감소시킨다.
            post.likesCount--;
            await post.save();
        }

        // 서버의 응답
        res.json({ post });


    } catch (error) {
        next(error);
    }
};