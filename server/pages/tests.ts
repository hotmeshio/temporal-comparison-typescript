
// Function to render HTML with buttons and results
export 
const renderTests = (
  title: string,
  data: any,
  meshFlowTraceUrl = '',
  hotMeshTraceUrl = '',
  reloadLink = '/api/v1/test'
) => {
  const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/atom-one-light.min.css">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f9f9f9;
        color: #333;
        text-align: center;
      }
      h1 {
        margin-bottom: 20px;
      }
      pre {
        padding: 15px;
        background: #f4f4f4;
        border: 1px solid #ddd;
        border-radius: 5px;
        overflow-x: auto;
        text-align: left;
        max-width: 90%;
        margin: 20px auto;
      }
      .button-container {
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 5px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: #0056b3;
      }
      .button:focus {
        outline: none;
      }
      .trace-links {
        margin: 20px 0;
        text-align: center;
        font-size: 16px;
      }
      .dashboard-links {
        margin: 20px 0;
      }
      .dashboard-links a, .trace-links a {
        margin: 0 10px;
        text-decoration: none;
        color: #007bff;
      }
      .dashboard-links a:hover, .trace-links a:hover {
        text-decoration: underline;
      }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
  </head>
  <body>
    <h1>${title}</h1>
    <div class="button-container">
      <a href="/api/v1/test" class="button">Combined</a>
      <a href="/api/v1/test/temporal" class="button">Temporal</a>
      <a href="/api/v1/test/meshflow" class="button">MeshFlow</a>
      <a href="/api/v1/test/hotmesh" class="button">HotMesh</a>
    </div>
    <pre><code class="json">${formattedData}</code></pre>
    <div class="dashboard-links">
      <strong>Dashboards</strong>: 
      <a href="http://localhost:8080" target="_blank">Temporal</a>|
      <a href="http://localhost:8118/workflows" target="_blank">HotMesh</a>
    </div>
  </body>
  </html>`;
};
