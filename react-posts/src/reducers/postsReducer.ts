import { AnyAction } from "redux";
import { ActionTypes, IFetchPostsAction, Post } from "../types";

export const postsReducer = (state: Post[] = [], action: AnyAction): Post[] => {
  switch (action.type) {
    case ActionTypes.FetchPosts:
      return (action as IFetchPostsAction).payload;

    default:
      return state;
  }
};
