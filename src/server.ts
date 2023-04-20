import app from './app';
import connectToMongoDB from './utils/db';

const port = process.env.PORT || 3001;

// Start the server
(async () => {
  try {
    await connectToMongoDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('Server Error: ', (err as Error).message);
  }
})();
