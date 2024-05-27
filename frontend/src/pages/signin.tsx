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

interface SignInResponse {
  message: string;
  token?: string;
}

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signInAcc = async () => {
    try {
      const response = await axios.post<SignInResponse>(
        `http://localhost:3001/api/v1/user/signin`,
        {
          email,
          password,
        }
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username)
        toast.success("Successfully Logged In", {
          onClose: () => navigate("/browse"),
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Sign In failed. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer autoClose={400} hideProgressBar />
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:block">
          <LogoCard />
        </div>
        <div className="bg-gray-300 h-screen flex justify-center items-center">
          <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2">
              <Heading label="Sign in" />
              <SubHeading label="Enter your credentials to access your account" />
              <InputBox
                placeholder="user@gmail.com"
                label="Username"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              <InputBox
                type="password"
                placeholder="123456"
                label="Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <div className="pt-4">
                <Button label="Sign in" onClick={signInAcc} />
              </div>
              <BottomWarning
                label="Don't have an account?"
                buttonText="Sign up"
                to="/signup"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
