import {
  ActionTypes,
  IFetchPostsAction,
  IFetchUserAction,
  State,
  Post
} from "../types";
import JsonPlaceholder from "../apis/JsonPlaceholder";

const fetchPosts = () => {
  return async (dispatch: any) => {
    const response = await JsonPlaceholder.get("/posts");

    const newAction: IFetchPostsAction = {
      type: ActionTypes.FetchPosts,
      payload: response.data
    };
    dispatch(newAction);
  };
};

const fetchUser = (userId: number) => {
  return async (dispatch: any) => {
    const response = await JsonPlaceholder.get("/users/" + userId.toString());

    const newAction: IFetchUserAction = {
      type: ActionTypes.FetchUser,
      payload: response.data
    };
    dispatch(newAction);
  };
};

function distinct<T>(value: T, index: number, self: Array<T>): boolean {
  return self.indexOf(value) === index;
}

export const fetchPostsAndUsers = () => {
  return async (dispatch: any, getState: () => State) => {
    await dispatch(fetchPosts());
    let { posts } = getState();

    posts
      .map((post: Post) => post.userId)
      .filter(distinct)
      .forEach((id: number) => {
        dispatch(fetchUser(id));
      });
  };
};
