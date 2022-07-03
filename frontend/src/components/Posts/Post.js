import React from "react";
import {
  RiThumbUpFill,
  RiThumbUpLine,
  RiDeleteBin6Line,
  RiEdit2Line,
} from "react-icons/ri";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../actions/posts";
import moment from "moment";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <div className="card w-full glass">
      <figure>
        <img src={post.selectedFile} alt={post._id} />
      </figure>
      <div className="card-body p-2 sm:p-3">
        <p className="text-lg lg:text-xl card-title text-gray-700 dark:text-gray-100">
          {post.title}
        </p>
        <div className="flex flex-row justify-between text-sm lg:text-base text-gray-500 font-medium dark:text-gray-400">
          <div>{post.name}</div>
          <div>{moment(post.createdAt).fromNow()}</div>
        </div>
        {/* <div className=" text-xs lg:text-sm text-gray-500 font-medium dark:text-gray-400">
          <div>
            {post.createdAt === post.updatedAt
              ? ""
              : "(Edited " + moment(post.updatedAt).fromNow() + ")"}
          </div>
        </div> */}
        <p className="text-gray-700 dark:text-gray-100 hidden md:block text-sm lg:text-base">
          {post.message}
        </p>
        <div className="card-actions justify-end">
          {post.tags.map((tag) => (
            <div key={tag} className="badge badge-outline text-xs lg:text-sm">
              {tag}
            </div>
          ))}
        </div>
        <div className="card-actions flex flex-row justify-between mt-2">
          <div className="">
            <button
              className="btn btn-primary no-animation px-2 md:px-3"
              onClick={() => dispatch(likePost(post._id))}
              disabled={!user?.result}
            >
              {post.likes.find(
                (like) => like === (user?.result?.googleId || user?.result?._id)
              ) ? (
                <RiThumbUpFill className="text-base md:text-lg" />
              ) : (
                <RiThumbUpLine className="text-base md:text-lg" />
              )}
              &nbsp;&nbsp;
              <div className="text-sm md:text-base">{post.likes.length}</div>
            </button>
          </div>

          {(user?.result?.googleId === post?.creator ||
            user?.result?._id === post?.creator) && (
            <div>
              <button
                className="btn px-2 sm:px-3 mr-1 md:mr-2 no-animation"
                onClick={() => setCurrentId(post._id)}
              >
                <RiEdit2Line className="text-base md:text-lg" />
              </button>
              <button
                className="btn btn-error px-2 sm:px-3 no-animation"
                onClick={() => dispatch(deletePost(post._id))}
              >
                <RiDeleteBin6Line className="text-base md:text-lg" />
              </button>
            </div>
          )}

          {/* <button className="mt-2 btn btn-primary">Read More</button> */}
        </div>
      </div>
    </div>
  );
};

export default Post;
