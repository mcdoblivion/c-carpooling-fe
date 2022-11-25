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
import useVehicleMaster from "./WalletMasterHook";
import WalletPreview from "./WalletPreview";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { formatNumber } from "helpers/number";

/* end individual import */

function WalletMaster() {
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

  const mockData = [
    {
      cvc: "123",
      name: "DONG MINH CUONG",
      expiry: "12/30",
      number: "4111111111111111",
      cardType: "Visa",
      id: 1,
    },
    {
      cvc: "123",
      name: "DONG MINH CUONG",
      expiry: "12/30",
      number: "5555555555554444",
      cardType: "MasterCard",
      id: 2,
    },
    {
      cvc: "123",
      name: "DONG MINH CUONG",
      expiry: "12/30",
      number: "6062825624254001",
      cardType: "Hipercard",
      id: 3,
    },
  ];

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
        title: (
          <LayoutHeader
            orderType="center"
            className="custom-header"
            title="Thẻ thanh toán"
          />
        ),
        key: nameof(list[0].fuelType),
        dataIndex: nameof(list[0].fuelType),
        width: 200,
        render(...params: [string, AppUser, number]) {
          return (
            <Cards
              cvc={params[1]?.cvc}
              expiry={params[1]?.expiry}
              name={params[1]?.name}
              number={params[1]?.number}
            />
          );
        },
      },

      {
        title: <LayoutHeader orderType="left" title="Loại thẻ" />,
        key: nameof(list[0].isVerified),
        dataIndex: nameof(list[0].isVerified),
        width: 100,
        render(...params: [boolean, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[1]?.cardType} />
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
          title="Quản lý ví điện tử"
          breadcrumbItems={["Quản lý ví điện tử", "Danh sách thẻ"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách thẻ
          </div>

          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <div className="text__with__label_vertical">
                    <span>Số dư hiện tại</span>
                    <span>{formatNumber(100000000)}</span>
                  </div>
                </Col>

                <Col lg={6}></Col>

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
          <div className="page-master__content-table custom-credit-card-table">
            <StandardTable
              rowKey={nameof(list[0].id)}
              columns={columns}
              dataSource={mockData}
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
      <WalletPreview
        visible={visible}
        model={currentItem}
        handleClose={handleClosePreview}
      />
    </Spin>
  );
}
export default WalletMaster;
