module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
    host: "127.0.0.1",
    port: 7545,
    network_id: "5777",
    gas: 4326474,
	from:'0xf573d743ae941c2444aecd2b19cee8ed34b81319'
    }
  }
};
