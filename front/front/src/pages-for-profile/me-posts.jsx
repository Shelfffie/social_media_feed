import { DisplayPosts } from "../components/display-posts";
import { useIntersectionObserverPostsAndPosts } from "../hooks/intersection-observer";
import { useAuth } from "../auth-hook";
import { useNavigate } from "react-router-dom";

function MyPosts() {
  const { loading } = useAuth();
  const { loaderRef, posts, setFilters, filters, isLoading, setPosts } =
    useIntersectionObserverPostsAndPosts();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <p onClick={() => navigate(-1)} className="navigate">
        Повернутися назад
      </p>
      <div>
        <h1 className="titleForProfilePages">Мої пости:</h1>
        <DisplayPosts
          posts={posts}
          loaderRef={loaderRef}
          setFilters={setFilters}
          filters={filters}
          isLoading={isLoading}
          setPosts={setPosts}
        />
      </div>
    </>
  );
}

export default MyPosts;
