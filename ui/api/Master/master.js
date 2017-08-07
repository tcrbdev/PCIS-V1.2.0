import sql from 'mssql'
import _ from 'lodash'
import { config } from '../config'

export const MasterProvince = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterProvince")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterAmphur = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterAmphur")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterDistrict = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterDistrict")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterSourceType = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterSourceType")
        })
        .then(result => {
            let response = []
            _.mapKeys(_.groupBy(result.recordset, "GroupSourceCode"), (value, key) => {
                response.push({
                    GroupSourceCode: key,
                    GroupSourceName: value[0].GroupSourceName,
                    SourceItem: _.map(value, item => {
                        return {
                            SourceTypeCode: item.SourceTypeCode,
                            SourceTypeName: item.SourceTypeName,
                            SourceTypeDigit: item.SourceTypeDigit.trim()
                        }
                    })
                })
            })
            res.json(response)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterChannelType = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterChannelType")
        })
        .then(result => {
            let response = []
            _.mapKeys(_.groupBy(result.recordset, "GroupChannelCode"), (value, key) => {
                response.push({
                    ChannelTypeCode: key,
                    GroupChannelName: value[0].GroupChannelName,
                    ChannelItem: _.map(value, item => {
                        return {
                            ChannelTypeCode: item.ChannelTypeCode,
                            ChannelTypeName: item.ChannelTypeName
                        }
                    })
                })
            })
            res.json(response)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterBusinessType = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterBusinessType")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterInterestingProduct = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterInterestingProduct")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterOpportunityCustomer = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterOpportunityCustomer")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterPresentProductType = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterPresentProductType")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterBusinessPrefix = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterBusinessPrefix")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterAppointmentReason = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterAppointmentReason")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterPrefix = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterPrefix")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterBranchTemporary = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("Region", sql.NVarChar, req.body.Region)
                .execute("sp_GetMasterBranch")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterRegion = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterRegion")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterArea = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterArea")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterBranch = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterBranch")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const MasterTargetMarketProvince = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterTargetMarketProvince")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoMarkerMap = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("RegionID", sql.NVarChar, req.body.RegionID)
                .input("AreaID", sql.NVarChar, req.body.AreaID)
                .input("Zone", sql.NVarChar, req.body.Zone)
                .input("BranchCode", sql.NVarChar, req.body.BranchCode)
                .input("BranchType", sql.NVarChar, req.body.BranchType)
                .input("CAName", sql.NVarChar, req.body.CAName)
                .input("MarketName", sql.NVarChar, req.body.MarketName)
                .input("IncludeExitingMarket", sql.NVarChar, req.body.IncludeExitingMarket)
                .input("IncludeKioskMarket", sql.NVarChar, req.body.IncludeKioskMarket)
                .input("IncludePotentialMarket", sql.NVarChar, req.body.IncludePotentialMarket)
                .input("Province", sql.NVarChar, req.body.Province)
                .execute("sp_GetNanoMarkerMap")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoMarketInformation = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("MarketCode", sql.NVarChar, req.params.MarketCode)
                .execute("sp_GetMarketInformation")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoBranchInformation = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("BranchCode", sql.NVarChar, req.params.BranchCode)
                .execute("sp_GetBranchInformation")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoCAInformation = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("BranchCode", sql.NVarChar, req.params.BranchCode)
                .execute("sp_GetMasterCA")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoComplititorProvince = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .execute("sp_GetMasterComplititorProvince")
        })
        .then(result => {
            res.json(result.recordset)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoComplititor = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("District", sql.NVarChar, req.body.District)
                .input("Srisawat", sql.NVarChar, req.body.Srisawat)
                .input("Muangthai", sql.NVarChar, req.body.Muangthai)
                .input("ngerdlor", sql.NVarChar, req.body.ngerdlor)
                .execute("sp_GetMasterComplititor")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}



export const GetNanoProductPerformance = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("RegionID", sql.NVarChar, req.body.RegionID)
                .input("Zone", sql.NVarChar, req.body.Zone)
                .input("BranchCode", sql.NVarChar, req.body.BranchCode)
                .input("CAName", sql.NVarChar, req.body.CAName)
                .input("MarketName", sql.NVarChar, req.body.MarketName)
                .execute("Nano_GET_Product_Preformance")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoTotalSummary = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("RegionID", sql.NVarChar, req.body.RegionID)
                .input("Zone", sql.NVarChar, req.body.Zone)
                .input("BranchCode", sql.NVarChar, req.body.BranchCode)
                .input("CAName", sql.NVarChar, req.body.CAName)
                .input("MarketName", sql.NVarChar, req.body.MarketName)
                .execute("Nano_GET_Total_Summary")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}

export const GetNanoGroupBySummary = (req, res) => {
    const pool = new sql.ConnectionPool(config.SQL_MASTER_CONFIG).connect()
        .then(pool => {
            return pool.request()
                .input("RegionID", sql.NVarChar, req.body.RegionID)
                .input("Zone", sql.NVarChar, req.body.Zone)
                .input("BranchCode", sql.NVarChar, req.body.BranchCode)
                .input("CAName", sql.NVarChar, req.body.CAName)
                .input("MarketName", sql.NVarChar, req.body.MarketName)
                .input("QueryType", sql.NVarChar, req.body.QueryType)
                .execute("Nano_GET_GROUP_BY_Summary")
        })
        .then(result => {
            res.json(result.recordsets)
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
}