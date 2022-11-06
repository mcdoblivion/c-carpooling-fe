/* begin general import */
import { Dropdown, Menu, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { formatDate } from "helpers/date-time";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Moment } from "moment";
import React, { useMemo } from "react";
import {
  InputSearch,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
  TagFilter,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useUserMaster from "./UserMasterHook";
import Avatar, { ConfigProvider } from "react-avatar";
import { OverflowMenuHorizontal24 } from "@carbon/icons-react";
import { useAppState } from "app/AppStore";

/* end individual import */

function UserMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleChangeInputSearch,
    handleTableChange,
    handlePagination,
    handleGoPreview,
    handleGoDetailWithId,
    handleChangeAllFilter,
    handleDelete,
  } = useUserMaster();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { appState } = useAppState();

  const menuAction = React.useCallback(
    (id: number, appUser: AppUser) => (
      <Menu>
        <Menu.Item key="1">
          <div className="ant-action-menu" onClick={handleGoPreview(id)}>
            Xem
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div className="ant-action-menu" onClick={handleGoDetailWithId(id)}>
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
    [handleGoPreview, handleGoDetailWithId, handleDelete]
  );

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: <LayoutHeader orderType="left" title="Ảnh đại diện" />,
        key: nameof(list[0].avatarURL),
        dataIndex: nameof(list[0].avatarURL),
        ellipsis: true,
        width: 80,
        aligh: "center",
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell tableSize="md">
              <ConfigProvider colors={["#d1d1d1", "yellow", "#0f62fe"]}>
                <Avatar
                  maxInitials={1}
                  round={true}
                  size="30"
                  name={params[1]?.userProfile?.firstName || "U"}
                />
              </ConfigProvider>
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Tên người dùng" />,
        key: nameof(list[0].userProfile),
        dataIndex: nameof(list[0].userProfile),
        ellipsis: true,
        width: 150,
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                countCharacters={30}
                value={params[0]?.firstName + " " + params[0]?.lastName}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Ngày sinh" />,
        key: nameof(list[0].dateOfBirth),
        dataIndex: nameof(list[0].dateOfBirth),
        width: 100,
        ellipsis: true,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.userProfile?.dateOfBirth} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Giới tính" />,
        key: nameof(list[0].gender),
        dataIndex: nameof(list[0].gender),
        ellipsis: true,
        width: 80,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={params[1]?.userProfile?.gender === "Male" ? "Nam" : "Nữ"}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Email" />,
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
        ellipsis: true,
        width: 150,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} countCharacters={30} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Số điện thoại" />,
        key: nameof(list[0].phoneNumber),
        dataIndex: nameof(list[0].phoneNumber),
        ellipsis: true,
        width: 120,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Vai trò" />,
        key: nameof(list[0].role),
        dataIndex: nameof(list[0].role),
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
        title: <LayoutHeader orderType="left" title="Ngày tạo" />,
        key: nameof(list[0].createdAt),
        dataIndex: nameof(list[0].createdAt),
        width: 80,
        ellipsis: true,
        render(...params: [Moment, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={formatDate(params[1]?.userProfile?.createdAt)}
              />
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
          title="Danh sách người dùng"
          breadcrumbItems={["Quản lý người dùng", "Danh sách người dùng"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xxs">
            Danh sách người dùng
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
              <div className="page-master__filter-action-search d-flex align-items-center">
                <InputSearch
                  value={filter?.search}
                  classFilter={AppUserFilter}
                  placeHolder="Tìm kiếm người dùng..."
                  onChange={handleChangeInputSearch}
                />
              </div>
              <div className="page-master__actions  d-flex align-items-center justify-content-start">
                <div className="page-master__filter-action d-flex align-items-center"></div>
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
export default UserMaster;
