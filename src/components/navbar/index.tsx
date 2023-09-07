import { Link } from "react-router-dom";

function Nav() {
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
