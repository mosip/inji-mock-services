import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);

    useEffect(() => {
        document.title = 'Home';
    }, []);

    const endpoints = [
        { 
            name: "By value - Redirect", 
            draft23Path: "/verifier/generate-auth-request-by-value-redirect-qr",
            draft21Path: "/verifier/generate-auth-request-by-value-redirect-qr-draft21"
        },
        { 
            name: "By value - Pre-Registered", 
            draft23Path: "/verifier/generate-auth-request-by-value-pre-registered-qr",
            draft21Path: "/verifier/generate-auth-request-by-value-pre-registered-qr-draft21"
        },
        { 
            name: "By Reference", 
            draft23Path: "/verifier/generate-auth-request-by-reference-qr",
            draft21Path: "/verifier/generate-auth-request-by-reference-qr-draft21"
        },
    ];

    const handleClick = (endpointObj) => {
        setSelectedEndpoint(endpointObj);
    };

    const handleDraftClick = (draft, path) => {
        navigate('/qr', { 
            state: { 
                endpoint: path, 
                name: `${selectedEndpoint.name} - ${draft}`,
                draft: draft
            } 
        });
    };

    const handleBack = () => {
        setSelectedEndpoint(null);
    };

    return (
        <div className="homepage-container">
            {!selectedEndpoint ? (
                <>
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
                </>
            ) : (
                <>
                    <button
                        onClick={handleBack}
                        style={{
                            marginBottom: '20px',
                            padding: '8px 16px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#f8f8f8',
                            cursor: 'pointer',
                        }}
                    >
                        ← Back
                    </button>
                    <h1 style={{ marginBottom: '20px' }}>Select OpenID4VP Draft Version</h1>
                    <h2 style={{ marginBottom: '20px', color: '#666' }}>{selectedEndpoint.name}</h2>
                    
                    <div className="auth-button-list">
                        <button
                            onClick={() => handleDraftClick('Draft 23', selectedEndpoint.draft23Path)}
                            className="auth-request-button"
                        >
                            Draft 23
                        </button>

                        <button
                            onClick={() => handleDraftClick('Draft 21', selectedEndpoint.draft21Path)}
                            className="auth-request-button"
                        >
                            Draft 21
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
