import { useAuth } from "../auth-hook";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import styles from "../css/header.module.css";

export function Header() {
  const { isLoggedIn, loading } = useAuth();
  const prevScroll = useRef(0);
  const headerNav = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerNav.current) return;
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll < 100) {
        headerNav.current.classList.remove(styles.hideHeader);
        prevScroll.current = currentScroll;
        return;
      }
      if (currentScroll > prevScroll.current) {
        headerNav.current.classList.add(styles.hideHeader);
      } else {
        headerNav.current.classList.remove(styles.hideHeader);
      }
      prevScroll.current = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <header className={styles.headerNav} ref={headerNav}>
      {" "}
      <Link to="/">Home</Link>
      {isLoggedIn ? (
        <>
          <Link to="/profile">Профіль</Link>
          <Link to="/create-post">Створити пост</Link>
        </>
      ) : (
        <Link to="/login">Увійти в акаунт</Link>
      )}
    </header>
  );
}
