import {
  Badge,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCreditCard,
  faEnvelopeOpen,
  faFile,
  faMessage,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faGear,
  faListCheck,
  faLock,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import HeaderLogout from "./HeaderLogout";
import { getDictionary } from "@/app/account/locales/dictionary";

export default async function HeaderProfileNav() {
  const dict = await getDictionary();

  const ItemWithIcon = ({ icon, children }: any) => (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  );

  return (
    <Nav>
      <Dropdown as={NavItem}>
        <DropdownToggle
          variant="link"
          bsPrefix="hide-caret"
          className="py-0 px-2 rounded-0"
          id="dropdown-profile"
        >
          <div className="avatar position-relative">
            <img
              src="/assets/img/avatars/admin.svg"
              alt="user"
              className="h-7 w-7 rounded-full border"
            />
          </div>
        </DropdownToggle>

        <DropdownMenu className="pt-0">
          <DropdownHeader className="fw-bold rounded-top">
            {dict.profile.account.title}
          </DropdownHeader>

          {/* ✔ No legacyBehavior — correct way */}
          <DropdownItem as={Link} href="#">
            <ItemWithIcon icon={faBell}>
              {dict.profile.account.items.updates}
              <Badge bg="info" className="ms-2">
                42
              </Badge>
            </ItemWithIcon>
          </DropdownItem>

          <DropdownItem as={Link} href="#">
            <ItemWithIcon icon={faEnvelopeOpen}>
              {dict.profile.account.items.messages}
              <Badge bg="success" className="ms-2">
                42
              </Badge>
            </ItemWithIcon>
          </DropdownItem>

          <DropdownItem as={Link} href="#">
            <ItemWithIcon icon={faListCheck}>
              {dict.profile.account.items.tasks}
              <Badge bg="danger" className="ms-2">
                42
              </Badge>
            </ItemWithIcon>
          </DropdownItem>

          <DropdownHeader className="fw-bold">
            {dict.profile.settings.title}
          </DropdownHeader>

          <DropdownItem as={Link} href="#">
            <ItemWithIcon icon={faUser}>
              {dict.profile.settings.items.profile}
            </ItemWithIcon>
          </DropdownItem>

          <DropdownItem as={Link} href="#">
            <ItemWithIcon icon={faGear}>
              {dict.profile.settings.items.settings}
            </ItemWithIcon>
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem as={Link} href="#">
            <ItemWithIcon icon={faLock}>
              {dict.profile.lock_account}
            </ItemWithIcon>
          </DropdownItem>

          {/* ✔ Logout (No <Link>) */}
          <HeaderLogout>
            <DropdownItem as="button">
              <ItemWithIcon icon={faPowerOff}>
                {dict.profile.logout}
              </ItemWithIcon>
            </DropdownItem>
          </HeaderLogout>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  );
}
