import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/home";
import Nav from "./components/navbar";
import MoviePage from "./pages/collection/movie/id";
import ViewMovieLibrary from "./pages/collection/all/movies";
import MediaPlayback from "./pages/playback";
import SeriesPage from "./pages/collection/series/id";

const AppRouter = () => (
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/collection/movie/:id" element={<MoviePage />} />
      <Route path="/collection/series/:id" element={<SeriesPage />} />
      <Route path="/collection/movies/all/:id" element={<ViewMovieLibrary />} />
      <Route path="/playback/:media" element={<MediaPlayback />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
