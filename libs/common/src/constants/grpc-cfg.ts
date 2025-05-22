export const AUTH_SERVICE_GRPC = {
  clientUrl: process.env.AUTH_SERVICE_GRPC_URL || 'localhost:50051',
  package: ['auth', 'roles', 'privileges', 'api_tokens'],
  protoFile: [
    'auth.proto',
    'roles.proto',
    'privileges.proto',
    'api_tokens.proto',
  ],
};
