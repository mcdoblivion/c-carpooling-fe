import { Add16 } from "@carbon/icons-react";
import { Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import TimePicker from "components/TimePicker";
import { formatNumber } from "helpers/number";
import { renderMasterIndex } from "helpers/table";
import { AppUser } from "models/AppUser";
import { useMemo } from "react";
import {
  Button,
  LayoutCell,
  LayoutHeader,
  Modal,
  OneLineText,
  StandardTable,
} from "react3l-ui-library";
import { MODAL_SIZE } from "react3l-ui-library/build/components/Modal/Modal";
import nameof from "ts-nameof.macro";
import CarpoolingGroupCreate from "../CarpoolingGroupCreate/CarpoolingGroupCreate";
import useCarpoolingGroupFinding from "./CarpoolingGroupFindingHook";
import CarpoolingGroupFindingPreview from "./CarpoolingGroupFindingPreview";

/* end individual import */

export interface CarpoolingGroupFindingProps {
  user: AppUser;
  reloadUser: () => void;
}

function CarpoolingGroupFinding(props: CarpoolingGroupFindingProps) {
  const { user, reloadUser } = props;

  const {
    list,
    loadingList,
    visiblePreview,
    visibleDetail,
    currentItem,
    departureTime,
    comebackTime,
    popupFeeContent,
    visiblePopupFee,
    handleConfirm,
    handleClosePopupFee,
    handleClosePreview,
    handleCloseDetail,
    handleGoCreate,
    handleChangeTimeFilter,
    handleGoPreview,
    handleFindingGroup,
    handleOpenPopupFee,
  } = useCarpoolingGroupFinding(reloadUser);

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
        title: <LayoutHeader orderType="left" title="Tên tài xế" />,
        key: nameof(list[0].driverUser),
        dataIndex: nameof(list[0].driverUser),
        width: 100,
        ellipsis: true,
        render(...params: [any, AppUser, number]) {
          const driver = params[0]?.userProfile;
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={driver?.firstName + " " + driver?.lastName} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Số thành viên" />,
        key: nameof(list[0].carpoolerCount),
        dataIndex: nameof(list[0].carpoolerCount),
        width: 100,
        ellipsis: true,
        render(...params: [number, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatNumber(params[0])} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Loại phương tiện" />,
        key: nameof(list[0].vehicleForCarpooling),
        dataIndex: nameof(list[0].driverUser),
        width: 100,
        ellipsis: true,
        render(...params: [any, AppUser, number]) {
          const vehicle = params[0]?.driver?.vehicleForCarpooling;
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={vehicle?.brand + " " + vehicle?.color} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Thời gian xuất phát" />,
        key: nameof(list[0].departureTime),
        dataIndex: nameof(list[0].departureTime),
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
        title: <LayoutHeader orderType="left" title="Thời gian trở về" />,
        key: nameof(list[0].comebackTime),
        dataIndex: nameof(list[0].comebackTime),
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
    ],
    [list]
  );
  return (
    <Spin spinning={loadingList}>
      <div className="page-content">
        <PageHeader
          title="Nhóm đi chung"
          breadcrumbItems={["Nhóm đi chung", "Tìm nhóm đi chung"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Tìm nhóm đi chung
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <TimePicker
                    value={departureTime}
                    label="Thời gian xuất phát"
                    placeholder="Chọn thời gian"
                    onChange={handleChangeTimeFilter("departureTime")}
                  />
                </Col>
                <Col lg={6}>
                  <TimePicker
                    value={comebackTime}
                    label="Thời gian trở về"
                    placeholder="Chọn thời gian"
                    onChange={handleChangeTimeFilter("comebackTime")}
                  />
                </Col>

                <Col lg={4}></Col>
                <Col lg={8} style={{ alignSelf: "end", textAlign: "right" }}>
                  <Button
                    type="primary"
                    className="btn--lg"
                    icon={<Add16 />}
                    onClick={handleFindingGroup}
                    disabled={departureTime && comebackTime ? false : true}
                  >
                    Tìm nhóm đi chung
                  </Button>
                  {user?.driver?.status === "Accepted" ? (
                    <Button
                      type="primary"
                      className="btn--lg m-l--xxs"
                      icon={<Add16 />}
                      onClick={handleGoCreate}
                    >
                      Tạo nhóm đi chung
                    </Button>
                  ) : (
                    <></>
                  )}
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
              onRow={(record) => {
                return {
                  onClick: () => {
                    handleGoPreview(record);
                  },
                };
              }}
            />
          </div>
        </div>
      </div>
      <CarpoolingGroupFindingPreview
        visible={visiblePreview}
        handleClose={handleClosePreview}
        model={currentItem}
        handleOpenPopupFee={handleOpenPopupFee}
      />
      <Modal
        size={MODAL_SIZE.SIZE_520}
        open={visiblePopupFee}
        visibleFooter
        handleCancel={handleClosePopupFee}
        handleSave={handleConfirm}
        onCancel={handleClosePopupFee}
        titleButtonCancel="Hủy"
        titleButtonApply="Đồng ý"
        title="Chi phí đi chung dự kiến"
      >
        Chi phí đi chung dự kiến của nhóm bao gồm:
        <div style={{ padding: "10px" }}>
          <div className="d-flex">
            <span>Chi phí tháng:</span>
            <span className="m-l--xxxs" style={{ fontWeight: 600 }}>
              {formatNumber(popupFeeContent?.priceForCurrentMonth)} VND
            </span>
          </div>
          <div className="d-flex">
            <span>Chi phí mỗi lượt đi:</span>
            <span className="m-l--xxxs" style={{ fontWeight: 600 }}>
              {formatNumber(popupFeeContent?.pricePerUserPerMoveTurn)} VND
            </span>
          </div>
          <div className="d-flex">
            <span>Chi phí tiết kiệm được:</span>
            <span className="m-l--xxxs" style={{ fontWeight: 600 }}>
              {formatNumber(popupFeeContent?.savingCostInPercentage)}%
            </span>
          </div>
        </div>
        Phần chi phí chênh lệch so với thực tế sẽ được hoàn trả/truy thu vào
        ngày đầu tiên của mỗi tháng. Bạn có chắc muốn tham gia nhóm?
      </Modal>
      <CarpoolingGroupCreate
        visible={visibleDetail}
        handleClose={handleCloseDetail}
        handleLoadGroupInfo={reloadUser}
      />
    </Spin>
  );
}
export default CarpoolingGroupFinding;
