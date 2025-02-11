import { ReactElement} from "react";
import * as styles from './styles/MyFeedSkeleton.css';
import FlexBox from "@components/common/boxes/FlexBox";
import classNames from "classnames";


export const MyFeedSkeleton = (): ReactElement => {

  return (
    <div className={styles.myFeedSkeletonContainer}>
      <FlexBox flexDirection={"column"} gap={10}>
        <div className={classNames(styles.skeletonOverlay, styles.thumbnail)} />
        <div className={styles.contentWrapper}>
          <div className={classNames(styles.skeletonOverlay, styles.content)} />
          <div className={classNames(styles.skeletonOverlay, styles.content)} />
          <div className={classNames(styles.skeletonOverlay, styles.content)} />
          <div className={classNames(styles.skeletonOverlay, styles.content)} />
          <div className={classNames(styles.skeletonOverlay, styles.content)} />
        </div>
      </FlexBox>
    </div>
  )
}
