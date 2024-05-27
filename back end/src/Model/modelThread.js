class modelThread {
  constructor(
    userPics,
    userId,
    commentId,
    pseudo,
    threadsPost,
    created_at,
    update_at
  ) {
    this.userPics = userPics;
    this.userId = userId;
    this.commentId = commentId;
    this.pseudo = pseudo;
    this.threadsPost = threadsPost;
    this.created_at = created_at;
  }
}

module.exports = { modelThread };
