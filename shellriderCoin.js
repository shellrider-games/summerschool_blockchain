const { createHash } = require('crypto');

class Transaction {
    constructor(from, to, amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return createHash('sha256').update(
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonce
        ).digest('hex');
    }

    mine(difficulty) {
        while (
            this.hash.substring(0,difficulty) 
            !== Array(difficulty + 1).join('0')
        ){
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.miningReward = 50;
        this.difficulty = 3;
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(
            Date.now(),
            [new Transaction(null, "Alice", this.miningReward)]
        );
    }

    getLatestBlock(){
        return this.chain.slice(-1)[0];
    }

    addBlock(nextBlock) {
        nextBlock.previousHash = this.getLatestBlock().hash;
        nextBlock.mine(this.difficulty);
        this.chain.push(nextBlock);
    }

    minePendingTransactions(rewardAddress){
        const nextBlock = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        nextBlock.mine(this.difficulty);
        console.log(
            `Mined block ${nextBlock.hash} in ${nextBlock.nonce} iterations`
        );
        this.chain.push(nextBlock);
        this.pendingTransactions = [
            new Transaction(null, rewardAddress, this.miningReward)
        ];
    }

    isValid(){
        for(let i = 1; i < this.chain.length; i++){
            const prevBlock = this.chain[i-1];
            const curBlock = this.chain[i];

            if(curBlock.previousHash !== prevBlock.calculateHash()) {
                return false; 
            }
            if(curBlock.hash !== curBlock.calculateHash()) {
                return false;
            }
        }
        return true;
    }

    createTransaction(transaction){
        if(this.getBalance(transaction.from) < transaction.amount){
            console.error(`${ transaction.from } tried to spend more than available`);
            return;
        }
        this.pendingTransactions.push(transaction);
    }

    getBalance(address) {
        let balance = 0;
        this.chain.forEach((block) => {
            block.transactions.forEach((transaction) => {
                if (transaction.to === address) {
                    balance += transaction.amount;
                }
                if (transaction.from === address) {
                    balance -= transaction.amount;
                }
            });
        });
        return balance;
    }

}

let shellriderCoin = new Blockchain();
shellriderCoin.createTransaction(new Transaction("Alice", "Bob", 2));
shellriderCoin.createTransaction(new Transaction("Alice", "Charlie", 1));
shellriderCoin.createTransaction(new Transaction("Charlie", "Bob", 1));
shellriderCoin.minePendingTransactions("Alice");
shellriderCoin.createTransaction(new Transaction("Charlie", "Bob", 1));
shellriderCoin.minePendingTransactions("Charlie");
shellriderCoin.createTransaction(new Transaction('Bob', 'Alice', 1));
shellriderCoin.minePendingTransactions("Charlie");


console.log(`Alice has ${shellriderCoin.getBalance("Alice")} shellriderCoin`);
console.log(`Bob has ${shellriderCoin.getBalance("Bob")} shellriderCoin`);
console.log(`Charlie has ${shellriderCoin.getBalance("Charlie")} shellriderCoin`);
console.log("Chain is valid?", JSON.stringify(shellriderCoin.isValid()));