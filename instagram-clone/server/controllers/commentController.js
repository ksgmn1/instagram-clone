const Post = require("../models/Post");
const Comment = require("../models/Comment");
const createError = require("http-errors");

/*
    Comment Controller

    1 find - 댓글 가져오기
    2 create - 댓글 생성
    3 deleteOne - 댓글 삭제
*/

exports.find = async (req, res, next) => {
    try {
        // 댓글을 달 게시물 검색

        // req.params.id : 게시물의 id
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않는 경우
        if(!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 댓글의 검색 조건
        const where = {post: post._id};

        // 검색
        const comments = await Comment
        .find(where)
        .populate({ // 댓글 작성자에 대한 정보
            path : "user",
            select: "username avatar avatarUrl" // 추출할 필드
        })
        .sort({ createdAt : "desc"}) // 분류 (생성일 기준 내림차순)

        // 댓글의 갯수
        const commentCount = await Comment.countDocuments(where);

        // 서버의 응답
        res.json({comments, commentCount});

    } catch(error){
        next(error);
    }
};
exports.create = async (req, res, next) => {
    try {
        // 댓글을 달 게시물 검색
        const post = await Post.findById(req.params.id);

        // 게시물이 존재하지 않는 경우
        if(!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 댓글 생성
        const comment = new Comment({
            content: req.body.content,
            post : post._id,
            user : req.user._id
        })

        await comment.save();

        // 댓글 생성 후 컬렉션 조인
        await comment.populate({
            path : "user",
            select: "username avatar avatarUrl"
    })

    // 서버의 응답
    res.json({ comment });
 
    } catch (error) {
        next(error);
    }
};

exports.deleteOne = async (req, res, next) => {
    try{
        // 삭제할 댓글 검색

        // req.params.id : 댓글의 id
        const comment = await Comment.findById(req.params.id);

        // 댓글이 존재하지 않는 경우
        if (!comment) {
            throw new createError.NotFound("Comment is not found");
        }

        // 본인 댓글인지 확인
        const isMaster = req.user._id.toString() === comment.user.toString();

        // 본인댓글이 아닌 경우 400 에러 처리
        if (!isMaster) {
            throw new createError.BadRequest("Incorrect user");
        }

        // 댓글 삭제처리
        await comment.deleteOne();

        // 서버의 응답
        res.json({ comment });


    } catch (error) {
        next(error);
    }
};