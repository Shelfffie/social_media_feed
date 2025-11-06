import { useAuth } from "../auth-hook";
import { Link } from "react-router-dom";
import { DisplayPosts } from "../components/display-posts";
import { useIntersectionObserverPostsAndPosts } from "../hooks/intersection-observer";

function MainPage() {
  const { loading } = useAuth();
  const { loaderRef, posts, filters, setFilters, isLoading, setPosts } =
    useIntersectionObserverPostsAndPosts(true, null);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div>
        <DisplayPosts
          posts={posts}
          loaderRef={loaderRef}
          setFilters={setFilters}
          filters={filters}
          isLoading={isLoading}
          setPosts={setPosts}
        />
      </div>
      <div ref={loaderRef} style={{ height: "50px" }} />
    </>
  );
}

export default MainPage;
