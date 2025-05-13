export const AUTH_SERVICE_GRPC = {
  serverUrl: '0.0.0.0:50051',
  clientUrl: 'auth:50051',
  package: ['auth', 'roles', 'privileges'],
  protoFile: ['auth.proto', 'roles.proto', 'privileges.proto'],
};
