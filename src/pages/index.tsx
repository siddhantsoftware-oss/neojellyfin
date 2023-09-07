import useStore from "../helpers/store";

function IndexPage() {
  const [userId] = useStore((state) => [state.userId]);

  return <div>IndexPage: {userId}</div>;
}

export default IndexPage;
