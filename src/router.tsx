import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/home";
import Nav from "./components/navbar";
import MoviePage from "./pages/collection/media/id";
import ViewMovieLibrary from "./pages/collection/all/movies";
import MediaPlayback from "./pages/playback";
import AllShowsList from "./pages/collection/all/shows";

const AppRouter = () => (
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/collection/media/:id" element={<MoviePage />} />
      <Route path="/collection/movies/all/:id" element={<ViewMovieLibrary />} />
      <Route path="/playback/:media" element={<MediaPlayback />} />
      <Route path="/collection/shows/all/:id" element={<AllShowsList />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
