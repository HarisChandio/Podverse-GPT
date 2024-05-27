
import Playground from "./pages/playground";
import Browse from "./pages/browse";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./pages/signup";
import SignIn from "./pages/signin";
import Home from "./pages/Home";
import { connectChainlitServer } from "./hooks/connectChainlit";
function App() {
  connectChainlitServer();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/playground/:aws_id" element={<Playground />} ></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<SignIn></SignIn>}></Route>
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
