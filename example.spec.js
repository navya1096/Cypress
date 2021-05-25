let amount;
let priceApi;
const pageObj = require('../page_objects/cash.po.json')
describe('Dashboard', () => {
    it('wallet amounts', () => {
        const login = require('../../common.js');
        login.login();
        //To print the usd wallet amount 
        let usdWalletAmount;
        cy.get(".card-amount-general").eq(0).then(element => {
            usdWalletAmount = element.text().replace(/[$]/g, '').trim();
            console.log(Number(usdWalletAmount));
        })
        //Navigate to Buy/sell module
        cy.get("#navbarTogglerMenu .nav-item").eq(1).click({ force: true });
        cy.wait(6000);
        cy.get(".btn-default-mc").eq(0).click({force:true});
        cy.get(".dropdown-currencies__dropdown__placeholder").click({ force: true });
        cy.get(".dropdown-menu .dropdown-currencies__dropdown__menu__item").eq(0).click({ force: true });
        cy.wait(5000);
        cy.get("#dropdownFiatWalletButton").click({ force: true });
        cy.get(".dropdown-menu .w-100").eq(6).click({ force: true });
        //validate the USD wallet amount
        cy.get(".dropdown-menu .w-100").eq(6).then(element => {
            const buyUsdWallet = element.text().replace(/[A-Z,a-z$:]/g, '').trim();
            console.log(Number(buyUsdWallet));
            expect(buyUsdWallet).to.equal(usdWalletAmount);
        })
        cy.wait(3000);
        //validate the EUR wallet amount
        cy.get(pageObj.buy_sell.euro_wallets).click({ force: true });
        cy.get(pageObj.buy_sell.select_euro).eq(1).click({ force: true });
        cy.get(pageObj.buy_sell.select_wallet).click({ force: true });
        cy.get(pageObj.buy_sell.select_euro_wallet).click({ force: true });
    });
    it('validating the EUR wallet amount', () => {
        //validate the EUR wallet amount
        cy.get(pageObj.buy_sell.select_euro_wallet).then(element => {
            const buyEurWallet = element.text().split('€')[1].replace(/[,]/g, '').trim();
            console.log(Number(buyEurWallet));
        })
    });
    it('Validating the entered EUR amount', () => {
        //Enter the amount
        cy.get(pageObj.buy_sell.enter_eur_amount).eq(0).click({ force: true });
        cy.get(pageObj.buy_sell.enter_eur_amount).eq(0).clear().type('20');
        cy.get(pageObj.buy_sell.enter_eur_amount).eq(0).invoke('val').then((value) => {
            amount = Number(value.replace(/[,]/g, ''));
            console.log(Number(amount));
            expect(amount).to.equal(20);
        })
        cy.wait(3000);
        //Validate the priceApi BTC amount from API
        cy.request('https://api-cash.mercurydev.tk/api/price').then((response) => {
            expect(response.status).to.eq(200);
            priceApi = response.body.data.EUR.BTC.buy;
            console.log(Number(priceApi));
        })
    });
    it('dividing the two numbers', () => {
        const totalValue = amount / priceApi;
        console.log(Number(totalValue));
    })
    it('Validating the both entered and divided amount', () => {
        cy.get(pageObj.buy_sell.btc_amount).eq(0).invoke('val').then((value) => {
            btcAmount = Number(value.replace(/[,]/g, ''));
            console.log(Number(btcAmount));
            expect(btcAmount).to.equal(totalValue);
        })
    })
    /*it('validating the ETH wallet amount', () => {
        //Move to dashboard
        cy.get(pageObj.eth.dashboard_nav).eq(0).click();
        //Validate the ETH wallet amount
        cy.wait(4000);
        cy.get(pageObj.eth.eth_wallet).eq(0).then(element => {  
            const ethWallet=element.text().replace(/[A-Z]/g, '').trim();
            console.log(Number(ethWallet));
        })

    });*/

    //Navigate to contacts
    // cy.get(".nav-link").eq(5).click();
    //cy.wait(5000);
    //Get all the rows and delete one contact from the list
    /*cy.get(".table-responsive tbody tr").each((row) => {
        const userName = row[0].querySelector('td:nth-child(3)').innerText;
        if (userName === 'navya@calibraint.com') {
            row[0].querySelector('.w-100 .crud a:nth-child(3)').click({force: true});
        }
        cy.get(".btn-continue").eq(1).click();
        cy.get(".mt-5").click();
    })*/
    //Navigate to settings dropdown menu
    /*cy.get(pageObj.dashboard_settings.mercury_cash_settings).click();
    cy.get(pageObj.dashboard_settings.settings_click).eq(0).click();
    //length of the settings dropdown menu
    cy.get(pageObj.dashboard_settings.settings_collapse).should('have.length', 4);*/
})