import { API_PREFIX } from "config/api-consts";
import { BASE_API_URL } from "config/consts";
import { httpConfig } from "config/http";
import { AppUser } from "models/AppUser";
import { Repository } from "react3l-common";
import { map, Observable } from "rxjs";

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
  public getDriver = (filter: any): Observable<AppUser> => {
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
  public getVehicle = (id: number): Observable<AppUser> => {
    return this.http
      .get(`drivers/${id}/vehicles`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public deleteVehicle = (
    id: number,
    vehicleId: number
  ): Observable<AppUser> => {
    return this.http
      .delete(`drivers/${id}/vehicles/${vehicleId}`)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public createVehicle = (
    id: number,
    payload: AppUser
  ): Observable<AppUser> => {
    return this.http
      .post(`drivers/${id}/vehicles`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public updateVehicle = (
    id: number,
    vehicleId: number,
    payload: AppUser
  ): Observable<AppUser> => {
    return this.http
      .put(`drivers/${id}/vehicles/${vehicleId}`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public saveVehicle = (
    id: number,
    vehicleId: number,
    payload: AppUser
  ): Observable<AppUser> => {
    return vehicleId
      ? this.updateVehicle(id, vehicleId, payload)
      : this.createVehicle(id, payload);
  };
  public mainVehicle = (id: number, vehicleId: number): Observable<AppUser> => {
    return this.http
      .put(`drivers/${id}/main-vehicle`, { vehicleId })
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public verify = (id: any, payload: AppUser): Observable<AppUser> => {
    return this.http
      .put(`drivers/${id}`, payload)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public create = (info: any): Observable<AppUser> => {
    return this.http
      .post("drivers", info)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public update = (info: any): Observable<AppUser> => {
    return this.http
      .post("drivers", info)
      .pipe(Repository.responseMapToModel<AppUser>(AppUser));
  };
  public uploadImage: any = (files?: any): Observable<any> => {
    const formData: FormData = new FormData();
    formData.append("file", files as Blob);
    return this.http.post("upload-file", formData).pipe(map((r) => [r.data]));
  };
}

export const driverRepository = new DriverRepository();
