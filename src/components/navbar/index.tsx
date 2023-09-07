import { Link, useLocation } from "react-router-dom";

function Nav() {
  const pathname = useLocation().pathname;

  if (pathname.includes("playback")) {
    return null;
  }

  return (
    <div className="flex px-10 py-5">
      <Link
        to={"/"}
        className="text-3xl font-bold hover:text-primary transition"
      >
        NeoJellyfin
      </Link>
    </div>
  );
}

export default Nav;
