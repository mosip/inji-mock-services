# In Mock Services Backend Add the Following Changes

1. **Update the ngrok proxy** in both the React app and Node service to ensure proper tunneling for external access.

2. **Add Server-Sent Events (SSE)** to update the React app after a QR scan. Implement the following code in the Node service:

```javascript
let clients = [];

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  clients.push(send);

  req.on('close', () => {
    clients = clients.filter(client => client !== send);
  });
});
```

3. **Enable CORS** if the service is running on a different port. Add the following to the Node service:

```javascript
const cors = require('cors');

app.use(cors());
```

4. **Trigger SSE in POST request handling**. When handling a POST request in the Node service, send the response data to all connected clients:

```javascript
clients.forEach(client => client(JSON.stringify(req.body)));
```