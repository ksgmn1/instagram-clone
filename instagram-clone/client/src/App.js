import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvier from "./components/auth/AuthProvider";
import AuthRequired from "./components/auth/AuthRequired";
import Layout from "./components/Layout";
import Feed from "./components/Feed";
import PostView from "./components/PostView";
import Comments from "./components/comments/Comments";
import Explore from "./components/Explore";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/profile/Profile";
import Followers from "./components/follow/Followers";
import Following from "./components/follow/Following";
import ProfileEdit from "./components/ProfileEdit";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <Router>
      <AuthProvier>
        <Routes>
          {/* 인증이 필요한 라우트 */}
          <Route path="/" element={
            <AuthRequired>
              <Layout/>
            </AuthRequired>
          }>
            <Route index element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="p/:id">
              <Route index element={<PostView />} />
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="profiles/:username">
              <Route index element={<Profile />} />
              <Route path="followers" element ={<Followers />} />
              <Route path="following" element ={<Following />} />
            </Route>
            <Route path="accounts/edit" element={<ProfileEdit />} />
          </Route>
          <Route path="accounts/login" element={<Login />} />
          <Route path="accounts/signup" element = {<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvier>
    </Router>
  )
}