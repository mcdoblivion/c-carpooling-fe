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
  DatePicker,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useCarpoolingLogMaster from "./CarpoolingLogMasterHook";

/* end individual import */

function CarpoolingLogMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    isAdmin: isUserFilterVisible,
    handleTableChange,
    handlePagination,
    handleChangeSelectFilter,
    handleChangeDirectionTypeFilter,
    handleChangeStatusFilter,
    handleChangeDateFilter,
    appUserSearchFunc,
    groupSearchFunc,
    statusSearchFunc,
    directionTypeSearchFunc,
  } = useCarpoolingLogMaster();

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
          title="Lịch sử đi chung"
          breadcrumbItems={["Lịch sử đi chung", "Danh sách Lịch sử đi chung"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Lịch sử đi chung
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                {isUserFilterVisible && (
                  <Col lg={5}>
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
                )}
                <Col lg={5}>
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
                <Col lg={5}>
                  <Select
                    label="Chiều di chuyển"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn chiều di chuyển"
                    getList={directionTypeSearchFunc}
                    onChange={handleChangeDirectionTypeFilter}
                    value={filter?.directionTypeValue}
                  />
                </Col>
                <Col lg={5}>
                  <DatePicker
                    label="Ngày"
                    value={filter?.dateValue}
                    placeholder="Chọn ngày"
                    onChange={handleChangeDateFilter}
                  />
                </Col>
                <Col lg={4}>
                  <Select
                    label="Trạng thái"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn trạng thái"
                    getList={statusSearchFunc}
                    onChange={handleChangeStatusFilter}
                    value={filter?.statusValue}
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
              total={count * filter?.limit}
              onChange={handlePagination}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
export default CarpoolingLogMaster;
