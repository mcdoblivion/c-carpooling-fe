import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class DayOffRequestRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }
  public getDayOffRequests = (filter: any): Observable<AppUser> => {
    return this.http
      .get(
        `day-off-requests?page=${filter?.page}&limit=${
          filter?.limit
        }&filters={"userId":${filter?.userId || null},"carpoolingGroupId":${
          filter?.carpoolingGroupId || null
        },"directionType":${
          filter.directionType ? `"${filter?.directionType}"` : null
        }}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public delete = (id: any): Observable<AppUser> => {
    return this.http
      .delete(`day-off-requests/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public create = (payload: AppUser): Observable<AppUser> => {
    return this.http
      .post(`day-off-requests`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public update = (payload: AppUser): Observable<AppUser> => {
    return this.http
      .put(`day-off-requests/${payload.id}`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public save = (payload: AppUser): Observable<AppUser> => {
    return payload.id ? this.update(payload) : this.create(payload);
  };
}

export const dayOffRequestRepository = new DayOffRequestRepository();
