const BigNumber = require("bignumber.js");

const fs = require("fs");
const file = fs.createWriteStream("./deploy-logger.js", { 'flags': 'w'});
let logger = new console.Console(file, file);

const decimalStr = (value) => {
  return new BigNumber(value).multipliedBy(10 ** 18).toFixed(0, BigNumber.ROUND_DOWN)
}

const MAX = ethers.BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'


async function main() {
  // We get the contract to deploy
    [deployer, alice, bob] = await ethers.getSigners()
    deployer.name = 'deployer'
    alice.name = 'alice'
    bob.name = 'bob'

    // usdt = await (await ethers.getContractFactory('TERC20')).deploy('Test USDT', 'USDT', 6)
    // BUSD
    usdt = await ethers.getContractAt('TERC20', "0x2ebE70929bC7D930248040f54135dA12f458690C")
    pricing = await (await ethers.getContractFactory('LinearPricing')).deploy()
    await new Promise(resolve => setTimeout(resolve, 2000))
    everlastingOptionPricing = await (await ethers.getContractFactory('EverlastingOptionPricing')).deploy()
    await new Promise(resolve => setTimeout(resolve, 2000))
    lToken = await (await ethers.getContractFactory('LTokenOption')).deploy('Deri Liquidity Token', 'DLT')
    await new Promise(resolve => setTimeout(resolve, 2000))
    pToken = await (await ethers.getContractFactory('PTokenOption')).deploy('Deri Position Token', 'DPT')
    await new Promise(resolve => setTimeout(resolve, 2000))
    pool = await (await ethers.getContractFactory('EverlastingOption')).deploy(
        pricing.address,
        everlastingOptionPricing.address,
        [
            decimalStr("0.1"),  // minInitialMarginRatio
            decimalStr("0.05"),  // minMaintenanceMarginRatio
            decimalStr("10"),    // minLiquidationReward
            decimalStr("1000"),   // maxLiquidationReward
            decimalStr("0.5"),  // liquidationCutRatio
            decimalStr("0.2")   // protocolFeeCollectRatio
        ],
        [
            usdt.address,     // bTokenAddress
            lToken.address,   // lTokenAddress
            pToken.address,   // pTokenAddress
            ZERO_ADDRESS,     // liquidatorQualifierAddress
            deployer.address, // protocolFeeCollector
        ]
    )
    await new Promise(resolve => setTimeout(resolve, 2000))

    logger.log("deployer", deployer.address)
    logger.log("usdt.address", usdt.address)
    logger.log("lToken.address", lToken.address)
    logger.log("pToken.address", pToken.address)
    logger.log("pricing.address", pricing.address)
    logger.log("pool.address", pool.address)


    await lToken.setPool(pool.address)
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pToken.setPool(pool.address)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // oracleBTCUSD = await ethers.getContractAt("SymbolOracleWoo", "0x78Db6d02EE87260a5D825B31616B5C29f927E430")
    // oracleETHUSD = await ethers.getContractAt("SymbolOracleWoo", "0xdF0050D6A07C19C6F6505d3e66B68c29F41edA09")
    
    oracleBTCUSD_address = "0x18C036Ee25E205c224bD78f10aaf78715a2B6Ff1"
    oracleETHUSD_address = "0x073C99954e1cf5eb6f4Ef6f1B7FF21ACf735Ee6A"
    volatilityOracleBTC_address = "0x7A4701A1A93BB7692351aEBcD4F5Fab1d4377BBc"
    volatilityOracleETH_address = "0xF03fDB7193826E11310DE6e297826c4E29E898B9"
    

    logger.log("volatilityOracleBTC_address", volatilityOracleBTC_address)
    logger.log("volatilityOracleETH_address", volatilityOracleETH_address)
    console.log("volatilityOracleETH_address", volatilityOracleETH_address)

    await pool.addSymbol(
        0, 'BTCUSD-20000-C',
        decimalStr("20000"), // strikePrice
        true, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
        )

    console.log("volatilityOracleETH_address", volatilityOracleETH_address)

    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        1, 'BTCUSD-30000-C',
        decimalStr("30000"), // strikePrice
        true, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
        )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        2, 'BTCUSD-40000-C',
        decimalStr("40000"), // strikePrice
        true, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
        )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        3, 'BTCUSD-20000-P',
        decimalStr("20000"), // strikePrice
        false, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        4, 'BTCUSD-30000-P',
        decimalStr("30000"), // strikePrice
        false, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        5, 'BTCUSD-40000-P',
        decimalStr("40000"), // strikePrice
        false, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        6, 'ETHUSD-1500-C',
        decimalStr("1500"), // strikePrice
        true, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        7, 'ETHUSD-2000-C',
        decimalStr("2000"), // strikePrice
        true, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        8, 'ETHUSD-2500-C',
        decimalStr("2500"), // strikePrice
        true, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        9, 'ETHUSD-1500-P',
        decimalStr("1500"), // strikePrice
        false, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        10, 'ETHUSD-2000-P',
        decimalStr("2000"), // strikePrice
        false, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )
    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        11, 'ETHUSD-2500-P',
        decimalStr("2500"), // strikePrice
        false, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )

    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        12, 'BTCUSD-50000-C',
        decimalStr("50000"), // strikePrice
        true, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )

    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        13, 'BTCUSD-60000-C',
        decimalStr("60000"), // strikePrice
        true, // isCall
        oracleBTCUSD_address,
        volatilityOracleBTC_address,
        decimalStr("0.01"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )


    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        14, 'ETHUSD-3500-C',
        decimalStr("3500"), // strikePrice
        true, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )

    await new Promise(resolve => setTimeout(resolve, 2000))
    await pool.addSymbol(
        15, 'ETHUSD-4000-C',
        decimalStr("4000"), // strikePrice
        true, // isCall
        oracleETHUSD_address,
        volatilityOracleETH_address,
        decimalStr("0.1"),
        decimalStr("0.005"),
        decimalStr("0.01") // K
    )



    logger.log("oracleBTCUSD", oracleBTCUSD_address)
    logger.log("oracleETHUSD", oracleETHUSD_address)
    logger.log("volatilityOracleBTC", volatilityOracleBTC_address)
    logger.log("volatilityOracleETH", volatilityOracleETH_address)



    logger.log("aa")
    // for (account of [deployer, alice, bob]) {
    //     await usdt.mint(account.address, decimalStr(100000))
    //     await usdt.connect(account).approve(pool.address, MAX)
    //     logger.log('mint to', account.name)
    // }
    // logger.log("finish")

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });