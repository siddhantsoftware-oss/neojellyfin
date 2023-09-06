import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<IndexPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
