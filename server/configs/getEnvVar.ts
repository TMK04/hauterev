const getEnvVar = (var_key: string) => <string>process.env[var_key];

export default getEnvVar;
