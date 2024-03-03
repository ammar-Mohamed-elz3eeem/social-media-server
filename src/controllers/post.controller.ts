import { Request, Response } from "express";
import { unlink } from "fs/promises";
import path from "path";

import uploader from "@/config/uploader";
import Likes from "@/models/like.model";
import Media from "@/models/media.model";
import Post from "@/models/post.model";
import Saves from "@/models/save.model";
import { TComment, TPost, UserReq } from "@/types";
import imageUpload from "@/utils/uploader";
import Comment from "@/models/comment.model";

export const addPost = async (req: UserReq, res: Response) => {
  const { created_by, content }: TPost = req.body;
  const images = req.files as Array<Express.Multer.File>;

  if (!content) {
    return res.status(400).json({ message: 'post content is required' });
  }
  if (req.user != created_by) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const postAdded = await Post.addPost({content, created_by});
    if (!postAdded) {
      return res.status(500).json({ message: "post can't be added" });
    }
    if (images) {
      images.forEach(async (image) => {
        const imageSrc = await imageUpload(image, uploader.uploads_path, true);
        await Media.addMedia(imageSrc!, parseInt(postAdded.id!));
      });
    }
    return res.status(201).json({ message: 'Post Created', ...postAdded });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const editPost = async (req: UserReq, res: Response) => {
  const { created_by, content }: TPost = req.body;
  const { id } = req.params;
  const images = req.files as Array<Express.Multer.File>;

  const post = await Post.findOneById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.content === content && (!images || images.length)) {
    return res.status(209).json({ message: 'No changes to post' });
  }

  try {
    const result = await Post.editPost({ content, }, { where: { id } });
    if (images) {
      for (let image of images) {        
        const imageSrc = await imageUpload(image, uploader.uploads_path, true);
        await Media.addMedia(imageSrc!, parseInt(id));
      }
    }
    return res.status(200).json(result);
  } catch (error: any) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const postImages = await Media.getPostMedia(id);
    postImages.forEach(async (image) => {
      await unlink(path.join(uploader.uploads_path, image));
    });
    const postsDeleted = await Post.deletePost(id);
    return res.status(200).json({ message: 'Post Deleted Successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export const getPost = async (req: UserReq, res: Response) => {
  const { id } = req.params;
  try {
    let post: TPost & {isLiked?: boolean, isSaved?: boolean, comments?: TComment[]} = await Post.findOneById(id);
    if (!post) {
      return res.status(404).json({message: 'post not found'});
    }
    console.log("req.user", req.user);
    if (req.user) {
      post = { 
        ...post,
        isLiked: await Likes.likedPost(post?.id!, req.user!),
        total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
        isSaved: await Saves.savedPost(post?.id!, req.user!),
        comments: await Comment.findMany({ where: { post_id: post?.id! } })
      };
    } else {
      post = { 
        ...post,
        total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
        comments: await Comment.findMany({ where: { post_id: post?.id! } })
      };
    }

    const images = await Media.getPostMedia(post?.id!);
    if (images && images.length) {
      post = { ...post, images: images.map(image => `http://localhost:${process.env.PORT}/images/${image.src}`) };
    }

    return res.status(200).json({ ...post });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export const getPosts = async (req: UserReq, res: Response) => {
  try {
    let posts = await Post.getSitePosts();

    // if (req.user) {
    //   posts = await Promise.all(posts.map(async (post) => ({ 
    //     ...post,
    //     comments: await Comment.findMany({ where: { post_id: post?.id! } }),
    //     total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
    //     isLiked: await Likes.likedPost(post?.id!, req.user!),
    //     isSaved: await Saves.savedPost(post?.id!, req.user!)
    //   })));
    // } else {
    //   posts = await Promise.all(posts.map(async (post) => ({ 
    //     ...post,
    //     comments: await Comment.findMany({ where: { post_id: post?.id! } }),
    //     total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
    //   })));
    // }



    posts = await Promise.all(posts.map(async (post) => {
      const images = await Media.getPostMedia(post?.id!);
      if (req.user) {
        return {
          ...post,
          comments: await Comment.findMany({ where: { post_id: post?.id! } }),
          total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
          isLiked: await Likes.likedPost(post?.id!, req.user!),
          isSaved: await Saves.savedPost(post?.id!, req.user!),
          images: images.map(image => `http://localhost:3000/images/${image.src}/?width=500`)
        }
      } else {
        return {
          ...post,
          comments: await Comment.findMany({ where: { post_id: post?.id! } }),
          total_saves: (await Saves.noOfSaves(post?.id!)).rows.length,
          images: images.map(image => `http://localhost:3000/images/${image.src}/?width=500`)
        }
      }
    }));

    if (!posts || posts.length < 0) {
      return res.status(404).json({message: 'no posts found'});
    }

    return res.status(200).json([ ...posts ]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export const likePost = async (req: UserReq, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  const { total_likes }: { total_likes: number } = req.body;

  try {
    const alreadyLiked = await Likes.likedPost(id, req.user);
    
    if (alreadyLiked) {
      const result = await Likes.dislike(id, req.user);
      await Post.editPost({total_likes: total_likes - 1}, {where: { id }});
      return res.status(200).json(result);
    } else {
      const result = await Likes.like(id, req.user);
      await Post.editPost({total_likes: total_likes + 1}, {where: { id }});
      return res.status(200).json(result);
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message })
  }
}

export const savePost = async (req: UserReq, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { id } = req.params;
  try {
    const alreadySaved = await Saves.savedPost(id, req.user);
    if (alreadySaved) {
      const result = await Saves.unsave(id, req.user);
      return res.status(200).json(result);
    } else {
      const result = await Saves.save(id, req.user);
      return res.status(200).json(result);
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const sharePost = async (req: UserReq, res: Response) => {
  const { id } = req.params;
  try {
    const shared = await Post.sharePost(req.user!, id);
    return res.status(200).json({ message: 'Post Shared successfully' });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message })
  }
};

export const addComment = async (req: UserReq, res: Response) => {
  const { id } = req.params;
  const { content, parent_id } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'can\'t publish empty comment' });
  }
  try {
    const commentID = await Comment.addComment({
      post_id: id,
      content,
      parent_id,
      created_by: req.user,
    });
    return res.status(200).json(commentID);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req: UserReq, res: Response) => {
  const { comment_id } = req.params;
  const { content } = req.body;
  try {
    const result = await Comment.updateComment(comment_id, content);
    return res.status(200).json({ message: 'Comment updated successfully', updated: result })
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

export const removeComment = async (req: Request, res: Response) => {
  const { comment_id } = req.params;
  try {
    const result = await Comment.deleteComment(comment_id);
    return res.status(200).json({ message: 'Comment deleted successfully', deleted: result })
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
