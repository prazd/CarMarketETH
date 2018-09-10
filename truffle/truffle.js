module.exports = {
    networks: {
        ganache: {
            host: '127.0.0.1',
            port:8545,
            network_id: 5777,
            gas: 6721975
        },
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        },
        migrations_directory: './migrations'
    }
};
