require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.2',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/WV_d7ELxzHLN7Y-yQ6GiHxMOC-eHd5nl',
      accounts: [
        '2929c8d6b6277b8438b0441cdf135f401fb23bcf3bad3ce365217c024b847244',
      ],
    },
  },
}