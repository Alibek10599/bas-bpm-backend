export const AUTH_SERVICE_GRPC = {
  serverUrl: '0.0.0.0:50051',
  clientUrl: 'localhost:50051',
  package: ['auth', 'roles', 'privileges', 'api_tokens'],
  protoFile: [
    'auth.proto',
    'roles.proto',
    'privileges.proto',
    'api_tokens.proto',
  ],
};
