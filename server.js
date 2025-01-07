import express from 'express';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const port = 3000;

app.post('/coordinates', async (req, res) => {
  try {
    // Run the update script in the background
    execAsync('npm run coordinates');
    res.status(200).json({ message: 'Update process started' });
  } catch (error) {
    console.error('Error starting update process:', error);
    res.status(500).json({ error: 'Failed to start update process' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});