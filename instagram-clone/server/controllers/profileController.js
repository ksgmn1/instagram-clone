// 모델
const Post = require("../models/Post");
const Following = require("../models/Following");
// 에러 처리 가능
const createError = require("http-errors");
const User = require("../models/User");

/*
    Profile Controller

    1 find - 프로필 여러개 찾기
    2 findOne - 프로필 한개 찾기
    3 follow - 팔로우 처리
    4 unfollow - 언팔로우 처리
*/

exports.find = async (req, res, next) => {
    try { 

        // 검색조건 저장
        const where = {};

        // 프로필 유저가 팔로잉하는 유저리스트 (검색조건)
        if("following" in req.query) {
            // req.query.following : 클라이언트가 요청한 프로필 유저
            const user = await User
            .findOne({ username : req.query.following});

            // 프로필 유저가 존재하지 않을 때
            if (!user){
                // 404 NotFound 처리
                throw new createError.NotFound("Profile is not found");
            }

            const followingUsers = await Following // ->Following 모델
            .find({ user: user._id })
            // Model.find(fields) : fields에 맞는 도큐먼트를 여러개 검색한다.

            // 특정 필드 추출
            const followingIds = followingUsers
            .map(followingUser => followingUser.following);

            // 검색 조건 추가
            where._id = followingIds;
        }

        // 프로필 유저의 팔로워 (검색 조건)
        if("followers" in req.query) {
            // req.query.followers : 팔로워를 알고싶은 프로필 유저
            const user = await User
            .findOne({ username: req.query.followers });

            // 프로필 유저가 존재하지 않을 때
            if (!user) {
                // 404 NotFound 처리
                throw new createError.NotFound("Profile is not found");
            }

            // Following 컬렉션 검색
            const followers = await Following
            .find({ following : user._id })

            // 필드 추출
            const followerIds = followers.map(follower => follower.user);

            // 검색 조건 추가
            where._id = followerIds;
        }

        // 특정 글자를 포함하는 유저 (검색 조건) - 프로필 검색
        if ("username" in req.query) {
            // req.query.username : 검색어
            const patt = new RegExp(req.query.username, "i");
            // RegExp(검색할 문자, 옵션) : 정규식

            // 검색 조건 추가
            where.username = patt;
        }

        // 실제 검색

        // 검색할 필드
        const profileFields = "username name avatar avatarUrl bio";

        // 검색
        const profiles = await User
        // 검색 조건 적용 (where)
        // 필드 조건 적용 (profileFields)
        .find(where, profileFields)
        // 로그인 유저가 프로필 유저를 팔로우하는지 여부
        .populate({ // 컬렉션 조인
            path : "isFollowing", // 필드값 , (User.js에 정의해놨음)
            match: { user: req.user._id } // req.user : 로그인 유저
        })

        // 검색 결과의 갯수
        const profileCount = await User.countDocuments(where);
        // Model.count(fields) : fields를 만족하는 도큐먼트의 갯수를 구한다.
        
        // 서버의 응답
        res.json({ profiles, profileCount });

    } catch (error) {
        next(error);
    }
};
exports.findOne = async (req, res, next) => {
    try {
        // 검색할 필드
        const profileFields = "username name avatar avatarUrl bio";

        // 검색
        const profile = await User
        // req.params.username : 프로필 상세보기를 요청할 유저
        // profileFields: 필드 조건
        .findOne({ username : req.params.username }, profileFields)
        .populate("postCount") // 댓글 갯수
        .populate("followerCount") // 팔로워 수
        .populate("followingCount") // 팔로잉 수
        .populate({ // 팔로우 여부
            path : "isFollowing",
            match : { user: req.user._id }
        })

        // 프로필 유저가 존재하지 않을 경우
        if (!profile) {
            // 404 NotFound
            throw new createError.NotFound("Profile is not found");
        }

        // 서버의 응답
        res.json({ profile });

    } catch (error) {
        next(error)
    }
};

exports.follow = async (req, res, next) => {
    try {
        // 검색할 필드
        const profileFields = "username name avatar avatarUrl bio";

        // 팔로우할 프로필 검색
        const profile = await User
        // req.params.username: 클라이언트가 전송한 username
        // profileFields : 필드 조건
        .findOne({ username : req.params.username }, profileFields)

        // 프로필이 존재하지 않는 경우
        if (!profile) {
            // 404 NotFound
            throw new createError.NotFound("Profile is not found");
        }    

        // 본인을 팔로우 요청한 경우
        if (req.user.username === req.params.username) {
            throw new createError.BadRequest("Cannot follow yourself");
        }
        
        // 이미 팔로우 중인 프로필인지 확인
        const isFollowing = await Following
        .findOne({ user: req.user._id, following : profile._id});

        // 팔로우 중이 아닌 경우 팔로우 처리
        if(!isFollowing) {
            // 팔로잉 도큐먼트 생성
            const following = new Following({
                user : req.user._id, // 로그인 유저
                following : profile._id // 프로필 유저
            })

            await following.save();
        }

        // 서버의 응답
        res.json({ profile });

    } catch (error){
        next(error);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        // 필드 조건
        const profileFields = "username name avatar avatarUrl bio";

        // 언팔로우 할 프로필 검색
        const profile = await User
        // req.params.username: 유저네임 매개변수
        .findOne({ username: req.params.username }, profileFields)

        // 존재하지 않는 프로필인 경우
        if (!profile) {
            throw new createError.NotFound("Profile is not found");
        }

        // 팔로우중인지 확인
        const isFollowing = await Following
        .findOne({ user: req.user._id, following: profile._id});

        // 팔로우중이 맞는 경우 언팔로우 처리
        if (isFollowing) {
            await isFollowing.deleteOne();
            // Document.deleteOne() : 한 개의 도큐먼트를 삭제한다.
        }

        // 서버의 응답
        res.json({ profile });

    } catch(error) {
        next(error)
    }
};