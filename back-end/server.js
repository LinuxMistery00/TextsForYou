const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const uri = 'mongodb://127.0.0.1:27017/texts';

async function connectToDatabase() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    return client.db();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

app.get('/devs', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const textsCollection = db.collection('texts');
    const texts = await textsCollection.find().toArray();

    res.json(texts);
  } catch (error) {
    console.error('Error fetching texts:', error);
    res.status(500).send('Error fetching texts.');
  }
});

app.post('/addDev', async (req, res) => {
  const { text } = req.body;

  try {
    const db = await connectToDatabase();
    const textsCollection = db.collection('texts');
    const newText = { text };

    const result = await textsCollection.insertOne(newText);

    console.log('Text added to MongoDB:', newText);

    res.json(result.ops[0]);
  } catch (error) {
    console.error('Error adding text:', error);
    res.status(500).send('Error adding text.');
  }
});

app.delete('/deleteDev/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectToDatabase();
    const textsCollection = db.collection('texts');
    
    // Convert the string ID to an ObjectId
    const objectId = new ObjectId(id);
    
    const result = await textsCollection.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      console.log('Text removed from MongoDB:', id);
      res.sendStatus(204); // No Content
    } else {
      console.error('Text not found in MongoDB:', id);
      res.status(404).send('Text not found.');
    }
  } catch (error) {
    console.error('Error removing text:', error);
    res.status(500).send('Error removing text.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
