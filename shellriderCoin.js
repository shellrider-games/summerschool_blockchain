const { createHash } = require('crypto');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return createHash('sha256').update(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).digest('hex');
    }

    mine(difficulty) {
        while (this.hash.substring(0,difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block minded: ${this.hash} in ${this.nonce} iterations`);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "24.06.2025", "Genesis Block");
    }

    getLatestBlock(){
        return this.chain.slice(-1)[0];
    }

    addBlock(nextBlock) {
        nextBlock.previousHash = this.getLatestBlock().hash;
        nextBlock.mine(this.difficulty);
        this.chain.push(nextBlock);
    }

    isValid(){
        for(let i = 1; i < this.chain.length; i++){
            const prevBlock = this.chain[i-1];
            const curBlock = this.chain[i];

            if(curBlock.previousHash !== prevBlock.calculateHash()) { return false; }
            if(curBlock.hash !== curBlock.calculateHash()) { return false; }
        }
        return true;
    }

}

let shellriderCoin = new Blockchain();
shellriderCoin.addBlock(new Block(1, "24.06.2025", { amount : 5 }));
shellriderCoin.addBlock(new Block(2, "24.06.2025", { amount : 8 }));
shellriderCoin.addBlock(new Block(3, "24.06.2025", { amount : 13 }));

console.log(JSON.stringify(shellriderCoin, null, 4));
console.log("Chain is valid?", JSON.stringify(shellriderCoin.isValid()));