export class CheckFileResponseDto {
  /**
   * A name of the file, including extension, without a path. Used for display in user interface (UI), and determining the extension of the file.
   * */
  BaseFileName: string;

  /**
   * The size of the file in bytes (64-bit signed integer).
   * */
  Size: number;

  /**
   * The current version of the file based on the server's file version schema. This value must change when the file changes, and version values must never repeat for a given file.
   * */
  Version: string;

  /**
   * The brand name of the host.
   * */
  BreadcrumbBrandName?: string;

  /**
   * A URI to a web page that the WOPI client should navigate to when the user clicks on UI that displays BreadcrumbBrandName.
   * */
  BreadcrumbBrandUrl?: string;

  /**
   * A file name that the WOPI client displays to the user. If this parameter is not specified, then the BaseFileName parameter is used.
   */
  BreadcrumbDocName?: string;

  /**
   * The name of the container that contains the file.
   * */
  BreadcrumbFolderName?: string;

  /**
   * A URI to a web page that the WOPI client should navigate to when the user clicks on UI that displays BreadcrumbFolderName.
   * */
  BreadcrumbFolderUrl?: string;
}
