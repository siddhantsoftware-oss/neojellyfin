import { useLocation } from "react-router-dom";

function MoviePage() {
  const movieId = useLocation().pathname.replace("/collection/movie/", "");

  return <div>MoviePage</div>;
}

export default MoviePage;
