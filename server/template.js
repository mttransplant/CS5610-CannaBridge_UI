import serialize from 'serialize-javascript';

export default function template(body, initialData, userData) {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <title>Pro MERN STack</title>
    
        <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">
        <link rel="shortcut icon" href="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>        
    
            table.table-hover tr {cursor: pointer;}
    
            .panel-title a {display: block; width: 100%; cursor: pointer;}
        </style>
    </head>
    
    <body>
        <!-- Page generated from template. -->
        <div id="content">${body}</div>
        <script>
            window.__INITIAL_DATA__ = ${serialize(initialData)}
            window.__USER_DATA__ = ${serialize(userData)}
        </script>
        <script src="/env.js"></script>
        <script src="/vendor.bundle.js"></script>
        <script src="/app.bundle.js"></script>
    </body>
    
    </html>`;
}
