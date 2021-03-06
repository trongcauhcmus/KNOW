const KNOW = artifacts.require('KNOW');
const Multisig = artifacts.require("MultiSigWallet");


contract('MultiSigWallet', async accounts => {
    it('create coin for multisig wallet', async() => {
        const instance = await Multisig.deployed();
        console.log(instance.address);

        instance.submitTransaction(instance.address, 0, ["0x3d", "0x03", "0xec", "0x29"], { from: accounts[0] }).then(async(result) => {
            //console.log(result);
            var txncount = await instance.transactionCount.call();
            var tmp = await instance.confirmTransaction(txncount - 1, { from: accounts[1] });
            console.log(tmp);

        }).catch((err) => {
            console.log(err);
        });;
    });
});
contract('KNOW', async accounts => {

    it('addInvestorList() -> removeInvestorList() should do it right', async() => {
        const contract = await KNOW.deployed();
        const address = 0x03747F06215B44E498831dA019B27f53E483599F;

        // Check is a new investor
        let isApproved = await contract.isApprovedInvestor(address);
        assert.equal(isApproved, false, 'Stranger is an approved investor');

        // Add new investor
        await contract.addInvestorList([address]);
        isApproved = await contract.isApprovedInvestor(address);
        assert.equal(isApproved, true, 'Added investor is not approved');

        // Remove new added investor
        await contract.removeInvestorList([address]);
        isApproved = await contract.isApprovedInvestor(address);
        assert.equal(isApproved, false, 'Removed investor is an approved investor');
    });

    it('msg.sender should be the owner of this contract: ', async() => {
        const contract = await KNOW.deployed();
        const owner = await contract.owner.call();
        assert.equal(owner, accounts[0], 'first token is not own by owner');
    });

    it('balance of owner should be 1,000,000,000 * 10^10: ', async() => {
        const contract = await KNOW.deployed();
        const balance = await contract.balanceOf.call(accounts[0]);
        assert.equal(balance, 10 ** 19, 'balance of owner is wrong');
    });

    it('turnOnTradable() should do it right', async() => {
        const accountZero = accounts[0];
        const accountOne = accounts[1];
        const contract = await KNOW.deployed();

        await contract
            .turnOnTradable({ from: accountOne })
            .catch(function(error) {});

        const tradableOne = await contract.tradable.call();
        assert.equal(
            tradableOne,
            false,
            'tradable was turn on not by another address',
        );

        await contract
            .turnOnTradable({ from: accountZero })
            .catch(function(error) {
                console.log('revert detected from owner address');
            });

        const tradableZero = await contract.tradable.call();
        assert.equal(tradableZero, true, 'tradable was not turn on by owner');
    });

    it('transfer should do it right', async() => {
        const accountZero = accounts[0];
        const accountOne = accounts[1];
        const amount = 10 ** 13;

        let accountZeroStartingBalance;
        let accountOneStartingBalance;
        let accountZeroEndingBalance;
        let accountOneEndingBalance;

        const contract = await KNOW.deployed();
        let balance = await contract.balanceOf.call(accountZero);

        accountZeroStartingBalance = balance.toNumber();
        balance = await contract.balanceOf.call(accountOne);
        accountOneStartingBalance = balance.toNumber();

        await contract.transfer(accountOne, amount, { from: accountZero });

        balance = await contract.balanceOf.call(accountZero);
        accountZeroEndingBalance = balance.toNumber();
        balance = await contract.balanceOf.call(accountOne);
        accountOneEndingBalance = balance.toNumber();

        assert.equal(
            accountZeroEndingBalance,
            accountZeroStartingBalance - amount,
            "Amount was't correctly taken from the sender",
        );

        assert.equal(
            accountOneEndingBalance,
            accountOneStartingBalance + amount,
            "Amount wasn't correctly sent to the receiver",
        );
    });
});