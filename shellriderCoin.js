class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.inex = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = '';
    }
}