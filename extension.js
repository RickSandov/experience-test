module.exports = {
    name: 'ShuferpaXmommst',
    publisher: 'Shu',
    cards: [{
        type: 'ShuferpaXmommstCard',
        source: './src/cards/ShuferpaXmommstCard',
        title: 'XMOMMST Admin',
        displayCardType: 'XMOMMST Admin',
        description: 'Look up and manage XMOMMST access records by Banner ID.',
        configuration: {
            client: [
                {
                    key: 'writeAccessRoles',
                    label: 'Roles with read and write access (comma-separated)',
                    required: true
                },
                {
                    key: 'readAccessRoles',
                    label: 'Roles with read-only access (comma-separated)',
                    required: false
                }
            ],
            server: [
                {
                    key: 'ethosApiKey',
                    label: 'Ethos API Key',
                    type: 'password',
                    required: true
                }
            ]
        },
        pageRoute: {
            route: '/',
            excludeClickSelectors: ['a', 'button']
        }
    }],
    page: {
        source: './src/pages/router.jsx',
        applyCardRoles: true
    }
};
