const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const nookItemScheme = mongoose.Schema({
    type: ObjectId,
    name: {
        type: String,
    },
    itemType: {
        type: String,
        unique: true,
    }
});

// Mock enums for easier usability
const NookItemsType = {
    TREE: "tree",
    FURNITURE: "furniture",
    FRUIT: "fruit",
    TOOL: "tool",
    CLOTHING: "clothing",
    HAT: "hat",
    GLASSES: "glasses",
    FLOWER: "flower",
    FISH: "fish",
    INSECT: "insect",
    // OTHERS in general
    COLLECTIBLE: "collectible"
    
}

module.exports = mongoose.model('NookItem', nookItemScheme);
