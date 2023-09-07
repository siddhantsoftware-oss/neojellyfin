import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/home";
import Nav from "./components/navbar";
import MoviePage from "./pages/collection/movie/id";

const AppRouter = () => (
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/collection/movie/:id" element={<MoviePage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
