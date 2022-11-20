import { ColumnProps } from "antd/lib/table";
import { renderMasterIndex } from "helpers/table";
import { AppUser } from "models/AppUser";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar, { ConfigProvider } from "react-avatar";
import { LayoutCell, LayoutHeader, OneLineText } from "react3l-ui-library";
import { carpoolingGroupRepository } from "repositories/carpooling-group-repository";

import { finalize } from "rxjs";
import { webService } from "services/common-services/web-service";

export default function useCarpoolingGroupInformation(
  carpoolingGroupId?: number
) {
  const [loading, setLoading] = useState<boolean>(false);
  const firstLoad = useRef(true);
  const [subscription] = webService.useSubscription();
  const [model, setModel] = useState(new AppUser());
  const [driverUser, setDriverUser] = useState(new AppUser());
  const [vehicleForCarpooling, setVehicleForCarpooling] = useState(
    new AppUser()
  );
  const [carpoolers, setCarpoolers] = useState([]);

  useEffect(() => {
    if (firstLoad && carpoolingGroupId) {
      setLoading(true);
      subscription.add(
        carpoolingGroupRepository
          .getCarpoolingGroups(carpoolingGroupId)
          .pipe(finalize(() => setLoading(false)))
          .subscribe({
            next: (res) => {
              setModel(res?.data);
              setDriverUser(res?.data?.driverUser);
              setVehicleForCarpooling(
                res?.data?.driverUser?.driver?.vehicleForCarpooling
              );
              setCarpoolers(res?.data?.carpoolers);
            },
            error: (_err) => {},
          })
      );
      firstLoad.current = false;
    }
  }, [carpoolingGroupId, subscription]);

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
        title: <LayoutHeader orderType="left" title="Ảnh đại diện" />,
        key: "avatarURL",
        dataIndex: "userProfile",
        ellipsis: true,
        width: 80,
        aligh: "center",
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell tableSize="lg">
              {params[0]?.avatarURL ? (
                <img
                  className="avatar-sm rounded-circle"
                  src={params[0]?.avatarURL}
                  alt="Ảnh đại diện"
                />
              ) : (
                <ConfigProvider colors={["#d1d1d1", "yellow", "#0f62fe"]}>
                  <Avatar
                    maxInitials={1}
                    round={true}
                    size="30"
                    name={params[0]?.lastName || "U"}
                  />
                </ConfigProvider>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Tên thành viên" />,
        key: "name",
        dataIndex: "userProfile",
        ellipsis: true,
        width: 150,
        render(...params: [AppUser, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText
                countCharacters={30}
                value={params[0]?.firstName + " " + params[0]?.lastName}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: <LayoutHeader orderType="left" title="Email" />,
        key: "email",
        dataIndex: "email",
        ellipsis: true,
        width: 150,
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
        key: "phoneNumber",
        dataIndex: "phoneNumber",
        ellipsis: true,
        width: 150,
        render(...params: [string, AppUser, number]) {
          return (
            <LayoutCell orderType="left" tableSize="md">
              <OneLineText value={params[0]} />
            </LayoutCell>
          );
        },
      },
    ],
    []
  );

  return {
    loading,
    model,
    columns,
    carpoolers,
    driverUser,
    vehicleForCarpooling,
  };
}
