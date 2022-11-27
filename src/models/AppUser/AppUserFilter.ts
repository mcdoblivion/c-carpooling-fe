import { StringFilter } from "react3l-advanced-filters";
import { ModelFilter } from "react3l-common";

export class AppUserFilter extends ModelFilter {
  public search?: string = "";
  public name?: StringFilter = new StringFilter();
  public userId?: number = null;
  public id?: any;
  public carpoolingGroupId?: number = null;
  public page?: number = 1;
  public filters?: any;
  public limit?: number = 10;
  public sort?: string = "updatedAt";
  public order?: string = "DESC";
}
