import { Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { AppUser, AppUserFilter } from "models/AppUser";
import { useMemo } from "react";
import {
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useDayOffRequestMaster from "./DayOffRequestMasterHook";

/* end individual import */

function DayOffRequestMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeSelectFilter,
    handleChangeDirectionTypeFilter,
    appUserSearchFunc,
    groupSearchFunc,
    directionTypeSearchFunc,
  } = useDayOffRequestMaster();
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
        title: <LayoutHeader orderType="left" title="Ngày nghỉ phép" />,
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
      {
        title: <LayoutHeader orderType="left" title="Chiều di chuyển" />,
        key: nameof(list[0].directionType),
        dataIndex: nameof(list[0].directionType),
        width: 100,
        ellipsis: true,
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
          title="Yêu cầu nghỉ phép"
          breadcrumbItems={["Yêu cầu nghỉ phép", "Danh sách Yêu cầu nghỉ phép"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Yêu cầu nghỉ phép
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <Select
                    label="Tên người dùng"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn người dùng"
                    getList={appUserSearchFunc}
                    render={(item) => item?.username}
                    onChange={handleChangeSelectFilter("user")}
                    value={filter?.user}
                  />
                </Col>
                <Col lg={6}>
                  <Select
                    label="Nhóm đi chung"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn nhóm đi chung"
                    getList={groupSearchFunc}
                    render={(item) => item?.groupName}
                    onChange={handleChangeSelectFilter("carpoolingGroup")}
                    value={filter?.carpoolingGroup}
                  />
                </Col>

                <Col lg={6}>
                  <Select
                    label="Chiều di chuyển"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn chiều di chuyển"
                    getList={directionTypeSearchFunc}
                    onChange={handleChangeDirectionTypeFilter}
                    value={filter?.directionTypeValue}
                  />
                </Col>

                <Col lg={6}></Col>
              </Row>
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
export default DayOffRequestMaster;
