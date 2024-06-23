
const express = require('express');
const routes = require('./routes/index'); 
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
