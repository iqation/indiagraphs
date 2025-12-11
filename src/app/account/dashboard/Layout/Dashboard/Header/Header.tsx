import Link from "next/link";
import { Container } from "react-bootstrap";
import HeaderSidebarToggler from "./HeaderSidebarToggler";
import HeaderFeaturedNav from "./HeaderFeaturedNav";
import HeaderNotificationNav from "./HeaderNotificationNav";
import HeaderProfileNav from "./HeaderProfileNav";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function Header() {
  return (
    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom">
      <Container fluid className="header-navbar d-flex align-items-center px-0">
        <HeaderSidebarToggler />
        <Link href="/" className="header-brand d-md-none">
          <svg width="80" height="46">
            <title>CoreUI Logo</title>
            <use xlinkHref="/assets/brand/coreui.svg#full" />
          </svg>
        </Link>
        <div className="header-nav ms-auto d-flex align-items-center">
          <HeaderProfileNav />
        </div>
      </Container>
      <div className="header-divider border-top my-2 mx-sm-n2" />
      <Container fluid>
        <Breadcrumb />
      </Container>
    </header>
  );
}
