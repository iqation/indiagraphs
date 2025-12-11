import Link from "next/link";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { getDictionary } from "@/app/account/locales/dictionary";

export default async function HeaderFeaturedNav() {
  const dict = await getDictionary();

  return (
    <Nav>
      <NavItem>
        <NavLink as={Link} href="/" className="p-2">
          {dict.featured_nav.dashboard}
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="#" className="p-2">
          {dict.featured_nav.users}
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink as={Link} href="#" className="p-2">
          {dict.featured_nav.settings}
        </NavLink>
      </NavItem>
    </Nav>
  );
}
