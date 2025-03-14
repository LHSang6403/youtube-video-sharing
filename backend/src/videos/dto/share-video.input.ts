import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ShareVideoInput {
  @Field()
  videoUrl: string;

  @Field()
  title: string;
}
