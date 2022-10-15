/* begin general import */
import { Spin } from "antd";
import { ColumnProps } from "antd/lib/table";
import PageHeader from "components/PageHeader/PageHeader";
import { formatDate } from "helpers/date-time";
import { AppUser } from "models/AppUser";
import { Moment } from "moment";
import React, { useMemo } from "react";
import {
  LayoutCell,
  LayoutHeader,
  OneLineText,
  StandardTable,
} from "react3l-ui-library";
import { userRepository } from "repositories/user-repository";
import { finalize } from "rxjs";
import nameof from "ts-nameof.macro";
/* end individual import */

function UserMaster() {
  const [list, setList] = React.useState<AppUser[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const firstLoad = React.useRef(true);
  React.useEffect(() => {
    if (firstLoad) {
      setLoading(true);
      userRepository
        .all()
        .pipe(finalize(() => setLoading(false)))
        .subscribe((res) => setList(res.data));
    }
  }, []);

  const columns: ColumnProps<AppUser>[] = useMemo(
    () => [
      {
        title: <LayoutHeader orderType="left" title="Tên đăng nhập" />,
        key: nameof(list[0].username),
        dataIndex: nameof(list[0].username),
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
        title: <LayoutHeader orderType="left" title="Email" />,
        key: nameof(list[0].email),
        dataIndex: nameof(list[0].email),
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
        title: <LayoutHeader orderType="left" title="Số điện thoại" />,
        key: nameof(list[0].phoneNumber),
        dataIndex: nameof(list[0].phoneNumber),
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
        title: <LayoutHeader orderType="left" title="2FAMethod" />,
        key: "2FAMethod",
        dataIndex: "2FAMethod",
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
        ellipsis: true,
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
    <>
      <Spin spinning={loading}>
        <div className="page-content">
          <PageHeader
            title="Danh sách người dùng"
            breadcrumbItems={["Quản lý người dùng", "Danh sách người dùng"]}
          />
          <div className="page page-master m-t--lg m-l--sm m-r--xxl m-b--xxs">
            <div className="page-master__title p-l--sm p-t--sm p-r--sm p-b--lg">
              Danh sách người dùng
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
      </Spin>
    </>
  );
}
export default UserMaster;
