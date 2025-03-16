import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router';
import './App.css';
import { Home } from './Home';
import { Hoge } from './Hoge';
import { Test } from './Test';
import { UserCard } from './UserCard';

export const App = () => {
  return (
    <BrowserRouter>
      <h1 data-testid="title">オンライン名刺アプリ</h1>
      <NavLink to="/card">カード</NavLink>
      <NavLink to="/card/home">ホーム</NavLink>
      <NavLink to="/card/hoge">ホゲ</NavLink>
      <NavLink to="/card/test">テスト</NavLink>

      <Routes>
        <Route path="card" element={<UserCard />}>
          <Route path=":id" element={<Outlet />} />
          <Route path="home" element={<Home />} />
          <Route path="hoge" element={<Hoge />} />
          <Route path="test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
