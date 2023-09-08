import RecentlyAdded from "../sections/RecentlyAdded";
import ResumeWatching from "../sections/ResumeWatching";
import ViewAllCollections from "../sections/ViewAllCollections";


function IndexPage() {
  return (
    <div className="flex flex-col gap-y-10 mb-20">
      <RecentlyAdded />
      <ViewAllCollections />
      <ResumeWatching />
    </div>
  );
}

export default IndexPage;
