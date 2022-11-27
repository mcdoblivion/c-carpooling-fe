import { OverflowMenuHorizontal24 } from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import { useCallback, useMemo } from "react";
import {
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useDriverMaster from "./DriverMasterHook";
import DriverPreview from "./DriverPreview";

function DriverMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    visible,
    currentItem,
    handlePagination,
    statusSearchFunc,
    handleVerify,
    handleGoPreview,
    handleChangeStatusFilter,
    handleClosePreview,
  } = useDriverMaster();

  const menuAction = useCallback(
    (id: number) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={(e) => {
              e.stopPropagation();
              handleVerify(id, "Accepted");
            }}
          >
            Phê duyệt
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="ant-action-menu"
            onClick={(e) => {
              e.stopPropagation();
              handleVerify(id, "Rejected");
            }}
          >
            Từ chối
          </div>
        </Menu.Item>
      </Menu>
    ),
    [handleVerify]
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
        title: <LayoutHeader orderType="left" title="Họ tên tài xế" />,
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
        title: <LayoutHeader orderType="left" title="Email" />,
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].user),
        width: 100,
        ellipsis: true,
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]?.email} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Số điện thoại" />,
        key: nameof(list[0].phoneNumber),
        dataIndex: nameof(list[0].user),
        width: 100,
        ellipsis: true,
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]?.phoneNumber} />
            </LayoutCell>
          );
        },
      },

      {
        title: <LayoutHeader orderType="left" title="Trạng thái xác nhận" />,
        key: nameof(list[0].status),
        dataIndex: nameof(list[0].status),
        ellipsis: true,
        width: 100,
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
        dataIndex: "id",
        fixed: "right",
        width: 80,
        align: "center",
        render(id: number, appUser: AppUser) {
          return (
            <div
              className="d-flex justify-content-center button-action-table"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {appUser.status === "Pending" ? (
                <Dropdown
                  overlay={menuAction(id)}
                  trigger={["click"]}
                  placement="bottomRight"
                  arrow
                >
                  <OverflowMenuHorizontal24 id="action" />
                </Dropdown>
              ) : (
                <></>
              )}
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
          title="Quản lý tài xế"
          breadcrumbItems={["Quản lý tài xế", "Danh sách Quản lý tài xế"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Quản lý tài xế
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <Select
                    label="Trạng thái"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn trạng thái"
                    getList={statusSearchFunc}
                    onChange={handleChangeStatusFilter}
                    value={filter?.statusValue}
                    isEnumerable
                  />
                </Col>
                <Col lg={6}></Col>
                <Col lg={6}></Col>
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
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event: any) => {
                    if (event?.target?.id !== "action") {
                      handleGoPreview(record);
                    }
                  },
                };
              }}
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
      <DriverPreview
        visible={visible}
        model={currentItem}
        handleClose={handleClosePreview}
      />
    </Spin>
  );
}
export default DriverMaster;
