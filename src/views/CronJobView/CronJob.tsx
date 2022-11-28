import { Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { formatDate } from "helpers/date-time";
import { formatNumber } from "helpers/number";
import { renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Moment } from "moment";
import { useMemo } from "react";
import {
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";

import nameof from "ts-nameof.macro";
import useCronJob from "./CronJobHook";

/* end individual import */

function CronJob() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeStatusFilter,
    statusSearchFunc,
  } = useCronJob();

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: <div className="text-center gradient-text">STT</div>,
        key: "index",
        width: 40,
        align: "center",
        render: renderMasterIndex<AppUser>(),
      },
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
        title: <LayoutHeader orderType="left" title="Ngày" />,
        key: nameof(list[0].date),
        dataIndex: nameof(list[0].date),
        ellipsis: true,
        width: 80,
        render(...params: [Moment, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatDate(params[0])} />
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
      {
        title: <LayoutHeader orderType="left" title="Trạng thái" />,
        key: nameof(list[0].isAbsent),
        dataIndex: nameof(list[0].isAbsent),
        width: 100,
        ellipsis: true,
        render(...params: [boolean, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0] ? "Nghỉ phép" : "Có tham gia"} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Chi phí đi chung" />,
        key: nameof(list[0].carpoolingFee),
        dataIndex: nameof(list[0].carpoolingFee),
        width: 100,
        ellipsis: true,
        render(...params: [number, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatNumber(params[0]) + " VNĐ"} />
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
          title="Quản lý tác vụ"
          breadcrumbItems={["Quản lý tác vụ", "Danh sách tác vụ"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách tác vụ được lập lịch tự động
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={5}>
                  <Select
                    label="Loại tác vụ"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn loại tác vụ"
                    getList={statusSearchFunc}
                    onChange={handleChangeStatusFilter}
                    value={filter?.statusValue}
                    isEnumerable
                  />
                </Col>
                <Col lg={5}>
                  <Select
                    label="Trạng thái xử lý"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn trạng thái xử lý"
                    getList={statusSearchFunc}
                    onChange={handleChangeStatusFilter}
                    value={filter?.statusValue}
                    isEnumerable
                  />
                </Col>
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
export default CronJob;
