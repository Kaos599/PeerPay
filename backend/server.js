const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto'); // Need crypto for hashing

const app = express();
const port = 3001;
const MONGODB_URI = "mongodb+srv://dayal700007:1Knarn5D8gQQ7cx4@kaotic.nzqedtt.mongodb.net/kaotic";

// --- Mongoose Setup ---

mongoose.connect(MONGODB_URI, {
    //useNewUrlParser: true, // Deprecated, removed
    //useUnifiedTopology: true // Deprecated, removed
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    // Ensure Genesis block exists after connection
    ensureGenesisBlock();
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if DB connection fails
});

// Define Block Schema
const blockSchema = new mongoose.Schema({
    index: { type: Number, required: true, unique: true },
    timestamp: { type: Number, required: true },
    data: { type: Object, required: true }, // Store transaction data { sender, recipient, amount }
    previousHash: { type: String, required: true },
    hash: { type: String, required: true, unique: true }
});

// Helper method to calculate hash (attach to schema for consistency)
blockSchema.methods.calculateHash = function() {
    return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).digest('hex');
};

const BlockModel = mongoose.model('Block', blockSchema);

// Function to ensure Genesis Block exists
async function ensureGenesisBlock() {
    try {
        const genesisBlockExists = await BlockModel.findOne({ index: 0 });
        if (!genesisBlockExists) {
            console.log('No Genesis Block found. Creating one...');
            const genesisBlock = new BlockModel({
                index: 0,
                timestamp: Date.now(),
                data: "Genesis Block",
                previousHash: "0",
                hash: crypto.createHash('sha256').update(0 + "0" + Date.now() + JSON.stringify("Genesis Block")).digest('hex') // Calculate initial hash
            });
             // Re-calculate hash using the instance data just to be sure
            genesisBlock.hash = genesisBlock.calculateHash();
            await genesisBlock.save();
            console.log('Genesis Block created.');
        } else {
            console.log('Genesis Block already exists.');
        }
    } catch (error) {
        console.error('Error ensuring Genesis Block:', error);
    }
}


// --- Middleware ---
app.use(cors());
app.use(express.json());


// --- API Endpoints (Refactored for MongoDB) ---

// Get all blocks in the chain (sorted by index)
app.get('/blocks', async (req, res) => {
    try {
        const blocks = await BlockModel.find().sort({ index: 1 }); // Sort ascending by index
        res.json(blocks);
    } catch (error) {
        console.error('Error fetching blocks:', error);
        res.status(500).send('Error fetching blocks from database.');
    }
});

// Add a new block (transaction)
app.post('/mine', async (req, res) => {
    const transactionData = req.body.data;
    if (!transactionData || typeof transactionData !== 'object' || !transactionData.sender || !transactionData.recipient || transactionData.amount == null) {
        return res.status(400).send('Invalid transaction data payload. Required fields: sender, recipient, amount.');
    }

    try {
        // Get the latest block from the database to find the previous hash and index
        const latestBlock = await BlockModel.findOne().sort({ index: -1 }); // Sort descending

        if (!latestBlock) {
            // Should not happen if ensureGenesisBlock works, but handle defensively
            return res.status(500).send('Blockchain not initialized properly. Genesis block missing.');
        }

        const newIndex = latestBlock.index + 1;
        const newTimestamp = Date.now();
        const newPreviousHash = latestBlock.hash;

        const newBlock = new BlockModel({
            index: newIndex,
            timestamp: newTimestamp,
            data: transactionData,
            previousHash: newPreviousHash,
            hash: '' // Placeholder, will calculate next
        });

        // Calculate the hash for the new block
        newBlock.hash = newBlock.calculateHash();

        // Save the new block to the database
        await newBlock.save();

        console.log('Transaction Block added:', newBlock);
        res.status(201).send(newBlock);

    } catch (error) {
        console.error('Error mining block:', error);
        // Handle potential duplicate key errors if hashing goes wrong or race condition
        if (error.code === 11000) { // Duplicate key error code
             res.status(409).send('Conflict: A block with the same index or hash likely already exists.');
        } else {
             res.status(500).send('Error saving block to database.');
        }
    }
});

// Endpoint to check chain validity
app.get('/validate', async (req, res) => {
    try {
        const chain = await BlockModel.find().sort({ index: 1 });

        if (chain.length === 0) {
            return res.json({ isValid: true, message: "Chain is empty." });
        }

        // Check Genesis block
        if (chain[0].index !== 0 || chain[0].previousHash !== '0') {
             return res.json({ isValid: false, message: "Invalid Genesis Block." });
        }
         if (chain[0].hash !== chain[0].calculateHash()) {
             return res.json({ isValid: false, message: `Genesis block hash invalid.` });
        }

        // Check the rest of the chain
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const previousBlock = chain[i - 1];

            // Check hash recalculation
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return res.json({ isValid: false, message: `Block ${currentBlock.index} hash is invalid.` });
            }

            // Check link to previous block
            if (currentBlock.previousHash !== previousBlock.hash) {
                return res.json({ isValid: false, message: `Block ${currentBlock.index} previousHash does not match Block ${previousBlock.index} hash.` });
            }

            // Check index order
             if (currentBlock.index !== previousBlock.index + 1) {
                 return res.json({ isValid: false, message: `Block ${currentBlock.index} index out of order.` });
            }
        }

        res.json({ isValid: true, message: "Chain is valid." });

    } catch (error) {
        console.error('Error validating chain:', error);
        res.status(500).send('Error validating blockchain.');
    }
});

// Start the server (Connection logic moved above)
app.listen(port, () => {
    console.log(`Blockchain backend server running at http://localhost:${port}`);
    // No need to add initial blocks here anymore, handled by ensureGenesisBlock
}); 