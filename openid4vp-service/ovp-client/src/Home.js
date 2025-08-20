import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Home';
    }, []);

    const endpoints = [
        { name: "By value - Redirect", path: "/verifier/generate-auth-request-by-value-redirect-qr" },
        { name: "By value - Pre-Registered", path: "/verifier/generate-auth-request-by-value-pre-registered-qr" },
        { name: "By Reference", path: "/verifier/generate-auth-request-by-reference-qr" },
    ];

    const handleClick = (endpointObj) => {
        navigate('/qr', { state: { endpoint: endpointObj.path, name: endpointObj.name } });
    };

    return (
        <div className="homepage-container">
            <h1 style={{marginBottom: '20px'}}>Home screen</h1>
            <h2>Select Auth Request Type</h2>
            <div className="auth-button-list">
                {endpoints.map(e => (
                    <button
                        key={e.name}
                        onClick={() => handleClick(e)}
                        className="auth-request-button"
                    >
                        {e.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
