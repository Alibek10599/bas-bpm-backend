import {
  IsArray,
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OnlyOfficeCallbackActionsDto } from '@app/common/api/only-office/src/api/dto/only-office-callback-actions.dto';

export class OnlyOfficeCallbackDto {
  /**
   *   1 - document is being edited;
   *
   *   2 - document is ready for saving;
   *
   *   3 - document saving error has occurred;
   *
   *   4 - document is closed with no changes;
   *
   *   6 - document is being edited, but the current document state is saved;
   *
   *   7 - error has occurred while force saving the document.
   * */
  @IsIn([1, 2, 3, 4, 5, 6, 7])
  status: 1 | 2 | 3 | 4 | 6 | 7;

  /**
   * Defines the edited document identifier.
   * */
  @IsString()
  key: string;

  /**
   * Defines the list of the identifiers of the users who opened the document for editing;
   * when the document has been changed the users will return the identifier of the user who was the last to edit the document (for status 2 and status 6 replies).
   * */
  @IsString({ each: true })
  users: string;

  /**
   * Defines the link to the edited document to be saved with the document storage service.
   * The link is present when the status value is equal to 2, 3, 6 or 7 only.
   * */
  @IsOptional()
  @IsString()
  url?: string;

  /**
   * Defines the link to the file with the document editing data used to track and display
   * the document changes history. The link is present when the status value is equal to 2, 3, 6, or 7.
   * The file must be saved and its address must be sent as changesUrl parameter using the setHistoryData method
   * to show the changes corresponding to the specific document version.
   * */
  @IsOptional()
  @IsString()
  changesurl?: string;

  @IsOptional()
  @IsISO8601()
  lastsave?: string;

  @IsOptional()
  @IsString()
  filetype?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnlyOfficeCallbackActionsDto)
  actions: OnlyOfficeCallbackActionsDto[];
}
