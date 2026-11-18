/**
 * Contract-shaped mock data, from ../samples/ (dates and ids cleaned,
 * xmommstMessage added). Banner IDs to try on mocks are in MOCK_IDS.
 */
export const MOCK_IDS = Object.freeze({
    withRecords: '12636344',
    noRecords: '11111111',
    writeFails: '99999999',
    unknown: '00000000'
});

const PEOPLE = {
    [MOCK_IDS.withRecords]: { firstName: 'Ricardo Javier', lastName: 'Sandoval' },
    [MOCK_IDS.noRecords]: { firstName: 'Ana', lastName: 'Lopez' },
    [MOCK_IDS.writeFails]: { firstName: 'Write', lastName: 'Failure' }
};

const RECORDS = [
    {
        id: '974df631-30ec-48e3-ac54-e65bad093d76',
        xbannerId: MOCK_IDS.withRecords,
        xmommstName: 'Javier Sandoval',
        xmommstRelCode: 'M',
        xmommstAccCode: 'B',
        xmommstPin: '1234',
        xmommstMessage: '',
        xmommstStatus: 'true',
        xmommstCreatedDt: '2026-11-18',
        xmommstLastActivityDt: '2026-11-18',
        xmommstLastUpdatedBy: 'Ricardo Javier Sandoval'
    },
    {
        id: '301dc70a-bbae-4ec0-aaa7-07bb7c26a68d',
        xbannerId: MOCK_IDS.withRecords,
        xmommstName: 'Javier Calderon',
        xmommstRelCode: 'O',
        xmommstAccCode: 'D',
        xmommstPin: '5678',
        xmommstMessage: 'Uncle',
        xmommstStatus: 'false',
        xmommstCreatedDt: '2026-11-18',
        xmommstLastActivityDt: '2026-11-18',
        xmommstInactiveDt: '2026-11-18',
        xmommstLastUpdatedBy: 'Ricardo Javier Sandoval'
    },
    {
        id: '6b1f3f5e-2d4c-4a8e-9f0a-1c2b3d4e5f60',
        xbannerId: MOCK_IDS.writeFails,
        xmommstName: 'Maria Failure',
        xmommstRelCode: 'G',
        xmommstAccCode: 'A',
        xmommstPin: '0000',
        xmommstMessage: '',
        xmommstStatus: 'true',
        xmommstCreatedDt: '2026-11-18',
        xmommstLastActivityDt: '2026-11-18',
        xmommstLastUpdatedBy: 'Ricardo Javier Sandoval'
    }
];

const RELATIONSHIPS = [
    { zmomrelRelCode: 'O', zmomrelDesc: 'Other', id: 'f45eefb2-1d80-4a6d-b314-d6c2de1812e4' },
    { zmomrelRelCode: 'M', zmomrelDesc: 'Mother', id: '3a3230f1-1685-40a7-98d5-cb0f96c080bf' },
    { zmomrelRelCode: 'F', zmomrelDesc: 'Father', id: 'e3e647aa-6b29-486d-b8a1-1d6c052b06ac' },
    { zmomrelRelCode: 'S', zmomrelDesc: 'Sibling', id: '2487ce0f-9cc0-4f96-9d3a-2be154f410da' },
    { zmomrelRelCode: 'R', zmomrelDesc: 'Grandparent', id: '72924c76-4c17-4d8b-9cbe-aa3b70b729d1' },
    { zmomrelRelCode: 'G', zmomrelDesc: 'Guardian', id: '11fe8666-02d7-4622-aad2-d1d3975d54ce' }
];

const ACCESS = [
    { zmomaccAccCode: 'E', zmomaccDesc: 'E-Bill (Billing & FinAid)', id: '758f0157-ac1b-462a-aae2-6483138b45ad' },
    { zmomaccAccCode: 'A', zmomaccDesc: 'Academic', id: '45cbdd47-066d-47b9-b74b-c51646947144' },
    { zmomaccAccCode: 'U', zmomaccDesc: 'Unlimited', id: '8535257a-4346-4b1e-8eb6-bc7c38cde264' },
    { zmomaccAccCode: 'D', zmomaccDesc: 'IHS - Data Migration', id: '24e0912d-f531-4e9e-879a-f114141c65d0' },
    { zmomaccAccCode: 'M', zmomaccDesc: 'Billing and Financial Aid', id: '357ac950-aeb7-4e03-9e56-972a15157bb6' },
    { zmomaccAccCode: 'F', zmomaccDesc: 'Financial Aid', id: '1f694ef6-74e4-4292-9b36-63485014f2e0' },
    { zmomaccAccCode: 'B', zmomaccDesc: 'Billing', id: '34152034-c80f-4dcb-8dd2-947312ffd303' }
];

export const FIXTURES = Object.freeze({ people: PEOPLE, records: RECORDS, relationships: RELATIONSHIPS, access: ACCESS });
