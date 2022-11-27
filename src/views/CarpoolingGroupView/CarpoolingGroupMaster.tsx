import { Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { renderMasterIndex } from "helpers/table";
import { AppUser } from "models/AppUser";
import { useMemo } from "react";
import {
  InputText,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useCarpoolingGroupMaster from "./CarpoolingGroupMasterHook";
import CarpoolingGroupPreview from "./CarpoolingGroupPreview";

/* end individual import */

function CarpoolingGroupMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    visible,
    currentItem,
    handleTableChange,
    handlePagination,
    handleChangeInputSearch,
    handleClosePreview,
    handleGoPreview,
  } = useCarpoolingGroupMaster();

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
        title: <LayoutHeader orderType="left" title="Tên nhóm" />,
        key: nameof(list[0].groupName),
        dataIndex: nameof(list[0].groupName),
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
        title: <LayoutHeader orderType="left" title="Tên tài xế" />,
        key: nameof(list[0].driverUser),
        dataIndex: nameof(list[0].driverUser),
        width: 100,
        ellipsis: true,
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
        title: <LayoutHeader orderType="left" title="Số thành viên" />,
        key: nameof(list[0].carpoolerCount),
        dataIndex: nameof(list[0].carpoolerCount),
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
        title: <LayoutHeader orderType="left" title="Loại phương tiện" />,
        key: nameof(list[0].vehicleForCarpooling),
        dataIndex: nameof(list[0].driverUser),
        width: 120,
        ellipsis: true,
        render(...params: [any, AppUser, number]) {
          const vehicleForCarpooling = params[0]?.driver?.vehicleForCarpooling;
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={
                  vehicleForCarpooling?.brand +
                  " - " +
                  vehicleForCarpooling?.color
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Thời gian xuất phát" />,
        key: nameof(list[0].departureTime),
        dataIndex: nameof(list[0].departureTime),
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
        title: <LayoutHeader orderType="left" title="Thời gian trở về" />,
        key: nameof(list[0].comebackTime),
        dataIndex: nameof(list[0].comebackTime),
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
          title="Nhóm đi chung"
          breadcrumbItems={["Nhóm đi chung", "Danh sách Nhóm đi chung"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Nhóm đi chung
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <InputText
                    label="Tìm kiếm"
                    placeHolder="Tìm kiếm"
                    value={filter?.search}
                    onEnter={handleChangeInputSearch}
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
                    handleGoPreview(record);
                  },
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
      <CarpoolingGroupPreview
        visible={visible}
        model={currentItem}
        handleClose={handleClosePreview}
      />
    </Spin>
  );
}
export default CarpoolingGroupMaster;
