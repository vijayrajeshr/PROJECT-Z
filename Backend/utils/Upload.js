// migrate-data.js

const mongoose = require('mongoose');
const Collection = require('../models/marketing-dashboard/Collection'); // Adjust the path as needed to your Collection model

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://techolcademy:m32gdIOIjbETl5q2@cluster0.iuwuq.mongodb.net/project-z';

async function fixCollectionUserLikes() {
  try {
    // Connect to the database
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Successfully connected to MongoDB.');

    // Use updateMany to find all documents and set userLike to an empty array
    const updateResult = await Collection.updateMany(
      {}, // An empty filter to select all documents
      { $set: { userLike: [] } }
    );

    console.log('Migration complete!');
    console.log(`Matched: ${updateResult.matchedCount} documents`);
    console.log(`Modified: ${updateResult.modifiedCount} documents`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Run the migration function
fixCollectionUserLikes();