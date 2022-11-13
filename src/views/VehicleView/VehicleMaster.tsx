import { VirtualColumnKey16 } from "@carbon/icons-react";
import { Col, Row, Spin, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { renderMasterIndex } from "helpers/table";
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
import useVehicleMaster from "./VehicleMasterHook";
import VehiclePreview from "./VehiclePreview";

/* end individual import */

function VehicleMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    visible,
    currentItem,
    handlePagination,
    fuelTypeSearchFunc,
    isVerifiedSearchFunc,
    handleVerify,
    handleChangeFuelTypeFilter,
    handleGoPreview,
    handleChangeVerifiedFilter,
    handleClosePreview,
  } = useVehicleMaster();

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: <div className="text-center gradient-text">STT</div>,
        key: "index",
        width: 80,
        align: "center",
        render: renderMasterIndex<AppUser>(),
      },
      {
        title: <LayoutHeader orderType="left" title="Họ tên chủ xe" />,
        key: nameof(list[0].driver),
        dataIndex: nameof(list[0].driver),
        ellipsis: true,
        width: 150,
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                countCharacters={30}
                value={
                  params[0]?.user?.userProfile?.firstName +
                  " " +
                  params[0]?.user?.userProfile?.lastName
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Loại nhiên liệu" />,
        key: nameof(list[0].fuelType),
        dataIndex: nameof(list[0].fuelType),
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
        title: <LayoutHeader orderType="left" title="Biển số" />,
        key: nameof(list[0].licensePlate),
        dataIndex: nameof(list[0].licensePlate),
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
        title: <LayoutHeader orderType="left" title="Số chỗ ngồi" />,
        key: nameof(list[0].numberOfSeats),
        dataIndex: nameof(list[0].numberOfSeats),
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
        title: <LayoutHeader orderType="left" title="Hãng xe" />,
        key: nameof(list[0].brand),
        dataIndex: nameof(list[0].brand),
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
        title: <LayoutHeader orderType="left" title="Màu sắc" />,
        key: nameof(list[0].color),
        dataIndex: nameof(list[0].color),
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
        title: <LayoutHeader orderType="left" title="Trạng thái xác minh" />,
        key: nameof(list[0].isVerified),
        dataIndex: nameof(list[0].isVerified),
        ellipsis: true,
        width: 100,
        render(...params: [boolean, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={params[0] ? "Đã xác minh" : "Chưa xác minh"}
              />
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
          return appUser.isVerified ? (
            <></>
          ) : (
            <Tooltip title="Xác nhận thông tin phương tiện">
              <VirtualColumnKey16
                color="#0f62fe"
                style={{ cursor: "pointer" }}
                onClick={() => handleVerify(id)}
              />
            </Tooltip>
          );
        },
      },
    ],
    [handleVerify, list]
  );
  return (
    <Spin spinning={loadingList}>
      <div className="page-content">
        <PageHeader
          title="Quản lý phương tiện"
          breadcrumbItems={[
            "Quản lý phương tiện",
            "Danh sách Quản lý phương tiện",
          ]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Quản lý phương tiện
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <Select
                    label="Loại nhiên liệu"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn loại nhiên liệu"
                    getList={fuelTypeSearchFunc}
                    onChange={handleChangeFuelTypeFilter}
                    value={filter?.fuelTypeValue}
                  />
                </Col>
                <Col lg={6}>
                  <Select
                    label="Trạng thái xác minh"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn trạng thái"
                    getList={isVerifiedSearchFunc}
                    onChange={handleChangeVerifiedFilter}
                    value={filter?.verifiedValue}
                  />
                </Col>

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
                  onClick: (event) => {
                    handleGoPreview(record);
                  }, // click row
                };
              }}
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
      <VehiclePreview
        visible={visible}
        model={currentItem}
        handleClose={handleClosePreview}
      />
    </Spin>
  );
}
export default VehicleMaster;
