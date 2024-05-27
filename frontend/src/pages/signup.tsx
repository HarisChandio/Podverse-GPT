import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../components/ui/Button";
import InputBox from "../components/ui/InputBox";
import Heading from "../components/ui/Heading";
import SubHeading from "../components/ui/SubHeading";
import BottomWarning from "../components/ui/BottomWarning";
import LogoCard from "../components/ui/LogoCard";

interface SignupResponse {
  message: string;
  token?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signupAcc = async () => {
    try {
      const response = await axios.post<SignupResponse>(
        `http://localhost:3001/api/v1/user/signup`,
        {
          username,
          email,
          password,
        }
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
        toast.success("Successfully Signed Up", {
          onClose: () => navigate("/browse"),
        });
      } else {
        toast.error(response.data.message || "Error while Signing Up");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message || "Error while Signing Up");
    }
  };

  return (
    <div>
      <ToastContainer autoClose={500} hideProgressBar={true} />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block">
          <LogoCard />
        </div>
        <div className="bg-gray-300 h-screen flex justify-center items-center">
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2">
              <Heading label="Sign up" />
              <SubHeading label="Enter your information to create an account" />
              <InputBox
                placeholder="Tony"
                label="Username"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              />
             
              <InputBox
                placeholder="tony@gmail.com"
                label="Email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              <InputBox
                type="password"
                placeholder="123456"
                label="Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <div className="pt-4">
                <Button label="Sign up" onClick={signupAcc} />
              </div>
              <BottomWarning
                label="Already have an account?"
                buttonText="Sign in"
                to="/signin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
