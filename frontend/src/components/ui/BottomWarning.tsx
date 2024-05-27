import { Link } from "react-router-dom";

interface BottomWarningProps {
    label: string;
    buttonText: string;
    to: string;
}

 const BottomWarning: React.FC<BottomWarningProps> = ({ label, buttonText, to }) => {
    return (
        <div className="py-2 text-sm flex justify-center">
            <div>{label}</div>
            <Link className="pointer underline pl-1 cursor-pointer bg-purple-500" to={to}>
                {buttonText}
            </Link>
        </div>
    );
};

export default BottomWarning;
