import RecentlyAdded from "../sections/RecentlyAdded";
import ViewAllCollections from "../sections/ViewAllCollections";

function IndexPage() {
  return (
    <div className="flex flex-col gap-y-5">
      <RecentlyAdded />
      <ViewAllCollections />
    </div>
  );
}

export default IndexPage;
