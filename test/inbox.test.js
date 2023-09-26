const {Web3}=require("web3")
const ganache=require("ganache"); //local ethereum test network
const assert=require("assert");
const { beforeEach } = require("mocha");
const {abi,evm} =require("../compile");

const web3=new Web3(ganache.provider());
let fetchedAccounts;
let inbox;
beforeEach(async ()=>{
    //get the list of all accounts
    fetchedAccounts=await web3.eth.getAccounts();
    // use one of those accounts to deploy the contract
    inbox=await new web3.eth.Contract(abi).deploy({data:evm.bytecode.object,arguments:['Hi There']}).send({from:fetchedAccounts[0],gas:'1000000'});
    console.log(inbox);

})

describe("Inbox",()=>{
    it("deploys a contract",()=>{
        assert.ok(inbox.options.address);
    })

    it("has a default message",async ()=>{
        const message=await inbox._methods.message().call();
        assert.equal(message,"Hi There");
    })

    it("can change the message",async()=>{
        await inbox._methods.setMessage("bye").send({from:fetchedAccounts[0],gas:'1000000'});
        const message=await inbox._methods.message().call();
        assert.equal(message,"bye");
    })
})



// class Car{
//     park(){
//         return "stopped";
//     }

//     drive(){
//         return "vroom";
//     }
// }

// let car;

// beforeEach(()=>{
//     car=new Car();
// }); //beforeEach is a mocha function

// describe("Car",()=>{
//     it("can park",()=>{
//         assert.equal(car.park(),"stopped");
//     })
//     it("can drive",()=>{
//         assert.equal(car.drive(),"vroom");
//     })
// })
