/* eslint-disable @typescript-eslint/no-unused-vars */
/* begin general import */
import { Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import AdvanceIdFilterMaster from "components/AdvanceFilterMaster/AdvanceIdFilterMaster";
import PageHeader from "components/PageHeader/PageHeader";
import { AppUser, AppUserFilter } from "models/AppUser";
import { useMemo } from "react";
import {
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
  TagFilter,
} from "react3l-ui-library";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";
import { userRepository } from "repositories/user-repository";
import nameof from "ts-nameof.macro";
import useLeaveGroupRequestMaster from "./LeaveGroupRequestMasterHook";

/* end individual import */

function LeaveGroupRequestMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeAllFilter,
    handleChangeAppUserFilter,
    handleChangeGroupFilter,
  } = useLeaveGroupRequestMaster();

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: <LayoutHeader orderType="left" title="Tên người dùng" />,
        key: nameof(list[0].user),
        dataIndex: nameof(list[0].user),
        ellipsis: true,
        width: 150,
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                countCharacters={30}
                value={
                  params[0]?.userProfile?.firstName +
                  " " +
                  params[0]?.userProfile?.lastName
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Tên nhóm" />,
        key: nameof(list[0].carpoolingGroup),
        dataIndex: nameof(list[0].carpoolingGroup),
        width: 100,
        ellipsis: true,
        render(...params: [any, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]?.groupName} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Ngày rời nhóm" />,
        key: nameof(list[0].date),
        dataIndex: nameof(list[0].date),
        ellipsis: true,
        width: 80,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
    ],
    [list]
  );

  return (
    <Spin spinning={loadingList}>
      <div className="page-content">
        <PageHeader
          title="Yêu cầu rời nhóm"
          breadcrumbItems={["Yêu cầu rời nhóm", "Danh sách Yêu cầu rời nhóm"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Yêu cầu rời nhóm
          </div>
          <div className="page-master__content">
            <div className="page-master__tag-filter">
              <TagFilter
                value={filter}
                handleChangeFilter={handleChangeAllFilter}
                onClear={(value: any) => {
                  return 0;
                }}
              />
            </div>
            <div className="page-master__filter-wrapper d-flex align-items-center justify-content-between">
              <div className="page-master__filter d-flex align-items-center justify-content-start">
                <div className="d-flex align-items-center">
                  <div className="">
                    <AdvanceIdFilterMaster
                      placeHolder="Tên người dùng"
                      classFilter={AppUserFilter}
                      onChange={handleChangeAppUserFilter}
                      getList={userRepository.all}
                      render={(item) => item.username}
                      label="Tên người dùng"
                      maxLengthItem={23}
                    />
                  </div>
                  <div className="">
                    <AdvanceIdFilterMaster
                      placeHolder="Nhóm đi chung"
                      classFilter={AppUserFilter}
                      onChange={handleChangeGroupFilter}
                      getList={carpoolingGroupRepository.search}
                      render={(item) => item.groupName}
                      label="Nhóm đi chung"
                      maxLengthItem={23}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="page-master__content-table">
            <StandardTable
              rowKey={nameof(list[0].id)}
              columns={columns}
              dataSource={list}
              isDragable={true}
              tableSize={"md"}
              scroll={{ x: 1000 }}
              onChange={handleTableChange}
            />
            <Pagination
              skip={(filter?.page - 1) * filter?.limit}
              take={filter?.limit}
              total={count}
              onChange={handlePagination}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
export default LeaveGroupRequestMaster;
