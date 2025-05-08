export class AccessesModel {
  user: {
    create: boolean;
    update: boolean;
    delete: boolean;
    invite: boolean;
    /**
     * Обновление роли пользователя
     * */
    updateRole: boolean;
    /**
     * Обновление привилегии пользователя
     * */
    updatePrivilege: boolean;
  };
  roles: {
    create: boolean;
    update: boolean;
    delete: boolean;
    /**
     * Доступ на просмотр всего древа
     * */
    seeTree: boolean;
  };
  privileges: {
    create: boolean;
    update: boolean;
    delete: boolean;
    /**
     * Доступ на просмотр списска привелегий
     * */
    seeList: boolean;
  };
  references: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  reservations: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  tasks: {
    create: boolean;
    update: boolean;
    delete: boolean;
    delegate: boolean;
    /**
     * Выполнять чужие задачи
     * */
    performOther: boolean;
  };
  files: {
    file: {
      upload: boolean;
      createEmpty: boolean;
      getContent: boolean;
    };
    document: {
      /**
       * Доступ на просмотр всех документов, тк скорее всего в документах прийдется делать отдельную обработку доступов
       * и галочками или как то еще помечать кто может видеть документ
       * */
      seeAll: boolean;
      upload: boolean;
      createEmpty: boolean;
      getContent: boolean;
      update: boolean;
      delete: boolean;
    };
  };
  codeExecution: {
    scripts: {
      create: boolean;
      update: boolean;
      delete: boolean;
    };
    execution: {
      execute: boolean;
      seeExecutionHistory: boolean;
    };
  };
}
