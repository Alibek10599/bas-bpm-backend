import { AccessesModel } from '@app/common';

export const accessModel: AccessesModel = {
  user: {
    create: false,
    update: false,
    delete: false,
    invite: false,
    updateRole: false,
    updatePrivilege: false,
  },
  privileges: {
    create: false,
    update: false,
    delete: false,
    seeList: false,
  },
  codeExecution: {
    scripts: {
      create: false,
      update: false,
      delete: false,
    },
    execution: {
      execute: false,
      seeExecutionHistory: false,
    },
  },
  files: {
    file: {
      upload: false,
      createEmpty: false,
      getContent: false,
    },
    document: {
      seeAll: false,
      upload: false,
      createEmpty: false,
      getContent: false,
      update: false,
      delete: false,
    },
  },
  references: {
    create: false,
    update: false,
    delete: false,
  },
  reservations: {
    create: false,
    update: false,
    delete: false,
  },
  roles: {
    create: false,
    update: false,
    delete: false,
    seeTree: false,
  },
  tasks: {
    create: false,
    update: false,
    delete: false,
    delegate: false,
    performOther: false,
  },
};
