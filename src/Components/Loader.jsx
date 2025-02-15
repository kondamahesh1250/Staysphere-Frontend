import React from 'react';
import FadeLoader from "react-spinners/FadeLoader";

const Loader = () => {
    return (
        <div style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <FadeLoader
                color="#000"
                loading={true}
                size={50}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Loader;
