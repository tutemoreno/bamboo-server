import Post from '../models/post.js';

import path from 'path';

const __dirname = path.resolve();

export async function getImage(req, res) {
  const post = await Post.findById(req.params.id);

  res.sendFile(path.join(__dirname, 'uploads', post.fileName));
}

export async function getPosts(req, res) {
  const search = req.query.search || '',
    { perPage, page } = req.params;

  const posts = await Post.find({ description: { $regex: search } })
      .sort({
        createdAt: 'desc',
      })
      .limit(Number(perPage))
      .skip(perPage * page),
    count = await Post.count();

  let response = { posts: [], count };

  for (const post of posts) {
    const json = post.toJSON();

    json.liked = json.likes.some((objId) => {
      return objId.equals(req.AUTH.USER_ID);
    });
    json.likes = json.likes.length;

    response.posts.push(json);
  }

  res.send(response);
}

export async function like(req, res) {
  const post = await Post.findById(req.params.id);

  post.likes.push(req.AUTH.USER_ID);

  const postSaved = await post.save();

  const json = postSaved.toJSON();

  json.liked = true;
  json.likes = json.likes.length;

  res.send({ post: json });
}

export async function unlike(req, res) {
  const post = await Post.findById(req.params.id);

  const index = post.likes.indexOf(req.AUTH.USER_ID);

  post.likes.splice(index, 1);

  const postSaved = await post.save();

  const json = postSaved.toJSON();

  json.liked = false;
  json.likes = json.likes.length;

  res.send({ post: json });
}

/* export async function deletePost(req, res) {
  const post = await Post.findByIdAndDelete(req.params.id);

  try {
    fs.unlinkSync(path.join(__dirname, 'uploads', post.fileName));
  } catch (err) {
    console.error(err);
  } finally {
    res.json({ post });
  }
} */

/* export async function deleteAllPosts(req, res) {
  const posts = await Post.deleteMany({});

  for (const post of posts) {
    try {
      fs.unlinkSync(path.join(__dirname, 'uploads', post.file.path));
    } catch (err) {
      console.error(err);
    }
  }

  res.json({ posts });
} */

export async function createPost(req, res) {
  const tmpFile = req.files.file,
    { description, uuid } = req.body;

  const post = new Post({
    fileName: uuid,
    description,
    owner: req.AUTH.USER_ID,
  });

  try {
    const postSaved = await post.save();

    await tmpFile.mv(path.join('uploads', uuid));

    res.json({ post: postSaved });
  } catch (error) {
    res.json(error);
  }
}
