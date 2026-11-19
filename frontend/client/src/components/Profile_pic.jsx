// Emperor Norton profile picture
import {useState} from "react";
import "../App.css";

export default function Avatar ({src=profilePic, alt="Emperor Norton", size=200}) {
    // SetFailed is false by default
    const [failed, setFailed] = useState(false);
    const showImage = src && !failed;

    return (
        <div className="avatar" style={{ "--avatar-size": `${size}px` }}>
            {showImage ? (
                <img 
                className="avatar_img"
                src={src}
                alt={alt}
                // If a error occur switch the fail state to true
                onError={() => setFailed(true)}
                />
            ) : (
                // fallback if the pic fail to load
            <span className="avatar_fallback" aria-hidden="true">N</span>
            )}
        </div>
    )
}