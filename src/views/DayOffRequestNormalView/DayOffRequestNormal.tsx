import { Add16, OverflowMenuHorizontal24 } from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { formatDate } from "helpers/date-time";
import { renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Moment } from "moment";
import { useCallback, useMemo } from "react";
import {
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import DayOffRequestNormalDetail from "./DayOffRequestNormalDetail";
import useDayOffRequestNormal from "./DayOffRequestNormalHook";
import DayOffRequestNormalPreview from "./DayOffRequestNormalPreview";

/* end individual import */

function DayOffRequestNormal() {
  const {
    filter,
    list,
    count,
    loadingList,
    visibleDetail,
    currentItem,
    visiblePreview,
    handleCloseDetail,
    handleClosePreview,
    handleTableChange,
    handlePagination,
    handleChangeSelectFilter,
    handleChangeDirectionTypeFilter,
    groupSearchFunc,
    directionTypeSearchFunc,
    handleDelete,
    handleGoCreate,
    handleGoDetail,
    handleGoPreview,
  } = useDayOffRequestNormal();

  const menuAction = useCallback(
    (id: number, appUser: AppUser) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={() => handleGoPreview(appUser)}
          >
            Xem
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="ant-action-menu"
            onClick={() => handleGoDetail(appUser)}
          >
            Sửa
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div className="ant-action-menu" onClick={() => handleDelete(id)}>
            Xóa
          </div>
        </Menu.Item>
      </Menu>
    ),
    [handleDelete, handleGoDetail, handleGoPreview]
  );
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
        title: <LayoutHeader orderType="left" title="Số yêu cầu nghỉ phép" />,
        key: nameof(list[0].id),
        dataIndex: nameof(list[0].id),
        width: 100,
        ellipsis: true,
        render(...params: [any, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
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
        title: "Tác vụ",
        key: "action",
        dataIndex: nameof(list[0].id),
        fixed: "right",
        width: 80,
        align: "center",
        render(id: number, appUser: AppUser) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <Dropdown
                overlay={menuAction(id, appUser)}
                trigger={["click"]}
                placement="bottomCenter"
                arrow
              >
                <OverflowMenuHorizontal24 />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [list, menuAction]
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
                <Col lg={6} style={{ alignSelf: "end", textAlign: "right" }}>
                  <Button
                    type="primary"
                    className="btn--lg"
                    icon={<Add16 />}
                    onClick={handleGoCreate}
                    disabled={list?.length > 2}
                  >
                    Tạo mới
                  </Button>
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
      <DayOffRequestNormalDetail
        visible={visibleDetail}
        handleClose={handleCloseDetail}
        model={currentItem}
      />
      <DayOffRequestNormalPreview
        visible={visiblePreview}
        model={currentItem}
        handleClose={handleClosePreview}
      />
    </Spin>
  );
}
export default DayOffRequestNormal;
