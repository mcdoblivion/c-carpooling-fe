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
import "react-credit-cards/es/styles-compiled.css";
import { formatNumber } from "helpers/number";
import CreditCard from "components/CreditCard/CreditCard";
import WalletDetail from "./WalletDetail";
import Topup from "./Topup";

/* end individual import */

function WalletMaster() {
  const {
    user,
    list,
    loadingList,
    visibleDetail,
    visibleTopup,
    currentItem,
    handleGoTopUp,
    handleCloseDetail,
    handleCloseTopup,
    handleDelete,
    handleGoCreate,
    handleLoadList,
    setUser,
  } = useVehicleMaster();

  const menuAction = useCallback(
    (model: AppUser) => (
      <Menu>
        <Menu.Item key="1">
          <div
            className="ant-action-menu"
            onClick={(e) => {
              e.stopPropagation();
              handleGoTopUp(model);
            }}
          >
            Nạp tiền vào ví
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
            Xóa thẻ
          </div>
        </Menu.Item>
      </Menu>
    ),
    [handleDelete, handleGoTopUp]
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
        key: nameof(list[0].id),
        dataIndex: nameof(list[0].id),
        width: 200,
        render(...params: [string, AppUser, number]) {
          return (
            <CreditCard
              cardType={params[1]?.cardType}
              lastFourDigits={params[1]?.lastFourDigits}
            />
          );
        },
      },

      {
        title: <LayoutHeader orderType="left" title="Loại thẻ" />,
        key: nameof(list[0].cardType),
        dataIndex: nameof(list[0].cardType),
        width: 100,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                value={params[0] === "visa" ? "Visa" : "Master Card"}
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
          title="Quản lý ví điện tử"
          breadcrumbItems={["Quản lý ví điện tử", "Danh sách thẻ"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs"></div>

          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <div className="text__with__label_vertical">
                    <h2>Số dư hiện tại: </h2>
                    <h2>{formatNumber(user?.wallet?.currentBalance)} VND</h2>
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
                  >
                    Thêm thẻ tín dụng
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
          <div className="page-master__content-table custom-credit-card-table">
            <StandardTable
              rowKey={nameof(list[0].id)}
              columns={columns}
              dataSource={list}
              isDragable={true}
              tableSize={"md"}
              scroll={{ x: 1000 }}
            />
          </div>
        </div>
      </div>
      <WalletDetail
        visible={visibleDetail}
        model={currentItem}
        handleClose={handleCloseDetail}
        handleLoadList={handleLoadList}
      />
      <Topup
        visible={visibleTopup}
        model={currentItem}
        handleClose={handleCloseTopup}
        handleLoadList={handleLoadList}
        setUser={setUser}
      />
    </Spin>
  );
}
export default WalletMaster;
