import { Action } from "redux";

export interface Post {
  userId: number;
  id: number;
  title: String;
  body: String;
}

export interface User {
  id: number;
  name: String;
}

export interface State {
  posts: Array<Post>;
  users: Array<User>;
}

export enum ActionTypes {
  FetchPosts,
  FetchUser
}

export interface IFetchPostsAction extends Action {
  type: ActionTypes.FetchPosts;
  payload: Array<Post>;
}

export interface IFetchUserAction extends Action {
  type: ActionTypes.FetchUser;
  payload: User;
}
