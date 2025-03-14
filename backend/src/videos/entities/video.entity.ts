import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VideoEntity {
  @Field(() => Int)
  id: number;

  @Field()
  videoUrl: string;

  @Field()
  title: string;

  @Field()
  sharedBy: string;
}
