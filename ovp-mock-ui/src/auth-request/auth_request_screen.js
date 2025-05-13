import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Container, Box } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';

import { 
  preRegisteredAuthorizationRequest,
  redirectAuthorizationRequest,
  
  // preRegisteredAuthorizationRequestParams,
  // redirectAuthorizationRequestParams,
  didAuthorizationRequestParams,
} from '../data/input';

const AuthRequestScreen = () => {
  const navigate = useNavigate();

  function createUrlWithParams( params) {
    const baseUrl = "openid4vp://authorize";
    const urlParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        urlParams.append(key, value.toString());
    }
    return `${baseUrl}?${urlParams.toString()}`;
  }

  const handleCardClick = async (type) => {
    try {
      var data;
      switch (type) {
        // By value
        case 'Authorization Request pre-registered':
          data = createUrlWithParams(preRegisteredAuthorizationRequest);
          break;
        case 'Authorization Request redirect':
          data = createUrlWithParams(redirectAuthorizationRequest);
          break;

        // By reference
        // case 'Authorization Request Params pre-registered':
        //   data = createUrlWithParams(preRegisteredAuthorizationRequestParams);
        //   break;
        // case 'Authorization Request Params redirect':
        //   data = createUrlWithParams(redirectAuthorizationRequestParams);
        //   break;
        case 'Authorization Request Params did':
          data = createUrlWithParams(didAuthorizationRequestParams);
          break;

        default:
          data= ""
          break;
      }

      navigate('/qrscreen', { state: { type, data } });
    } catch (error) {
      console.error('Error Creating QR data: ', error);
    }
  };

  const cardsData = [
    // By value
    { type: 'Authorization Request pre-registered', definition: 'Generate auth request by value pre-registered' },
    { type: 'Authorization Request redirect', definition: 'Generate auth request by value redirect'},
    // By reference
    // { type: 'Authorization Request Params pre-registered',  definition: 'Generate auth request by reference' },
    // { type: 'Authorization Request Params redirect',  definition: 'Generate auth request by reference' },
    { type: 'Authorization Request Params did',  definition: 'Generate auth request by reference' },
  ];
  const gridColumn = cardsData.length<4 ? 12/cardsData.length: 3;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', minHeight: '100vh', background: "#fafafa", alignItems: 'center' }}>
    <Container>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {cardsData.map((card, index) => (
          <Grid item xs={12} sm={6} md={gridColumn} key={index}>
            <Card
              onClick={() => handleCardClick(card.type)}
              sx={{ padding: '16px', boxShadow: 2, borderRadius: '16px' , textAlign:'center', }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2,}}>
                  {card.type}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      width: 60,
                      height: 60,
                      backgroundColor: '#f0f0f0',
                      marginBottom: 2,
                      padding: '12px'
                    }}
                  >
                    <QrCodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {card.definition}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </div>
  );
};

export default AuthRequestScreen;
