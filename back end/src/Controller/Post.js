const client = require("../Services/DbMongo");
const { pool } = require("../Services/DbMySql");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
const { modelPost } = require("../Model/modelPost");
const { modelThread } = require("../Model/modelThread");
const { extractToken } = require("../Utils/extractToken");
const fs = require("fs");
require("dotenv").config();

const addPost = async (req, res) => {
  console.log(req.file.filename);

  if (!req.file.filename) {
    res.status(400).json({ error: "Some fields are missing" });
  }

  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized1" });
      return;
    } else {
      try {
        let modelpost = new modelPost(
          data.id_user,
          data.pseudo,
          req.file.filename,
          req.comment,
          [],
          [],
          new Date(),
          new Date()
        );

        console.log(modelpost);

        let result = await client
          .db("socialGif")
          .collection("Post")
          .insertOne(modelpost);

        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(500).json(e.stack);
      }
    }
  });
};

const myAllPost = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized2" });
      return;
    } else {
      let post = await client
        .db("socialGif")
        .collection("Post")
        .find({ userId: data.id_user });
      let apiResponse = await post.toArray();

      res.status(200).json(apiResponse);
    }
  });
};

const allPost = async (req, res) => {
  try {
    let post = await client
      .db("socialGif")
      .collection("Post")
      .find()
      .sort({ created_at: -1 })
      .limit(4);
    let apiResponse = await post.toArray();

    res.status(200).json(apiResponse);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const bestPost = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized2" });
      return;
    } else {
      let post = await client
        .db("socialGif")
        .collection("Post")
        .find()
        .sort({ like: -1 })
        .limit(15);
      let apiResponse = await post.toArray();

      res.status(200).json(apiResponse);
    }
  });
};

const feedPost = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      console.log(err);
      res.status(401).json({ err: "Unauthorized20" });
      return;
    } else {
      try {
        const follower = data.id_user;

        const IdFollower = [follower];
        const follow = `SELECT * FROM follow WHERE id_follower = ? ;`;
        const [rowsFollow] = await pool.execute(follow, IdFollower);

        if (rowsFollow.length < 1) {
          res.status(401).json("not follow");
          return;
        }

        let array = [];
        rowsFollow.forEach((element) => {
          array.push({ userId: element.id_following });
        });

        // for (let i = 0; i < rowsFollow.length; i++) {
        //   const element = rowsFollow[i].id_following;
        //   array.push({ userId: element });
        // }
        console.log(array);

        const allFeedPost = await client
          .db("socialGif")
          .collection("Post")
          .find({ $or: array })
          .sort({ created_at: -1 })
          .limit(15);

        const resultPosts = await allFeedPost.toArray();

        console.log(resultPosts);

        res.status(200).json(resultPosts);
        return;
      } catch (err) {
        res.status(500).json(err.stack);
        return;
      }
    }
  });
};

const updatePost = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized6" });
      return;
    }

    let postId = new ObjectId(req.body._id);
    let userId = data.id_user;

    let post = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ _id: new ObjectId(postId) });

    let user = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ userId: userId });

    if (!post || !user) {
      res.status(401).json({ error: "Unauthorized7" });
      return;
    }

    if (post.userId !== data.id_user) {
      res.status(401).json({ error: "Unauthorized8" });
      return;
    }

    const comment = req.comment;

    let picture = "";

    if (req.file && req.file.filename) {
      picture = req.file.filename;
    }

    const annonceUpdate = {};

    if (!comment == "") {
      annonceUpdate.comment = comment;
    }
    if (!picture == "") {
      annonceUpdate.picture = picture;
    }

    try {
      await client
        .db("socialGif")
        .collection("Post")
        .updateOne({ _id: postId }, { $set: annonceUpdate });
      console.log(annonceUpdate);
      res.status(200).json({ msg: "update" });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
};

const postComment = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized1" });
      return;
    }

    const comment = req.comment;

    let postId = new ObjectId(req.body._id);
    console.log(postId);

    let userId = data.id_user;
    console.log(userId);

    let post = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ _id: new ObjectId(postId) });

    let user = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ userId: userId });

    if (!post || !user) {
      res.status(401).json({ error: "Unauthorized7" });
      return;
    }

    const sql = `SELECT * FROM user WHERE id_user = ?;`;
    const values = [userId];
    const [result] = await pool.execute(sql, values);

    console.log(post);
    console.log(user);

    let modelthread = new modelThread(
      result[0].picture,
      data.id_user,
      new ObjectId(),
      data.pseudo,
      comment,
      new Date()
    );

    try {
      await client
        .db("socialGif")
        .collection("Post")
        .updateOne({ _id: postId }, { $push: { threadsComment: modelthread } });
      res.status(200).json({ msg: "message posté" });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
};

