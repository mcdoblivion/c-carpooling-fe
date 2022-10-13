import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/actions";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";

interface LayoutProps extends RouteComponentProps<any> {
  changeLayoutWidth: (param: any) => void;
  changeSidebarTheme: (param: any) => void;
  changeSidebarThemeImage: (param: any) => void;
  changeSidebarType: (param1: any, param2?: boolean) => void;
  changeTopbarTheme: (param: any) => void;
  children?: ReactNode;
  isPreloader?: any;
  layoutWidth?: any;
  leftSideBarTheme?: any;
  leftSideBarThemeImage?: any;
  leftSideBarType?: any;
  location: any;
  showRightSidebar?: any;
  topbarTheme?: any;
}
type LayoutState = {
  isMobile: boolean;
};

class Layout extends React.Component<LayoutProps, LayoutState> {
  constructor(props: LayoutProps) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
  }

  capitalizeFirstLetter = (string: string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

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

    // Scroll Top to 0
    window.scrollTo(0, 0);
    // let currentage = this.capitalizeFirstLetter(this.props.location.pathname)

    // document.title =
    //   currentage + " | Skote - React Admin & Dashboard Template"
    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }
    if (this.props.leftSideBarThemeImage) {
      this.props.changeSidebarThemeImage(this.props.leftSideBarThemeImage);
    }

    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }

    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
  }
  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile);
    } else if (this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile);
    }
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
          <Header toggleMenuCallback={this.toggleMenuCallback} />
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
          />
          <div className="main-content">{this.props.children}</div>
          <Footer />
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
  changeLayout,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
})(withRouter(Layout));
