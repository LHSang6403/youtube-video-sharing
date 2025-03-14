import { gql } from "@apollo/client";

export const GET_VIDEOS = gql`
  query GetVideos {
    videos {
      id
      title
      videoUrl
      sharedBy
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      id
      username
      name
    }
  }
`;

export const SHARE_VIDEO_MUTATION = gql`
  mutation ShareVideo($shareVideoInput: ShareVideoInput!) {
    shareVideo(shareVideoInput: $shareVideoInput) {
      id
      title
      videoUrl
      sharedBy
    }
  }
`;
