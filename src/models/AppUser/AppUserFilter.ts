import { ModelFilter } from "react3l-common";

export class AppUserFilter extends ModelFilter {
  public search?: string = "";
  public page?: number = 1;
  public limit?: number = 10;
  public sort?: string = "updatedAt";
  public order?: string = "DESC";
}
