/**
 * Seed Events from event_data.json
 * Safe to run multiple times (idempotent)
 *
 * Run: node seeds/seedEvents.js
 */

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// DB connection
const connectDB = require('../config/database.config');

// Event model
const Event = require('../models/event');

// Load JSON dynamically
const seedFilePath = path.join(__dirname, 'event_data.json');

if (!fs.existsSync(seedFilePath)) {
  console.error('❌ event_data.json not found in seeds folder');
  process.exit(1);
}

const events = JSON.parse(fs.readFileSync(seedFilePath, 'utf-8'));

async function seedEvents() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    console.log(`📦 Loaded ${events.length} events from event_data.json`);

    let inserted = 0;
    let skipped = 0;

    for (const event of events) {
      // Prevent duplicates using a stable uniqueness rule
      const exists = await Event.findOne({
        title: event.title,
        startAt: new Date(event.startAt)
      });

      if (exists) {
        skipped++;
        continue;
      }

      await Event.create({
        ...event,
        startAt: new Date(event.startAt),
        endAt: new Date(event.endAt),
        registrationDeadline: event.registrationDeadline
          ? new Date(event.registrationDeadline)
          : undefined
      });

      inserted++;
    }

    console.log('✅ Event seeding completed');
    console.log(`➕ Inserted: ${inserted}`);
    console.log(`⏭️ Skipped (already exists): ${skipped}`);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
}

seedEvents();
