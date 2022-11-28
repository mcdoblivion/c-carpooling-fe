import { Run16 } from "@carbon/icons-react";
import { Col, Row, Spin, Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { formatDate, formatTime } from "helpers/date-time";
import { renderMasterIndex } from "helpers/table";
import { AppUser, AppUserFilter } from "models/AppUser";
import { Moment } from "moment";
import { useMemo } from "react";
import {
  LayoutCell,
  LayoutHeader,
  OneLineText,
  Pagination,
  StandardTable,
} from "react3l-ui-library";

import nameof from "ts-nameof.macro";
import useCronJob from "./CronJobHook";

/* end individual import */

function CronJob() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeFilter,
    getJobTypes,
    getIsProcessedStatuses,
    triggerCronJob,
  } = useCronJob();

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
        title: <LayoutHeader orderType="left" title="Tên tác vụ" />,
        key: nameof(list[0].type),
        dataIndex: nameof(list[0].type),
        ellipsis: true,
        width: 100,
        render(...params: [string]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText countCharacters={30} value={params[0]} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Mô tả" />,
        key: nameof(list[0].description),
        dataIndex: nameof(list[0].description),
        width: 150,
        ellipsis: true,
        render(...params: [string]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Ngày" />,
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
        title: <LayoutHeader orderType="left" title="Trạng thái" />,
        key: nameof(list[0].finishedAt),
        dataIndex: nameof(list[0].finishedAt),
        width: 100,
        ellipsis: true,
        render(...params: [string]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0] ? "Completed" : "Uncompleted"} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Thời gian hoàn thành" />,
        key: nameof(list[0].finishedAt),
        dataIndex: nameof(list[0].finishedAt),
        width: 100,
        ellipsis: true,
        render(...params: [Moment]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={formatTime(params[0], "HH:mm:ss.SSS")} />
            </LayoutCell>
          );
        },
      },
      {
        title: "Kích hoạt tác vụ",
        key: "action",
        dataIndex: "id",
        fixed: "right",
        width: 80,
        align: "center",
        render(id: number, cronJob: AppUser) {
          return cronJob?.finishedAt ? (
            <></>
          ) : (
            <Tooltip title="Kích hoạt tác vụ">
              <Run16
                color="#0f62fe"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerCronJob(id);
                }}
                id="action"
              />
            </Tooltip>
          );
        },
      },
    ],
    [list, triggerCronJob]
  );
  return (
    <Spin spinning={loadingList}>
      <div className="page-content">
        <PageHeader
          title="Quản lý tác vụ"
          breadcrumbItems={["Quản lý tác vụ", "Danh sách tác vụ"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách tác vụ được lập lịch tự động
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={5}>
                  <Select
                    label="Loại tác vụ"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn loại tác vụ"
                    getList={getJobTypes}
                    onChange={handleChangeFilter("type")}
                    value={filter?.typeValue}
                    isEnumerable
                  />
                </Col>
                <Col lg={5}>
                  <Select
                    label="Trạng thái xử lý"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn trạng thái xử lý"
                    getList={getIsProcessedStatuses}
                    onChange={handleChangeFilter("isProcessed")}
                    value={filter?.isProcessedValue}
                    isEnumerable
                  />
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
              total={count}
              onChange={handlePagination}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
export default CronJob;
