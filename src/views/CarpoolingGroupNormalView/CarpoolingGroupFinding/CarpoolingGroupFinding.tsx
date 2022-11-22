/* eslint-disable @typescript-eslint/no-unused-vars */
import { Add16, OverflowMenuHorizontal24 } from "@carbon/icons-react";
import { Col, Dropdown, Menu, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import TimePicker from "components/TimePicker";
import { formatDate } from "helpers/date-time";
import { formatNumber } from "helpers/number";
import { renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Moment } from "moment";
import { useCallback, useMemo } from "react";
import {
  Button,
  DatePicker,
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";
import nameof from "ts-nameof.macro";
import useCarpoolingGroupFinding from "./CarpoolingGroupFindingHook";
import CarpoolingGroupFindingPreview from "./CarpoolingGroupFindingPreview";

/* end individual import */

function CarpoolingGroupFinding() {
  const {
    list,
    loadingList,
    visiblePreview,
    currentItem,
    departureTime,
    comebackTime,
    handleCloseDetail,
    handleClosePreview,
    handleChangeTimeFilter,
    handleGoCreate,
    handleGoPreview,
    handleGoDetail,
    handleFindingGroup,
  } = useCarpoolingGroupFinding();

  console.log(list);

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

                <Col lg={6}></Col>
                <Col lg={6} style={{ alignSelf: "end", textAlign: "right" }}>
                  <Button
                    type="primary"
                    className="btn--lg"
                    icon={<Add16 />}
                    onClick={handleFindingGroup}
                    disabled={departureTime && comebackTime ? false : true}
                  >
                    Tìm nhóm đi chung
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
            />
          </div>
        </div>
      </div>
      <CarpoolingGroupFindingPreview
        visible={visiblePreview}
        handleClose={handleCloseDetail}
        model={currentItem}
      />
    </Spin>
  );
}
export default CarpoolingGroupFinding;
