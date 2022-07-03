import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import { useDropzone } from "react-dropzone";
import Resizer from "react-image-file-resizer";

// Get the current id
const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const dispatch = useDispatch();
  const post = useSelector((state) =>
    currentId ? state.posts.find((p) => p._id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(postData);
    // console.log("submitted");
    if (currentId) {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
    }
    clear();
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        file.width,
        file.width,
        "JPEG",
        30,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const onDrop = useCallback(
    (acceptedFiles) => {
      var file = acceptedFiles[0];
      const preview = document.querySelector("#preview");
      const reader = new FileReader();
      reader.onload = async () => {
        const image = await resizeFile(file);
        // console.log(image);
        setPostData({ ...postData, selectedFile: image });
        if (file) {
          preview.src = image;
          preview.classList.remove("hidden");
        }
        // console.log(event.target.result);
      };
      // update reader to make preview work
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    [postData]
  );

  // use this callback function to remove preview when the file dialog is opened (o/w users may think they uploaded the file since there is preview but actually no file is uploaded)
  const onFileDialogOpen = useCallback((acceptedFiles) => {
    var file = acceptedFiles;
    const preview = document.querySelector("#preview");
    if (!file) {
      preview.classList.add("hidden");
    }
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      onFileDialogOpen,
      accept: {
        // "image/jpeg": [".jpeg"],
        // "image/png": [".png"],
        "image/jpg": [".jpg", ".png", ".webp", ".jpeg"],
      },
      multiple: false,
    });

  const files = acceptedFiles.map((file) => (
    <li key={file.path} className="break-words">
      {/* {file.path} - {file.size} bytes */}
      File Uploaded: <br /> ➡️ {file.path}
    </li>
  ));

  const inputStyle =
    "mt-1 block w-full rounded-md dark:text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50";

  const fileInputStyle =
    "mt-1 block w-full text-base text-gray-700 bg-gray-100 dark:bg-gray-200 rounded-md cursor-pointer shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border-2 border-gray-300 dark:border-gray-400 dark:border-3 border-dashed rounded-lg px-3 py-5";

  if (!user?.result?.name) {
    return (
      <div>
        <div className="text-2xl font-bold flex justify-center mb-6">
          Welcome to WeShare!
        </div>
        <div className="text-base flex justify-center mb-6">
          Sign in to share your post with the world!
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl font-bold">
        {currentId ? "Editing" : "Creating"} a Post
      </div>
      <div className="mt-4 w-full">
        <form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit}
          className="grid grid-cols-1"
        >
          <label className="block mb-6">
            <span>Title</span>
            <input
              type="text"
              className={inputStyle}
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
            />
          </label>
          <label className="block mb-6">
            <span>Message</span>
            <textarea
              className={inputStyle + " resize-none"}
              value={postData.message}
              rows="3"
              onChange={(e) =>
                setPostData({ ...postData, message: e.target.value })
              }
            ></textarea>
          </label>
          <label className="block mb-6">
            <span>Tags (Separate them using commas ',')</span>
            <input
              type="text"
              className={inputStyle}
              value={postData.tags}
              placeholder="tag1,tag2,tag3..."
              onChange={(e) =>
                setPostData({ ...postData, tags: e.target.value.split(",") })
              }
            />
          </label>
          <label className="block mb-6">
            <span>File Uploads (Only *.jpeg/jpg/png images accepted)</span>
            <span className="sr-only">Choose profile photo</span>
            <div
              {...getRootProps({
                className: fileInputStyle,
              })}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : (
                <p>Drag 'n' drop the file here, or click to select file</p>
              )}
            </div>
            <aside className="mt-2">
              <ul>{files}</ul>
              <img src="" id="preview" alt="preview" className="hidden" />
            </aside>
          </label>
          <label className="block mb-2">
            <span className="sr-only">Submit Button</span>
            <button type="submit" className="btn btn-primary w-full">
              Submit
            </button>
          </label>
          <label className="block">
            <span className="sr-only">Clear Button</span>
            <button
              type="button"
              onClick={clear}
              className="btn btn-ghost w-full"
            >
              Clear
            </button>
          </label>
          {/* <label className="block">
            <span className="text-gray-700">When is your event?</span>
            <input
              type="date"
              className={inputStyle}
            />
          </label> */}
          {/* <label className="block">
            <span className="text-gray-700">What type of event is it?</span>
            <select
              className={inputStyle}
            >
              <option>Corporate event</option>
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Other</option>
            </select>
          </label> */}
        </form>
      </div>
    </div>
  );
};

export default Form;
