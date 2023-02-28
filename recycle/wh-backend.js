

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


/*
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      fetch('http://localhost:3000/')
        .then(response => response.text())
        .then(text => {
          document.getElementById('root').innerHTML = text;
        });
    </script>
  </body>
</html> */
