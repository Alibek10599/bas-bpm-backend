export const ROLES_SERVICE_GRPC = {
  serverUrl: '0.0.0.0:50057',
  clientUrl: 'auth:50057',
  package: ['roles', 'privileges'],
  protoFile: ['roles.proto', 'privileges.proto'],
};
