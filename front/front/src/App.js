import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/header";
import Registration from "./pages/registration";
import Login from "./pages/log-in";
import { AuthProvider } from "./auth-hook";
import RedirectAuth from "./redireactIfAuth";
import Profile from "./profile";
import MainPage from "./pages/main-page";
import OtherUserProfile from "./pages/other-user";
import PostPage from "./pages/post-page";
import MyPosts from "./pages-for-profile/me-posts";
import NoLoggedIn from "./is-loggedin-hook";
import CreatePostPage from "./pages-for-profile/create-post";
import PostsThatILiked from "./pages-for-profile/get-posts-by-likes";
import PostsThatICommented from "./pages-for-profile/commented-posts";
import Friends from "./components/display-friends";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/error" element={<div>This page doesn't exist</div>} />
          <Route
            path="/registration"
            element={
              <RedirectAuth>
                <Registration />
              </RedirectAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuth>
                <Login />
              </RedirectAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <NoLoggedIn>
                <Profile />
              </NoLoggedIn>
            }
          />
          <Route
            path="/my-friends"
            element={
              <NoLoggedIn>
                <Friends type="friends" />
              </NoLoggedIn>
            }
          />
          <Route path="/user/:id" element={<OtherUserProfile />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route
            path="/post/invalid"
            element={<h1>Такого поста не існує</h1>}
          />{" "}
          <Route
            path="/my-posts"
            element={
              <NoLoggedIn>
                <MyPosts />
              </NoLoggedIn>
            }
          />
          <Route
            path="/liked-posts"
            element={
              <NoLoggedIn>
                <PostsThatILiked />
              </NoLoggedIn>
            }
          />
          <Route
            path="/commented-posts"
            element={
              <NoLoggedIn>
                <PostsThatICommented />
              </NoLoggedIn>
            }
          />
          <Route
            path="/create-post"
            element={
              <NoLoggedIn>
                <CreatePostPage />
              </NoLoggedIn>
            }
          />
          <Route
            path="/received-requests"
            element={
              <NoLoggedIn>
                <Friends type="received-requests" />
              </NoLoggedIn>
            }
          />
          <Route
            path="/sended-requests"
            element={
              <NoLoggedIn>
                <Friends type="sended-requests" />
              </NoLoggedIn>
            }
          />
        </Routes>
      </AuthProvider>{" "}
    </BrowserRouter>
  );
}

export default App;
