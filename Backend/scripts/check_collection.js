require('dotenv').config();
const mongoose = require('mongoose');
require('../models/marketing-dashboard/Collection');

async function checkCollection() {
  try {
    await mongoose.connect(process.env.MONGO_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const Collection = mongoose.model('Collection');
    
    // Find the collection by slug conversion
    const collections = await Collection.find({}).select('title restaurants status');
    console.log('\n=== All Collections ===');
    collections.forEach(col => {
      console.log(`Title: ${col.title}, Restaurants: ${col.restaurants.length}, Status: ${col.status}`);
    });
    
    // Find night-time collection specifically
    console.log('\n=== Night Time Collection Detail ===');
    const nightCollection = await Collection.findOne({
      title: /night.*time/i
    });
    
    if (nightCollection) {
      console.log('Found:', JSON.stringify(nightCollection, null, 2));
    } else {
      console.log('Night Time collection not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCollection();
