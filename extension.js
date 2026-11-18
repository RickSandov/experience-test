module.exports = {
    name: 'ShuferpaXmommst',
    publisher: 'Sample',
    cards: [{
        type: 'ShuferpaXmommstCard',
        source: './src/cards/ShuferpaXmommstCard',
        title: 'ShuferpaXmommst Card',
        displayCardType: 'ShuferpaXmommst Card',
        description: 'This is an introductory card to the Ellucian Experience SDK',
        pageRoute: {
            route: '/',
            excludeClickSelectors: ['a']
        }
    }],
    page: {
        source: './src/page/router.jsx',
        applyCardRoles: true
    }
};