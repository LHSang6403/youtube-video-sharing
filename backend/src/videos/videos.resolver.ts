import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { VideoEntity } from './entities/video.entity';
import { VideosService } from './videos.service';
import { ShareVideoInput } from './dto/share-video.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@Resolver(() => VideoEntity)
export class VideosResolver {
  constructor(private videosService: VideosService) {}

  @Query(() => [VideoEntity])
  @UseGuards(GqlAuthGuard)
  async videos(): Promise<VideoEntity[]> {
    const videos = await this.videosService.getVideos();

    return videos.map((video) => ({
      id: video.id,
      videoUrl: video.videoUrl,
      title: video.title,
      sharedBy: video.user.name,
    }));
  }

  @Mutation(() => VideoEntity)
  @UseGuards(GqlAuthGuard)
  async shareVideo(
    @Args('shareVideoInput') shareVideoInput: ShareVideoInput,
    @Context() context: any,
  ): Promise<VideoEntity> {
    const user = context.req.user;
    const video = await this.videosService.shareVideo(shareVideoInput, user);

    return {
      id: video.id,
      videoUrl: video.videoUrl,
      title: video.title,
      sharedBy: video.user.name,
    };
  }
}
