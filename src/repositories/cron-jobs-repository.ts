import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { Observable } from "rxjs";

export type KeyType = string | number;

export class CronJobRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = new URL(API_PREFIX, BASE_API_URL).href;
  }

  public getCronJobs = (filter: any): Observable<AppUser> => {
    return this.http
      .get(
        `cron-jobs?page=${filter?.page}&limit=${
          filter?.limit
        }&filters={"isProcessed":${filter?.isProcessed || null},"type":${
          filter?.type ? `"${filter.type}"` : null
        }}&sort=${filter?.sort}&order=${filter?.order}`
      )
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };

  public triggerCronJob = (id: number): Observable<AppUser> => {
    return this.http
      .put(`cron-jobs/${id}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
}

export const cronJobRepository = new CronJobRepository();
