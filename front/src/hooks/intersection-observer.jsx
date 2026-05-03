import { useState, useEffect, useRef } from "react";
import axios from "axios";

export function useIntersectionObserverPostsAndPosts(
  allPosts,
  userIdPosts,
  likes,
  comments
) {
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filters, setFilters] = useState({ title: "" });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page < totalPage && posts.length > 0) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [page, totalPage, posts]);

  useEffect(() => {
    const controller = new AbortController();
    const delay = setTimeout(() => {
      setPage(1);
      getAllPosts(1, true);
    }, 500);

    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [filters]);

  const getAllPosts = async (page, reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    let url;
    if (allPosts) {
      url = `http://localhost:5000/un/all-notes?page=${page}`;
    } else if (userIdPosts) {
      url = `http://localhost:5000/un/users/${userIdPosts}/notes?page=${page}`;
    } else if (likes) {
      url = `http://localhost:5000/un/posts-that-i-liked?page=${page}`;
    } else if (comments) {
      url = `http://localhost:5000/un/my-comments?page=${page}`;
    } else {
      url = `http://localhost:5000/un/users/notes?page=${page}`;
    }

    try {
      const response = await axios.get(url, {
        withCredentials: true,
        params: { ...filters, title: filters.title.trim() },
      });

      setTotalPage(response.data.totalPage);

      setPosts((prev) =>
        reset
          ? response.data.posts || []
          : [...prev, ...(response.data.posts ? response.data.posts : [])]
      );
    } catch (error) {
      console.log(
        "Server error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts(page, false);
  }, [page]);

  return {
    loaderRef,
    posts,
    setPosts,
    setPage,
    totalPage,
    setTotalPage,
    isLoading,
    setIsLoading,
    filters,
    setFilters,
  };
}
