/**
 * Create and export configuration variables
 * 
 */

//container for all variables

const environments = {
  // Staging object
  development: {
      httpPORT: 3000,
      httpsPORT:3001,
      envName: 'development',
      hashSecret: 'testKey',
      maxChecks: 5
  },

  // Production object
  production: {
    httpPORT: 5000,
    httpsPORT:5001,
    envName: 'production',
    hashSecret: 'testKey2',
    maxChecks: 5
  }

} // -> end environments
/*************************************** */

// Determine which environment should passed as a command-line
const currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check the current environment exist, if not default development
const envExport = typeof(environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.development;

// export environment
module.exports = envExport;
