/* eslint-disable @typescript-eslint/no-unused-vars */
import { Model } from "react3l-common";
import { Field, MomentField } from "react3l-decorators";
import type { Moment } from "moment";

export class AppUser extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public username?: string;

  @Field(String)
  public displayName?: string;

  @Field(String)
  public avatar?: string;

  @MomentField()
  public birthday?: Moment;
  @Field(String)
  public address?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(Number)
  public currentProjectId?: number;

  @Field(Number)
  public organizationId?: number;

  @Field(Number)
  public statusId?: number;

  @Field(Number)
  public sexId?: number;

  @MomentField()
  public createdAt?: Moment;

  @MomentField()
  public updatedAt?: Moment;

  @MomentField()
  public deletedAt?: Moment;
  @Field(String)
  public rowId?: string;

  @Field(String)
  public signatureUrl?: string;

  @Field(String)
  public department?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(Number)
  public positionId?: number;

  @Field(Number)
  public provinceId?: number;
}
