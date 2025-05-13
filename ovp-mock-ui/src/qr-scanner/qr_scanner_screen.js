import React,  { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, Typography, IconButton, Grid } from "@mui/material";
import ReactJson from "react-json-view";
import { useLocation } from "react-router-dom";
import { useTheme, useMediaQuery } from '@mui/material';


const QRJsonDisplay = () => {
  const location = useLocation();
  const theme = useTheme();
  const [messages, setMessages] = useState({ "response": "Scan QR to get Response" });

  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const { type, data } = location.state || {};
  const size = isSmall ? 280 : 360;

  const handleCopy = (copyType) => {
    var dataCopied;
    switch (copyType) {
      case "auth-response":
        dataCopied = JSON.stringify(messages, null, 2);
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
        break;
      case "link":
        dataCopied = data;
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        break;
      default:
        dataCopied = "";
        break;
    }
    navigator.clipboard.writeText(dataCopied);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function deepParseJSON(input) {
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return deepParseJSON(parsed);
      } catch (e) {
        return input; 
      }
    } else if (Array.isArray(input)) {
      return input.map(deepParseJSON);
    } else if (input && typeof input === 'object') {
      const result = {};
      for (const key in input) {
        result[key] = deepParseJSON(input[key]);
      }
      return result;
    }
    return input;
  }

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/events');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received via SSE:', data);
      const jsonData = deepParseJSON(data);
      setMessages(jsonData);
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [deepParseJSON]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', background: "#fafafa", minHeight: '100vh', alignItems: 'center' }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card sx={{ padding: '16px', boxShadow: 2, borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ marginBottom: '16px', color: '#555', textAlign: "center" }}>
                Authorization Request: {type}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <QRCode value={data} size={size} includeMargin={true} />
              </div>
              <div style={{ display: 'flex', padding: '16px', paddingRight: '0px', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Typography 
                    variant="body1" 
                    sx={{
                      wordBreak: 'break-word', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'normal', 
                      flex: 1, 
                      marginRight: '16px',
                    }}
                  >
                    <a
                      href={data}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: 'none',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden', 
                        color: '#007bff',
                        fontSize: '14px'
                      }}
                    >
                      {data}
                    </a>
                  </Typography>
                <IconButton onClick={() => handleCopy("link")} style={{ padding: "14px" }}>
                  {copiedLink ? <Check sx={{ color: 'green' }} /> : <Copy />}
                </IconButton>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card sx={{ padding: '16px', boxShadow: 2, borderRadius: '16px' }}>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="subtitle1" sx={{ color: '#555' }}>Authorization Response</Typography>
                <IconButton onClick={() => handleCopy("auth-response")} style={{ padding: "14px" }}>
                  {copiedResponse ? <Check sx={{ color: 'green' }} /> : <Copy />}
                </IconButton>
              </div>
              <div style={{ backgroundColor: '#1e1e1e', padding: '16px', borderRadius: '8px', color: '#f5f5f5', overflowY: 'auto' }}>
                <ReactJson
                  src={messages}
                  theme="monokai"
                  collapsed={2}
                  displayDataTypes={false}
                  enableClipboard={false}
                  name={null}
                  style={{
                    fontSize: '12px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#1e1e1e',
                    color: '#f5f5f5',
                  }}
                  iconStyle="triangle"
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default QRJsonDisplay;
