import React, {ReactElement} from "react";
import * as styles from "./cards/styles/RecentFeedCard.css";
import FlexBox from "../common/boxes/FlexBox";
import Image from "next/image";

interface Shop {
  title: string;
  description?: string;
  sido: string;
  sigungu: string;
  category: string;
}

interface RecentFeed {
  thumbnail?: string;
  content: string;
  shop?: Shop;
}

interface RecentFeedCardProps {
  recentFeed: RecentFeed;
}

export const RecentFeedCard = React.memo(({
                                            recentFeed,
                                          }: RecentFeedCardProps): ReactElement => {
  const {thumbnail, content, shop} = recentFeed;

  return (
    <article className={styles.recentFeedCardLayout}>
      <FlexBox gap={8} justifyContent={"flex-start"} flexDirection={'column'}>
        {thumbnail && (
          <div className={styles.recentFeedThumbnailImageBox}>
            <Image
              className={styles.thumbnailImage}
              src={thumbnail}
              alt={"profile_image"}
              priority={true}
              width={120}
              height={96}
            />
          </div>
        )}

        {shop && (
          <FlexBox
            flexDirection={"column"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            gap={10}
          >
            <p className={styles.shopTitle}>{shop.title}</p>
            <FlexBox
              flexDirection={"row"}
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              gap={4}
              className={styles.shopDetails}
            >
              <p className={styles.shopCategory}>{shop.category}</p>
              <p>{shop.sido} / {shop.sigungu}</p>
            </FlexBox>
          </FlexBox>
        )}

        <div className={styles.thumbnailCardContentBox}>
          <p className={styles.thumbnailCardContent}>{content}</p>
        </div>
      </FlexBox>
    </article>
  );
})

RecentFeedCard.displayName = 'RecentFeedCard';
