import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages";
import Nav from "./components/navbar";

const AppRouter = () => (
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
