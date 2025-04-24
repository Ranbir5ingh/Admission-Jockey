const axios = require('axios');

const CONSUL_BASE_URL = process.env.CONSUL_URL || 'http://localhost:8500/v1/catalog/service';

async function getServiceInstances(serviceName) {
  try {
    const response = await axios.get(CONSUL_BASE_URL + '/' + serviceName);
    return response.data.map(instance => ({
      address: instance.ServiceAddress || instance.Address,
      port: instance.ServicePort
    }));
  } catch (error) {
    console.error('Error fetching service instances from Consul:', error.message);
    return [];
  }
}

module.exports = {
  getServiceInstances
};
