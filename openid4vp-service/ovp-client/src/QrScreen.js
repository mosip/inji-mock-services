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
        setTimeout(() => setToast(false), 2000);
    };

    const renderActualAuthRequestObject = () => {
        return <>
            {actualAuthorizationRequestObject && (
                <div style={{flex: 1, marginTop: '16px'}}>
                    <div className="section-header" style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <h2 style={{margin: 0}}>Actual Authorization Request Object</h2>
                        <div className="copy-button-container" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            {copiedAuthRequest && (
                                <div
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                        zIndex: 1,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Copied!
                                </div>
                            )}
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
                                    backgroundColor: '#eee',
                                    cursor: 'pointer',
                                }}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                    <div className="json-display-block">
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
                        <div className="json-display-block" style={{ marginTop: '10px' }}>
                            <pre style={{ margin: 0 }}>
                              {JSON.stringify(inputData, null, 2)}
                            </pre>
                        </div>
                    )}

                    {renderActualAuthRequestObject()}

                    {qrData && (
                        <div style={{marginTop: '16px'}}>
                            <div className="section-header" style={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <h4 style={{margin: 0}}>Payload</h4>
                                <div className="copy-button-container" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    {copied && (
                                        <div
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#4caf50',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                            }}
                                        >
                                            Copied!
                                        </div>
                                    )}
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
                                            backgroundColor: '#eee',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="json-display-block">
                                <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                                    {typeof qrData === 'string' ? qrData : JSON.stringify(qrData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>


                <div className="scan-result-section" style={{marginTop: '-10px'}}>
                    <div className="section-header" style={{
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                    }}>
                        <h2 className="section-title" style={{margin: 0}}>Scan Result</h2>
                        {scanResult && (
                            <div className="copy-button-container" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                {copiedResult && (
                                    <div
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                            zIndex: 1,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Copied!
                                    </div>
                                )}
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
                                        backgroundColor: '#eee',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
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
