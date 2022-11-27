import { Col, Row, Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import Select from "components/Select/SingleSelect";
import { formatDate } from "helpers/date-time";
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
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";
import { userRepository } from "repositories/user-repository";
import nameof from "ts-nameof.macro";
import useLeaveGroupRequestMaster from "./LeaveGroupRequestMasterHook";

/* end individual import */

function LeaveGroupRequestMaster() {
  const {
    filter,
    list,
    count,
    loadingList,
    handleTableChange,
    handlePagination,
    handleChangeAppUserFilter,
    handleChangeGroupFilter,
  } = useLeaveGroupRequestMaster();

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
        title: <LayoutHeader orderType="left" title="Tên người dùng" />,
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
        title: <LayoutHeader orderType="left" title="Tên nhóm" />,
        key: nameof(list[0].carpoolingGroup),
        dataIndex: nameof(list[0].carpoolingGroup),
        width: 100,
        ellipsis: true,
        render(...params: [any, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]?.groupName} />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Ngày rời nhóm" />,
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
    ],
    [list]
  );
  return (
    <Spin spinning={loadingList}>
      <div className="page-content">
        <PageHeader
          title="Yêu cầu rời nhóm"
          breadcrumbItems={["Yêu cầu rời nhóm", "Danh sách Yêu cầu rời nhóm"]}
        />
        <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
          <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--xs">
            Danh sách Yêu cầu rời nhóm
          </div>
          <div className="page-master__content">
            <div className="m-b--xxxs m-l--sm">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
                <Col lg={6}>
                  <Select
                    label="Tên người dùng"
                    classFilter={AppUserFilter}
                    placeHolder="Chọn người dùng"
                    searchProperty="search"
                    searchType=""
                    getList={userRepository.getUsers}
                    render={(item) =>
                      item?.userProfile &&
                      `${item.userProfile?.firstName} ${item.userProfile?.lastName}`
                    }
                    onChange={handleChangeAppUserFilter}
                    value={filter?.user}
                  />
                </Col>
                <Col lg={6}>
                  <Select
                    label="Nhóm đi chung"
                    searchProperty="search"
                    searchType=""
                    classFilter={AppUserFilter}
                    placeHolder="Chọn nhóm đi chung"
                    getList={carpoolingGroupRepository.search}
                    render={(item) => item?.groupName}
                    onChange={handleChangeGroupFilter}
                    value={filter?.carpoolingGroup}
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
export default LeaveGroupRequestMaster;
