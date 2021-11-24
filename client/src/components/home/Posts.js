import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "../PostCard";

import LoadIcon from "../../images/loading.gif";
import LoadMoreBtn from "../LoadMoreBtn";
import { getDataAPI } from "../../utils/fetchData";
import { POST_TYPES } from "../../redux/actions/postAction";

const Posts = () => {
  const { homePosts, auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);
  const [tempData, setTempData] = useState();
  const [texts, setTexts] = useState("");

  const handleLoadMore = async () => {
    setLoad(true);
    const res = await getDataAPI(
      `posts?limit=${homePosts.page * 9}`,
      auth.token
    );

    dispatch({
      type: POST_TYPES.GET_POSTS,
      payload: { ...res.data, page: homePosts.page + 1 },
    });

    setLoad(false);
  };
  const onTextChange = (text) => {
    setTexts(text);
    if (text === "") {
      setTempData(homePosts.posts);
      return;
    }
    const tempdatas = homePosts.posts.filter((post) =>
      post.category.includes(text)
    );

    setTempData(tempdatas);
  };
  useEffect(() => {
    setTempData(homePosts.posts);
  }, []);
  return (
    <div className="posts">
      <div>
        <input
          style={{
            width: "100%",
            height: "3rem",
            textAlign: "center",
          }}
          placeholder="Search by category"
          onChange={(e) => {
            onTextChange(e.target.value);
          }}
        />
      </div>
      {tempData &&
        tempData.map((post) => (
          <PostCard key={post._id} post={post} theme={theme} />
        ))}

      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}

      <LoadMoreBtn
        result={homePosts.result}
        page={homePosts.page}
        load={load}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default Posts;
