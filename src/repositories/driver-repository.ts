import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class DriverRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }
  public getDrivers = (filter: any): Observable<AppUser> => {
    return this.http
      .get(
        `drivers?page=${filter?.page}&limit=${
          filter?.limit
        }&filters={"status":${
          filter.status ? `"${filter?.status}"` : null
        }}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public verify = (id: any, payload: AppUser): Observable<AppUser> => {
    return this.http
      .put(`drivers/${id}`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const driverRepository = new DriverRepository();
