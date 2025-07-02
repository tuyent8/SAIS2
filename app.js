
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/jobs', require('./src/routes/jobRoutes'));

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/cv', require('./src/routes/cvRoutes'));

app.get('/', (req, res) => res.send('Recruitment backend is running'));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});