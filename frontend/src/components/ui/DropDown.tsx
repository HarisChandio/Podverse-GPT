import { useState } from "react";
import { CgProfile } from 'react-icons/cg'
import { LuExternalLink } from 'react-icons/lu'
import { PiSignOut } from 'react-icons/pi'
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function DropdownComponent() {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const navigate = useNavigate();

  const signOut = () => {
    toast.warn("Signing Out", {
      onClose : () => {
        localStorage.removeItem("token");
        navigate('/signup')
      }
    })
  }

  const handleInvite = () => {
    navigator.clipboard.writeText("https://share-pay.vercel.app/");
    toast.info("Link Copied Succesfully")
  }

  return (
    <div>
      <ToastContainer  autoClose={1200} hideProgressBar={true} />
    <div className="inline-flex bg-white border rounded-md border-gray-900 mr-4">
      <button
        onClick={() => setDropDownOpen(!dropDownOpen)}
        className="px-4 py-2 text-sm text-gray-600  hover:text-gray-700 hover:bg-gray-50 rounded-l-md"
      >
        Menu
      </button>

      <div className="relative">
        <button
          onClick={() => setDropDownOpen(!dropDownOpen)}
          type="button"
          className="inline-flex items-center justify-center h-full px-2  mr-2 text-gray-600 border-l border-gray-400 hover:text-gray-700 rounded-r-md hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropDownOpen ? (
          <div className="absolute right-0 z-10 w-44 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg">
            <div className="p-2">
              
              
              <button
              onClick={signOut}
                className="flex px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700"
              >
                <PiSignOut size={20} className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </div>
  );
}
