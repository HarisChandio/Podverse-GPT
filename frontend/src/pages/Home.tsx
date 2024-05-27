import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      navigate("/browse");
    }
  }, [navigate]); // Including navigate in the dependency array to adhere to React's exhaustive-deps rule

  return <div />;
};

export default Home;
