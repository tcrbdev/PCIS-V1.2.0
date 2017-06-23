export const columns = [
    {
        title: 'Campaign',
        dataIndex: 'campaign',
        key: 'campaign',
        className: 'text_upper',
        width: 300,
        children: [
            {
                title: 'Date',
                dataIndex: 'campaign_date',
                key: 'campaign_date',
                className: 'text_upper text-center',
                width: 100
            },
            {
                title: 'Type',
                dataIndex: 'campaign_type',
                key: 'campaign_type',
                className: 'text_upper text-center',
                width: 100
            },
            {
                title: 'Interest',
                dataIndex: 'campaign_interest',
                key: 'campaign_interest',
                className: 'text_upper text-center',
                width: 70
            },
            {
                title: 'Expired Day',
                dataIndex: 'campaign_expired',
                key: 'campaign_expired',
                className: 'text_upper text-center',
                width: 100
            }
        ]
    },
    {
        title: 'Customer Information',
        dataIndex: 'customer_info',
        key: 'customer_info',
        className: 'text_upper',
        width: 500,
        children: [
            {
                title: 'Source',
                dataIndex: 'cust_source',
                key: 'cust_source',
                className: 'text-center',
                width: 40
            },
            {
                title: 'Interest',
                dataIndex: 'cust_loaninterest',
                key: 'cust_loaninterest',
                className: 'text-center',
                width: 40
            },
            {
                title: 'Potential',
                dataIndex: 'cust_potential',
                key: 'cust_potential',
                className: 'text-center',
                width: 40
            },
            {
                title: 'Customer',
                dataIndex: 'cust_name',
                key: 'cust_name',
                className: 'text_upper text-center',
                width: 150
            },
            {
                title: 'Area Information',
                dataIndex: 'cust_zoneinfo',
                key: 'cust_zoneinfo',
                className: 'text_upper text-center',
                width: 300,
                children: [
                    {
                        title: 'Province',
                        dataIndex: 'cust_province',
                        key: 'cust_province',
                        className: 'text_upper text-center',
                        width: 100
                    },
                    {
                        title: 'District',
                        dataIndex: 'cust_district',
                        key: 'cust_district',
                        className: 'text_upper text-center',
                        width: 100
                    },
                    {
                        title: 'Sub-District',
                        dataIndex: 'cust_subdistrict',
                        key: 'cust_subdistrict',
                        className: 'text_upper text-center',
                        width: 150
                    },
                    {
                        title: 'Business Location',
                        dataIndex: 'cust_location',
                        key: 'cust_location',
                        className: 'text_upper text-center',
                        width: 150
                    }
                ]
            },
            {
                title: 'Request Loan',
                dataIndex: 'cust_reqloan',
                key: 'cust_reqloan',
                className: 'text_upper text-center',
                width: 100
            },
            {
                title: 'Assign',
                dataIndex: 'assign_tool',
                key: 'assign_tool',
                className: 'text_upper text-center',
                width: 60                
            }   
        ]
    }
]