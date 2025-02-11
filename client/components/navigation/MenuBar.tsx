"use client";

import { ReactElement, useEffect, useState } from "react";
import * as styles from "./styles/MenuBar.css";
import {
  RiHome5Line,
  RiMessage3Line,
  RiPencilFill,
  RiUserLine,
} from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { CiViewList } from "react-icons/ci";
import useModalStore, { ModalType } from "@states/store/modalStore";
import { useSession } from "next-auth/react";
import { ModalHandler } from "@components/common/modal/ModalHandler";
import { SignUpAlert } from "@components/alert-box/SignUpAlert";

const link = {
  home: { label: "홈", to: "/" },
  myFeedLists: { label: "내가 작성한 게시글", to: "/feeds/" },
  posts: { label: "글작성", to: "/feeds/post/" },
  timeline: { label: "소식", to: "/timeline/" },
  management: { label: "마이", to: "/management/" },
};

export const MenuBar = (): ReactElement => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);
  const { setIsOpen, setModalType, type } = useModalStore();
  const { data: session } = useSession();

  useEffect(() => {
    if (pathname.includes("search")) setCurrentPath("/");
    else setCurrentPath(pathname);
  }, [currentPath, pathname]);

  const onClickHandlerMenu = async (to: string): Promise<void> => {
    const targetLink =
      to === link.posts.to ||
      to === link.myFeedLists.to ||
      to === link.timeline.to;
    if (targetLink && !session) {
      setModalType(ModalType.SIGN_ALERT);
      setIsOpen(true);
      return;
    }
    setCurrentPath(to);
    router.push(to);
  };

  const active = (to: string): string => {
    if (to === "/feeds" && pathname === "/feeds") {
      return "#FF7101";
    }

    if (to === "/feeds/" && pathname.startsWith("/feeds/")) {
      return "#FF7101";
    }
    return currentPath === to ? "#FF7101" : "#646464";
  };

  return (
    <>
      <nav className={styles.navBarBottomLayout}>
        <ul className={styles.navBarBottomContainer}>
          <li className={styles.navBarLeftBox}>
            <button
              aria-label="home-button"
              type={"button"}
              className={styles.buttonItem}
              onClick={() => onClickHandlerMenu(link.home.to)}
            >
              <RiHome5Line size={22} color={active(link.home.to)} />
            </button>
            <button
              aria-label="pick-button"
              type={"button"}
              className={styles.buttonItem}
              onClick={() => onClickHandlerMenu(link.myFeedLists.to)}
            >
              <CiViewList size={22} color={active(link.myFeedLists.to)} />
            </button>
          </li>
          <li className={styles.navBarCenterBox}>
            <button
              type={"button"}
              aria-label={"post_register_button"}
              className={styles.navBarCenterButton}
              onClick={() => onClickHandlerMenu(link.posts.to)}
            >
              <RiPencilFill size={22} color={"#fff"} />
            </button>
          </li>
          <li className={styles.navBarRightBox}>
            <button
              aria-label="message-button"
              type={"button"}
              className={styles.buttonItem}
              onClick={() => onClickHandlerMenu(link.timeline.to)}
            >
              <RiMessage3Line size={22} color={active(link.timeline.to)} />
            </button>
            <button
              aria-label="management-button"
              type={"button"}
              className={styles.buttonItem}
              onClick={() => onClickHandlerMenu(link.management.to)}
            >
              <RiUserLine size={22} color={active(link.management.to)} />
            </button>
          </li>
        </ul>
      </nav>
      {type === ModalType.SIGN_ALERT && (
        <ModalHandler modalType={ModalType.SIGN_ALERT}>
          <SignUpAlert />
        </ModalHandler>
      )}
    </>
  );
};
