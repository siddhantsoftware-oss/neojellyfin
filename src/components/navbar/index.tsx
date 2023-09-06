import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="flex px-3 py-2">
      <Link
        to={"/"}
        className="text-2xl font-bold hover:text-primary transition"
      >
        NeoJellyfin
      </Link>
    </div>
  );
}

export default Nav;
