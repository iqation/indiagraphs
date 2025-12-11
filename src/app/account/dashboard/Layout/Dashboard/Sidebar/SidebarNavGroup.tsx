"use client";

import { PropsWithChildren, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Props = {
  toggleText: string;
  toggleIcon?: IconDefinition;
} & PropsWithChildren;

export default function SidebarNavGroup({
  toggleText,
  toggleIcon,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-group">
      {/* Toggle Button */}
      <button
        type="button"
        className="nav-link sidebar-link mx-3 w-100 bg-transparent border-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        {toggleIcon ? (
          <FontAwesomeIcon className="sidebar-icon" icon={toggleIcon} />
        ) : (
          <span className="sidebar-icon" />
        )}

        <span className="sidebar-label">{toggleText}</span>

        <span className={`sidebar-arrow ${open ? "open" : ""}`}>▸</span>
      </button>

      {/* Submenu */}
      {open && (
        <ul className="nav-group-items list-unstyled ps-4">{children}</ul>
      )}
    </li>
  );
}
