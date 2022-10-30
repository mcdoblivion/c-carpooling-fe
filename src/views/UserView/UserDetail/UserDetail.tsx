import PageHeader from "components/PageHeader/PageHeader";
import { Button } from "react3l-ui-library";
import "./GoodsIssueRequestDetail.scss";
import { Close16, Save16 } from "@carbon/icons-react";
import useUserDetail from "./UserDetailHook";

function UserDetail() {
  const { model } = useUserDetail();

  return (
    <div className="page-content">
      <PageHeader
        title={model?.data?.username}
        // breadcrumbItems={[
        //     translate("goodsIssueRequests.master.header"),
        //     translate("goodsIssueRequests.master.subHeader"),
        //     !isDetail
        //         ? translate("general.actions.create")
        //         : translate("general.detail.title"),
        // ]}
      />
      <div className="page page-detail p-t--lg p-l--sm p-r--sm p-b--lg"></div>
      <footer className="app-footer">
        <div className="app-footer__full d-flex justify-content-end align-items-center">
          <div className="app-footer__actions d-flex justify-content-end">
            <Button
              type="secondary"
              className="btn--lg"
              icon={<Close16 />}
              // onClick={handleGoMaster}
            >
              Đóng
            </Button>
            <Button type="secondary" className="btn--lg" icon={<Save16 />}>
              Lưu
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserDetail;
