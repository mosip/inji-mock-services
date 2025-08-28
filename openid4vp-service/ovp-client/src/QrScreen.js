import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {prettyScanResult} from "./jsonHelper";
import {BACKEND_URL} from "./mockui-constants";

const QrScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [qrData, setQrData] = useState(null);
    const [inputData, setInputData] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [copiedResult, setCopiedResult] = useState(false);
    const [copiedAuthRequest, setCopiedAuthRequest] = useState(false);
    const [showInputData, setShowInputData] = useState(false);
    const [actualAuthorizationRequestObject, setActualAuthorizationRequestObject] = useState(null);


    useEffect(() => {
        const fetchQr = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}${state.endpoint}`);
                setQrCodeData(response.data.qrCodeData);
                setQrData(response.data.qrData);
                setInputData(response.data.inputData)

                if (state.endpoint === "/verifier/generate-auth-request-by-reference-qr") {
                    const response = await axios.get(`${BACKEND_URL}/verifier/get-auth-request-obj`);
                    setActualAuthorizationRequestObject(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch QR code:', err);
            }
        };

        fetchQr();
    }, [state]);

    useEffect(() => {
        setScanResult(null);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/verifier/vp-result`);
                if (response.data && response.data !== false) {
                    setScanResult(response.data);
                }
            } catch (err) {
                console.error('Error checking scan result:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        document.title = 'Scan';
    }, []);

    const handleCopy = (textSetter, setToast) => {
        navigator.clipboard.writeText(textSetter);
        setToast(true);
        setTimeout(() => setToast(false), 1500);
    };

    const renderActualAuthRequestObject = () => {
        return <>
            {actualAuthorizationRequestObject && (
                <div className="auth-request-container">
                    <div style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <h2 style={{margin: 0}}>Actual Authorization Request Object</h2>
                        <button
                            onClick={() =>
                                handleCopy(
                                    JSON.stringify(actualAuthorizationRequestObject, null, 2),
                                    setCopiedAuthRequest
                                )
                            }
                            style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                backgroundColor: copiedAuthRequest ? '#4caf50' : '#eee',
                                color: copiedAuthRequest ? 'white' : 'black',
                                cursor: 'pointer',
                                minWidth: '60px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {copiedAuthRequest ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="scrollable-json-container">
                        <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                            {JSON.stringify(actualAuthorizationRequestObject, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </>;
    }
    return (
        <div className="responsive-container">
            <button
                onClick={() => navigate('/')}
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
            <h1 className="page-title">Scan screen</h1>
            <div className="two-column-layout">

                <div className="qr-code-section">


                    {qrCodeData && qrData ? (
                        <div>
                            <a href={qrData} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={qrCodeData}
                                    alt="QR Code"
                                    className="qr-code-image"
                                />
                            </a>

                            <a
                                href={qrCodeData}
                                download="qr-code.png"
                                style={{
                                    display: 'inline-block',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    background: '#e0f7fa',
                                    textDecoration: 'none',
                                    color: '#000',
                                    cursor: 'pointer',
                                }}
                            >
                                ⬇ Download QR
                            </a>
                        </div>


                    ) : (
                        <p>Loading...</p>
                    )}
                    <h2>{state?.name || 'QR Code Image'}</h2>

                    <button
                        onClick={() => setShowInputData(!showInputData)}
                        style={{
                            marginTop: '10px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#eee',
                            cursor: 'pointer',
                        }}
                    >
                        {showInputData ? 'Hide Description' : 'Show Description'}
                    </button>

                    {showInputData && (
                        <div className="description-container">
                            <div className="json-display-block">
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                  {JSON.stringify(inputData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {renderActualAuthRequestObject()}

                    {qrData && (
                        <div className="payload-container">
                            <div style={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <h4 style={{margin: 0}}>Payload</h4>
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            typeof qrData === 'string' ? qrData : JSON.stringify(qrData, null, 2),
                                            setCopied
                                        )
                                    }
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        backgroundColor: copied ? '#4caf50' : '#eee',
                                        color: copied ? 'white' : 'black',
                                        cursor: 'pointer',
                                        minWidth: '60px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="json-display-block">
                                <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                                    {typeof qrData === 'string' ? qrData : JSON.stringify(qrData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>


                <div className="scan-result-section">
                    <div style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <h2 className="section-title" style={{margin: 0}}>Scan Result</h2>
                        {scanResult && (
                            <button
                                onClick={() =>
                                    handleCopy(
                                        JSON.stringify(prettyScanResult(scanResult), null, 2),
                                        setCopiedResult
                                    )
                                }
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    backgroundColor: copiedResult ? '#4caf50' : '#eee',
                                    color: copiedResult ? 'white' : 'black',
                                    cursor: 'pointer',
                                    minWidth: '60px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {copiedResult ? 'Copied!' : 'Copy'}
                            </button>
                        )}
                    </div>

                    {scanResult ? (
                        <div
                            style={{
                                background: scanResult?.error ? '#ffe6e6' : '#e9ffe9',
                                padding: '16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(prettyScanResult(scanResult), null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <div
                            style={{
                                background: '#fffacc',
                                padding: '16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                textAlign: 'center',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            Waiting for scan result...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default QrScreen;
