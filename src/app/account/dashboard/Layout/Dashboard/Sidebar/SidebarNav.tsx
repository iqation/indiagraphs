import {
  faAddressCard,
  faBell,
  faFileLines,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBug,
  faCalculator,
  faChartPie,
  faCode,
  faDroplet,
  faGauge,
  faLayerGroup,
  faLocationArrow,
  faPencil,
  faPuzzlePiece,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import React, { PropsWithChildren } from "react";
import { Badge } from "react-bootstrap";
import SidebarNavGroup from "./SidebarNavGroup";
import SidebarNavItem from "./SidebarNavItem";
import { getDictionary } from "@/app/account/locales/dictionary";

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">
      {children}
    </li>
  );
};

export default async function SidebarNav() {
  const dict = await getDictionary();
  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/account/dashboard">
        {dict.sidebar.items.dashboard}
      </SidebarNavItem>

      <SidebarNavItem icon={faChartPie} href="/account/dashboard/demo">
        {dict.sidebar.items.charts}
      </SidebarNavItem>

      <SidebarNavTitle>{dict.sidebar.items.components}</SidebarNavTitle>
      <SidebarNavGroup
        toggleIcon={faPuzzlePiece}
        toggleText={dict.sidebar.items.base}
      >
        <SidebarNavItem href="#">{dict.sidebar.items.accordion}</SidebarNavItem>
        <SidebarNavItem href="#">
          {dict.sidebar.items.breadcrumb}
        </SidebarNavItem>
      </SidebarNavGroup>

      
    </ul>
  );
}
