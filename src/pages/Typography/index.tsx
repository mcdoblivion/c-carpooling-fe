/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import MetaTags from "react-meta-tags";
import { Container } from "reactstrap";
import * as yup from "yup";

function Typography() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = React.useMemo(() => {
    return yup.object().shape({
      nameTest: yup.string().required(),
      code: yup.number().required().typeError("Error message!"),
      arrays: yup
        .array()
        .of(
          yup
            .object({
              name: yup.string().required(),
              code: yup.number().required(),
              nestedArray: yup.object().shape({
                name: yup.string().required(),
                code: yup.number().required(),
              }),
            })
            .required()
        )
        .required(),
    });
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Typography</title>
        </MetaTags>
        <Container fluid>
          <div className="row">
            <div className="col-md-12">
              <h2 className="bold-text">Heading</h2>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <span className="heading-text--xs">
                    Heading 6 / Regular - 16/24
                  </span>
                </div>
                <div className="col-md-6">
                  <h6 className="bold-text">Heading 6 / Regular - 16/24</h6>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="heading-text--sm">
                    Heading 5 / Regular - 18/24
                  </span>
                </div>
                <div className="col-md-6">
                  <h5 className="bold-text">Heading 5 / Regular - 18/24</h5>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="heading-text--md">
                    Heading 4 / Regular - 20/24
                  </span>
                </div>
                <div className="col-md-6">
                  <h4 className="bold-text">Heading 4 / Regular - 20/24</h4>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="heading-text--lg">
                    Heading 3 / Regular - 24/32
                  </span>
                </div>
                <div className="col-md-6">
                  <h3 className="bold-text">Heading 3 / Regular - 24/32</h3>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="heading-text--xl">
                    Heading 2 / Regular - 28/36
                  </span>
                </div>
                <div className="col-md-6">
                  <h2 className="bold-text">Heading 2 / Regular - 28/36</h2>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="heading-text--xxl">
                    Heading 1 / Regular - 32/40
                  </span>
                </div>
                <div className="col-md-6">
                  <h1 className="bold-text">Heading 1 / Regular - 32/40</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12">
              <h2 className="bold-text">Body</h2>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <span className="body-text--xs">Body/ mini/ regular</span>
                </div>
                <div className="col-md-6">
                  <span className="body-text--xs bold-text">
                    Body/ mini/ bold
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="body-text--sm">Body/ small/ regular</span>
                </div>
                <div className="col-md-6">
                  <span className="body-text--sm bold-text">
                    Body/ small/ bold
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="body-text--md">Body/ medium/ regular</span>
                </div>
                <div className="col-md-6">
                  <span className="body-text--md bold-text">
                    Body/ medium/ bold
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <span className="body-text--lg">Body/ large/ regular</span>
                </div>
                <div className="col-md-6">
                  <span className="body-text--lg bold-text">
                    Body/ large/ bold
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <a className="body-text--xs">Link/ small/ regular</a>
                </div>
                <div className="col-md-6">
                  <span className="body-text--xs text-link bold-text">
                    Link/ small/ bold
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <a className="body-text--sm">Link/ medium/ regular</a>
                </div>
                <div className="col-md-6">
                  <span className="body-text--xs text-link bold-text">
                    Link/ medium/ bold
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <a className="body-text--md">Link/ large/ regular</a>
                </div>
                <div className="col-md-6">
                  <span className="body-text--md text-link bold-text">
                    Link/ large/ bold
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <h2 className="bold-text">Caps</h2>
            </div>
            <div className="col-md-12">
              <div className="col-md-12">
                <span className="caps-text--sm">Caps / sm</span>
              </div>
              <div className="col-md-12">
                <span className="caps-text--md">Caps / md</span>
              </div>
              <div className="col-md-12">
                <span className="caps-text--lg">Caps / lg</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Typography;
