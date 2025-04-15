import { IsIn, IsString } from 'class-validator';

export class OnlyOfficeCallbackActionsDto {
  /**
   * 0 - the user disconnects from the document co-editing;
   * 1 - the new user connects to the document co-editing;
   * 2 - the user clicks the forcesave button.
   * */
  @IsIn([0, 1, 2])
  type: 0 | 1 | 2;

  /**
   * The userid field value is the user identifier.
   * */
  @IsString()
  userid: string;
}
