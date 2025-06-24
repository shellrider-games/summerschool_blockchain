const { createHash} = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.inex = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = '';
    }

    calculateHash() {
        return createHash('sha256').update(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data)
        ).digest('hex');
    }
}