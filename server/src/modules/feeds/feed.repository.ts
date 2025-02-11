import { Injectable } from '@nestjs/common';
import { Feed, FeedDocument } from './schema/feed.schema';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTIONS, ConnectionNames } from '@database/database.config';
import { FilterQuery, Model } from 'mongoose';
import { CreateFeedPayloadDto } from './dto/create.feed.dto';
import { Projection } from '@lib/type/projection.type';
import { ObjectId } from 'mongodb';

@Injectable()
export class FeedRepository {
  constructor(
    @InjectModel(Feed.name, ConnectionNames.GO_FOODIE)
    private readonly feedModel: Model<FeedDocument>,
  ) {}

  async findOne(
    $filter: FilterQuery<FeedDocument>,
    $projection?: Projection<FeedDocument>,
  ) {
    return this.feedModel.findOne({ ...$filter }, { ...$projection }).lean();
  }

  async saveFeed(createFeed: CreateFeedPayloadDto): Promise<FeedDocument> {
    const model = new this.feedModel(createFeed);
    return model.save();
  }

  async findOneFeedDetail(_id: ObjectId) {
    return this.feedModel
      .aggregate([
        {
          $match: { _id, isDeleted: false },
        },
        {
          $lookup: {
            from: COLLECTIONS.SHOP,
            localField: 'shopId',
            foreignField: '_id',
            as: 'shop',
          },
        },
        {
          $unwind: '$shop',
        },
        {
          $lookup: {
            from: COLLECTIONS.USERS,
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: COLLECTIONS.FILES_FEED_THUMBNAIL,
            localField: 'feedFileIds',
            foreignField: '_id',
            as: 'filePaths',
          },
        },
        {
          $lookup: {
            from: COLLECTIONS.FILES_FEED_THUMBNAIL,
            localField: 'feedFileIds',
            foreignField: '_id',
            as: 'filePaths',
          },
        },
        {
          $lookup: {
            from: COLLECTIONS.FEEDS_COMMENT,
            localField: '_id',
            foreignField: 'feedId',
            as: 'comments',
          },
        },
        {
          $lookup: {
            from: COLLECTIONS.USERS, // USERS 컬렉션
            localField: 'comments.userId', // comments의 userId와
            foreignField: '_id', // USERS 컬렉션의 _id 필드를 조인
            as: 'commentUsers', // 결과를 저장할 필드
          },
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: '$comments',
                as: 'comment',
                in: {
                  $mergeObjects: [
                    '$$comment',
                    {
                      user: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$commentUsers',
                              as: 'commentUser',
                              cond: {
                                $eq: ['$$commentUser._id', '$$comment.userId'],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: { commentUsers: 0 },
        },
      ])
      .exec();
  }

  async findFeedLists(
    region: string,
    $skip: number,
    $limit: number,
  ): Promise<FeedDocument[]> {
    const pipeline: any[] = [
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: COLLECTIONS.SHOP,
          localField: 'shopId',
          foreignField: '_id',
          as: 'shop',
        },
      },
      {
        $unwind: '$shop',
      },
    ];

    if (region !== '전체') {
      pipeline.push({
        $match: { 'shop.sido': region },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: COLLECTIONS.USERS,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: COLLECTIONS.FILES_FEED_THUMBNAIL,
          localField: 'feedFileIds',
          foreignField: '_id',
          as: 'filePaths',
        },
      },
      {
        $skip,
      },
      {
        $limit,
      },
      {
        $sort: {
          createdDate: -1,
        },
      },
    );

    return this.feedModel.aggregate(pipeline).exec();
  }

  async findMyFeedLists(
    userId: ObjectId,
    $skip: number,
    $limit: number,
  ): Promise<FeedDocument[]> {
    return this.feedModel
      .aggregate([
        { $match: { userId, isDeleted: false } },
        {
          $lookup: {
            from: COLLECTIONS.SHOP,
            localField: 'shopId',
            foreignField: '_id',
            as: 'shop',
          },
        },
        {
          $unwind: '$shop',
        },
        {
          $lookup: {
            from: COLLECTIONS.USERS,
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $lookup: {
            from: COLLECTIONS.FILES_FEED_THUMBNAIL,
            localField: 'feedFileIds',
            foreignField: '_id',
            as: 'filePaths',
          },
        },
        {
          $skip,
        },
        {
          $limit,
        },
        {
          $sort: {
            createdDate: -1,
          },
        },
      ])
      .exec();
  }

  async findRecentlyFeed(userId: ObjectId) {
    return this.feedModel
      .aggregate([
        { $match: { userId, isDeleted: false } },
        {
          $lookup: {
            from: COLLECTIONS.SHOP,
            localField: 'shopId',
            foreignField: '_id',
            as: 'shop',
          },
        },
        {
          $unwind: '$shop',
        },
        {
          $lookup: {
            from: COLLECTIONS.FILES_FEED_THUMBNAIL,
            localField: 'feedFileIds',
            foreignField: '_id',
            as: 'files',
          },
        },
        {
          $sort: { createdDate: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .exec();
  }
}
