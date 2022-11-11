import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class LeaveGroupRequestRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }
  public getLeaveGroupRequests = (filter: any): Observable<AppUser> => {
    return this.http
      .get(
        `leave-group-requests?page=${filter?.page}&limit=${
          filter?.limit
        }&filters={"userId":${filter?.userId || null},"carpoolingGroupId":${
          filter?.carpoolingGroupId || null
        }}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const leaveGroupRequestRepository = new LeaveGroupRequestRepository();
