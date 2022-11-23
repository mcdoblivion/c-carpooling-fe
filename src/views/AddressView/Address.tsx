import PageHeader from "components/PageHeader/PageHeader";
import { Button, FormItem, InputText } from "react3l-ui-library";
import { Close16, Save16 } from "@carbon/icons-react";
import useAddress from "./AddressHook";
import { Col, Row, Spin } from "antd";
import "./Address.scss";
import { HereMap } from "components/HereMap/HereMap";
import { useRef } from "react";

function Address() {
  const {
    loading,
    model,
    handleChangeHomeAddress,
    handleChangeWorkAddress,
    handleSave,
  } = useAddress();

  const viewModel = useRef(true);

  return (
    <Spin spinning={loading}>
      <div className="page-content">
        <PageHeader title="Địa chỉ" breadcrumbItems={["Địa chỉ"]} />
        <div className="page page-detail p-t--lg p-l--sm p-r--sm p-b--lg">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="w-100">
            <Col lg={12} className="m-b--sm">
              <FormItem>
                <InputText
                  label="Địa chỉ nhà"
                  type={0}
                  value={model[0]?.fullAddress}
                  className={"tio-account_square_outlined"}
                  placeHolder="Nhập địa chỉ nhà..."
                  isRequired
                  disabled
                />
              </FormItem>
            </Col>
            <Col lg={12} className="m-b--sm">
              <FormItem>
                <InputText
                  label="Địa chỉ công ty"
                  type={0}
                  value={model[1]?.fullAddress}
                  className={"tio-account_square_outlined"}
                  placeHolder="Nhập địa công ty..."
                  isRequired
                  disabled
                />
              </FormItem>
            </Col>
            <Col lg={24}>
              <HereMap
                styles={{
                  height: "750px",
                  position: "relative",
                }}
                handleChangeHomeAddress={handleChangeHomeAddress}
                handleChangeWorkAddress={handleChangeWorkAddress}
                currentWorkAddress={model[1]}
                currentHomeAddress={model[0]}
                viewModel={model?.length > 0 ? viewModel : undefined}
              />
            </Col>
          </Row>
        </div>
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
              <Button
                type="secondary"
                className="btn--lg"
                icon={<Save16 />}
                onClick={handleSave}
              >
                Lưu
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </Spin>
  );
}

export default Address;
