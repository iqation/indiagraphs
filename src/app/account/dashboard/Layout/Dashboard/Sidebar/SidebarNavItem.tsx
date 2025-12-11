"use client";

import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import React, { PropsWithChildren } from "react";
import { useSidebar } from "../SidebarProvider";
import { NavItem } from "react-bootstrap";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  href: string;
  icon?: IconDefinition;
} & PropsWithChildren;

export default function SidebarNavItem({ href, icon, children }: Props) {
  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar();

  return (
    <NavItem>
      <Link
        href={href}
        className="nav-link sidebar-link mx-3"
        onClick={() => setIsShowSidebar(false)}
      >
        {icon ? (
          <FontAwesomeIcon className="sidebar-icon" icon={icon} />
        ) : (
          <span className="sidebar-icon" />
        )}

        <span className="sidebar-label">{children}</span>
      </Link>
    </NavItem>
  );
}
