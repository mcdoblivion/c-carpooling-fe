import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  changeLayout,
  changeLayoutWidth,
  changeTopbarTheme,
} from "../../store/actions";

// Other Layout related Component
import Header from "./Header";
import RightSidebar from "../CommonForBoth/RightSidebar";

interface LayoutProps extends RouteComponentProps<any> {
  changeLayout: (param: any) => void;
  changeLayoutWidth: (param: any) => void;
  changeTopbarTheme: (param: any) => void;
  children: ReactNode;
  isPreloader: any;
  layoutWidth: any;
  location: any;
  showRightSidebar: any;
  topbarTheme: any;
}

type LayoutState = {
  isMenuOpened: boolean;
};

class Layout extends React.Component<LayoutProps, LayoutState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isMenuOpened: false,
    };
  }

  componentDidMount() {
    const preloader = document.getElementById("preloader") as HTMLElement;
    const status = document.getElementById("status") as HTMLElement;
    if (this.props.isPreloader === true) {
      preloader.style.display = "block";
      status.style.display = "block";

      setTimeout(function () {
        preloader.style.display = "none";
        status.style.display = "none";
      }, 2500);
    } else {
      preloader.style.display = "none";
      status.style.display = "none";
    }

    // Scrollto 0,0
    window.scrollTo(0, 0);

    const title = this.props.location.pathname;
    let currentage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title = currentage + " | Skote - React Admin & Dashboard Template";

    this.props.changeLayout("horizontal");
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = () => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };
  render() {
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
            </div>
          </div>
        </div>

        <div id="layout-wrapper">
          <Header
            theme={this.props.topbarTheme}
            isMenuOpened={this.state.isMenuOpened}
            openLeftMenuCallBack={this.openMenu}
          />
          <div className="main-content">{this.props.children}</div>
        </div>

        {this.props.showRightSidebar ? <RightSidebar /> : null}
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state: any) => {
  return {
    ...state.Layout,
  };
};
export default connect(mapStatetoProps, {
  changeTopbarTheme,
  changeLayout,
  changeLayoutWidth,
})(withRouter(Layout));
