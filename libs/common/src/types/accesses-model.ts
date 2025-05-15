import { IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AccessesModelApiToken {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  delete: boolean;
}

class AccessesModelUser {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
  @IsBoolean()
  invite: boolean;
  /**
   * Обновление роли пользователя
   * */
  @IsBoolean()
  updateRole: boolean;
  /**
   * Обновление привилегии пользователя
   * */
  @IsBoolean()
  updatePrivilege: boolean;
}

class AccessesModelRoles {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
  /**
   * Доступ на просмотр всего древа
   * */
  @IsBoolean()
  seeTree: boolean;
}

class AccessesModelPrivileges {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
  /**
   * Доступ на просмотр списска привелегий
   * */
  @IsBoolean()
  seeList: boolean;
}

class AccessesModelReferences {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
}
class AccessesModelReservations {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
}
class AccessesModelTasks {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
  @IsBoolean()
  delegate: boolean;
  /**
   * Выполнять чужие задачи
   * */
  @IsBoolean()
  performOther: boolean;
}

class AccessesModelFilesFile {
  @IsBoolean()
  upload: boolean;
  @IsBoolean()
  createEmpty: boolean;
  @IsBoolean()
  getContent: boolean;
}
class AccessesModelFilesDocument {
  /**
   * Доступ на просмотр всех документов, тк скорее всего в документах прийдется делать отдельную обработку доступов
   * и галочками или как то еще помечать кто может видеть документ
   * */
  @IsBoolean()
  seeAll: boolean;
  @IsBoolean()
  upload: boolean;
  @IsBoolean()
  createEmpty: boolean;
  @IsBoolean()
  getContent: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
}

class AccessesModelFiles {
  @ValidateNested()
  @Type(() => AccessesModelFilesFile)
  file: AccessesModelFilesFile;
  @ValidateNested()
  @Type(() => AccessesModelFilesDocument)
  document: AccessesModelFilesDocument;
}

class AccessesModelCodeExecutionScripts {
  @IsBoolean()
  create: boolean;
  @IsBoolean()
  update: boolean;
  @IsBoolean()
  delete: boolean;
}
class AccessesModelCodeExecutionExecutions {
  @IsBoolean()
  execute: boolean;
  @IsBoolean()
  seeExecutionHistory: boolean;
}

class AccessesModelCodeExecution {
  @ValidateNested()
  @Type(() => AccessesModelCodeExecutionScripts)
  scripts: AccessesModelCodeExecutionScripts;

  @ValidateNested()
  @Type(() => AccessesModelCodeExecutionExecutions)
  execution: AccessesModelCodeExecutionExecutions;
}

export class AccessesModel {
  @ValidateNested()
  @Type(() => AccessesModelApiToken)
  apiToken: AccessesModelApiToken;

  @ValidateNested()
  @Type(() => AccessesModelUser)
  user: AccessesModelUser;

  @ValidateNested()
  @Type(() => AccessesModelRoles)
  roles: AccessesModelRoles;

  @ValidateNested()
  @Type(() => AccessesModelPrivileges)
  privileges: AccessesModelPrivileges;

  @ValidateNested()
  @Type(() => AccessesModelReferences)
  references: AccessesModelReferences;

  @ValidateNested()
  @Type(() => AccessesModelReservations)
  reservations: AccessesModelReservations;

  @ValidateNested()
  @Type(() => AccessesModelTasks)
  tasks: AccessesModelTasks;

  @ValidateNested()
  @Type(() => AccessesModelFiles)
  files: AccessesModelFiles;

  @ValidateNested()
  @Type(() => AccessesModelCodeExecution)
  codeExecution: AccessesModelCodeExecution;
}
