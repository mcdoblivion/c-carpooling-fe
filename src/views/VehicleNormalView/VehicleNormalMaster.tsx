import { Add16, OverflowMenuHorizontal24 } from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { renderMasterIndex } from "helpers/table";
import { AppUser } from "models/AppUser";
import { useCallback, useMemo } from "react";
import {
  Button,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useVehicleMaster from "./VehicleNormalMasterHook";
import VehicleNormalPreview from "./VehicleNormalPreview";

/* end individual import */

function VehicleNormalMaster() {
  const {
    list,
    loadingList,
    visible,
    currentItem,
    handleGoPreview,
    handleGoDetail,
    handleClosePreview,
    handleDelete,
    handleGoCreate,
    handleSetMainVehicle,
  } = useVehicleMaster();

  const menuAction = useCallback(
    (model: AppUser) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={(e) => {
              e.stopPropagation();
              handleGoDetail(model?.id);
            }}
          >
            Cập nhật thông tin phương tiện
          </div>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="ant-action-menu"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(model?.id);
            }}
          >
            Xóa phương tiện
          </div>
        </Menu.Item>
        <Menu.Item key="3">
          <div
            className="ant-action-menu"
            onClick={(e) => {
              e.stopPropagation();
              handleSetMainVehicle(model?.id);
            }}
          >
            Chọn làm phương tiện đi chung
          </div>
        </Menu.Item>
      </Menu>
    ),
    [handleDelete, handleGoDetail, handleSetMainVehicle]
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
        title: <LayoutHeader orderType="left" title="Biển số" />,
        key: nameof(list[0].licensePlate),
        dataIndex: nameof(list[0].licensePlate),
        width: 150,
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
          return (
            <div
              className="d-flex justify-content-center button-action-table"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Dropdown
                overlay={menuAction(appUser)}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <OverflowMenuHorizontal24 id="action" />
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
          title="Quản lý phương tiện"
          breadcrumbItems={["Quản lý phương tiện", "Danh sách phương tiện"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách phương tiện
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}></Col>

                <Col lg={6}></Col>

                <Col lg={6}></Col>
                <Col lg={6} style={{ alignSelf: "end", textAlign: "right" }}>
                  <Button
                    type="primary"
                    className="btn--lg"
                    icon={<Add16 />}
                    onClick={handleGoCreate}
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
          </div>
        </div>
      </div>
      <VehicleNormalPreview
        visible={visible}
        model={currentItem}
        handleClose={handleClosePreview}
      />
      {/* <VehicleNormalDetail
        visible={visibleDetail}
        handleClose={handleCloseDetail}
        model={currentItem}
      /> */}
    </Spin>
  );
}
export default VehicleNormalMaster;
