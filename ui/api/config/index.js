import multer from 'multer'

export const config = {
    SECRET_KEY: 'P@ssw0rd1234',
    MONGO_ENDPOINT: 'mongodb://localhost:27017/users',
    MONGO_OPTIONS: {
        user: 'sa',
        pass: 'P@ssw0rd1234',
        auth: {
            authdb: 'admin'
        }
    },
    API_PORT: 60001,
    GRAPHQL_PORT: 8081,
    AD_CONFIG: {
        url: 'ldap://172.17.9.24',
        baseDN: 'dc=domain,dc=com'
    },
    SQL_MASTER_CONFIG: {
        user: "sa",
        password: "P@ssw0rd1234",
        server: "TC001PCIS1P",
        database: "PCIS_Master",
        requestTimeout: 150000,
    }
}

export const configAccessHeader = (req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type', 'x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //res.setHeader('Charset', 'UTF-8');

    // Pass to next layer of middleware
    next();
}

export const data = {
    "gridAssignment": [
        {
            "key": "1",
            "campaign_date": "20/06/2017",
            "campaign_type": "Doctor",
            "campaign_interest": "2.5%",
            "campaign_expired": "90",
            "cust_source": "FV",
            "cust_loaninterest": "Y",
            "cust_potential": "H",
            "cust_name": "ศิริลักษณ์ เรืองเจริญ",
            "cust_province": "นครศรีธรรมราช",
            "cust_district": "หัวไทร",
            "cust_subdistrict": "หัวไทร",
            "cust_location": "ตลาดหัวไทร",
            "cust_reqloan": "2,000,000"
        },
        {
            "key": "2",
            "campaign_date": "17/06/2017",
            "campaign_type": "Doctor",
            "campaign_interest": "2.5%",
            "campaign_expired": "87",
            "cust_source": "FV",
            "cust_loaninterest": "Y",
            "cust_potential": "M",
            "cust_name": "อุทัยพร สังทรัพย์",
            "cust_province": "นครศรีธรรมราช",
            "cust_district": "เมือง",
            "cust_subdistrict": "ท่าเรือ",
            "cust_location": "เฉลิมพระเกียรติ",
            "cust_reqloan": "1,500,000"
        }
    ],
    "assignmentChart": {
        "CampaignActivity": {
            "labels": [
                "DOCTOR",
                "H4C",
                "7-11",
                "HOTEL"
            ],
            "actual": [
                30,
                50,
                100,
                105
            ]
        },
        "CampaignBMSucess": {
            "labels": [
                "DOCTOR",
                "H4C",
                "7-11",
                "HOTEL"
            ],
            "actual": [
                {
                    "name": "Success",
                    "actual": [
                        5,
                        1,
                        7,
                        2
                    ]
                },
                {
                    "name": "Assign Completed",
                    "actual": [
                        5,
                        1,
                        7,
                        2
                    ]
                }
            ]
        },
        "CampaignRMSucess": {
            "labels": [
                "Buppachat",
                "Walaiporn",
                "Chayapon"
            ],
            "actual": [
                {
                    "name": "App Onhand",
                    "actual": [
                        10,
                        8,
                        10
                    ]
                },
                {
                    "name": "Sucess",
                    "actual": [
                        5,
                        2,
                        7
                    ]
                }
            ]
        },
        "CampaignAppOnhand": {
            "labels": [
                "30D+",
                "60D+",
                "90D+",
                "120D+"
            ],
            "actual": [
                {
                    "name": "App Onhand",
                    "actual": [
                        10,
                        8,
                        10,
                        4,
                        5
                    ]
                }
            ]
        }
    }
}