const postDelete = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized3" });
      return;
    }

    let postId = new ObjectId(req.body._id);
    let userId = data.id_user;

    let post = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ _id: new ObjectId(postId) });

    let user = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ userId: userId });

    if (!post || !user) {
      res.status(401).json({ error: "Unauthorized7" });
      return;
    }

    if (post.userId !== data.id_user) {
      res.status(401).json({ error: "Unauthorized8" });
      return;
    }

    console.log(post.picture);

    var filePath = `src/Controller/uploads/${post.picture}`;
    fs.unlinkSync(filePath);

    try {
      let results = await client
        .db("socialGif")
        .collection("Post")
        .deleteOne({ _id: postId });

      res.status(200).json({ msg: "deleted" });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
};

const searchUserPost = async (req, res) => {
  try {
    const user = req.user;

    const sql = `SELECT * FROM user WHERE pseudo LIKE '%${user}%';`;
    const [rows] = await pool.execute(sql);

    const pseudo = rows[0].pseudo;

    let post = await client
      .db("socialGif")
      .collection("Post")
      .find({ pseudo: pseudo });
    let apiResponse = await post.toArray();

    res.status(200).json(apiResponse);
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const likePost = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized1" });
      return;
    }

    let postId = new ObjectId(req.body.id);
    console.log(postId);

    let userId = data.id_user;
    console.log(userId);

    let post = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ _id: new ObjectId(postId) });

    const insertId = [userId];
    const sql = `SELECT * FROM user WHERE id_user = ? ;`;
    const [rows] = await pool.execute(sql, insertId);

    if (!post || !rows[0]) {
      res.status(401).json({ error: "Unauthorized 10" });
      return;
    }

    try {
      const userLike = post.like.includes(userId);

      console.log(userLike);

      if (userLike) {
        await client
          .db("socialGif")
          .collection("Post")
          .updateOne({ _id: postId }, { $pull: { like: userId } });

        res.status(200).json({ msg: "deleted" });
      } else {
        await client
          .db("socialGif")
          .collection("Post")
          .updateOne({ _id: postId }, { $push: { like: userId } });
        res.status(200).json({ msg: "message like" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
};

const followUser = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized1" });
      return;
    }

    let postId = req.body.id;
    console.log(postId);

    let userId = data.id_user;
    console.log(userId);

    const IdFollower = [userId];
    const sqlFollower = `SELECT * FROM user WHERE id_user = ? ;`;
    const [rowsFollower] = await pool.execute(sqlFollower, IdFollower);

    const IdFollowing = [postId];
    const sqlFollowing = `SELECT * FROM user WHERE id_user = ? ;`;
    const [rowsFollowing] = await pool.execute(sqlFollowing, IdFollowing);

    if (!rowsFollowing[0] || !rowsFollower[0]) {
      res.status(401).json({ error: "Unauthorized 10" });
      return;
    }

    try {
      const follows = [userId, postId];
      const sql = `SELECT * FROM follow WHERE id_follower = ? AND id_following = ? ;`;
      const [follow] = await pool.execute(sql, follows);

      if (follow[0]) {
        const values = [userId, postId];
        const sql = `DELETE FROM follow WHERE id_follower = ? AND id_following = ? ;`;
        const [deleteFollow] = await pool.execute(sql, values);

        console.log("tutu");

        return res.status(200).json({ msg: "follow deleted" });
      } else {
        const addValues = [userId, postId];
        const sqlAddfollow =
          "INSERT INTO follow (id_follower, id_following) VALUES (?, ?);";
        const [addFollow] = await pool.execute(sqlAddfollow, addValues);
        return res.status(200).json({ msg: "follow add" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
};

const adminDeletePost = async (req, res) => {
  const token = await extractToken(req);

  jwt.verify(token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized3" });
      return;
    }

    let postId = new ObjectId(req.body._id);
    let userId = data.id_user;

    let post = await client
      .db("socialGif")
      .collection("Post")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      res.status(401).json({ error: "Unauthorized7" });
      return;
    }

    var filePath = `src/Controller/uploads/${post.picture}`;
    fs.unlinkSync(filePath);

    try {
      let results = await client
        .db("socialGif")
        .collection("Post")
        .deleteOne({ _id: postId });

      res.status(200).json({ msg: "deleted" });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  });
};

module.exports = {
  addPost,
  myAllPost,
  updatePost,
  postDelete,
  postComment,
  searchUserPost,
  likePost,
  bestPost,
  followUser,
  feedPost,
  allPost,
  adminDeletePost,
};
