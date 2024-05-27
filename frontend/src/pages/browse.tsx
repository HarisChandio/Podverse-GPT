import { useEffect, useState } from "react";
import AppBar from "../components/ui/AppBar";

import axios from "axios";
import { CircleSpinnerOverlay } from "react-spinner-overlay";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Podcasts } from "../components/ui/Podcasts";

const Browse = () => { 
  const firstName  = localStorage.getItem("username");
  return (  
    <div>
      <ToastContainer autoClose={500} hideProgressBar={true}/>
      <AppBar name={firstName} />
      <div className="m-8">
        <Podcasts/>
      </div>
    </div>
  );
};

export default Browse;
