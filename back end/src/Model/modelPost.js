class modelPost {
  constructor(
    userId,
    pseudo,
    picture,
    comment,
    like,
    threadsComment,
    created_at,
    update_at
  ) {
    this.userId = userId;
    this.pseudo = pseudo;
    this.picture = picture;
    this.comment = comment;
    this.like = like;
    this.threadsComment = threadsComment;
    this.created_at = created_at;
    this.update_at = update_at;
  }
}

module.exports = { modelPost };
