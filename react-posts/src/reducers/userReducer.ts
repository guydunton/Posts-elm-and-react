import { AnyAction } from "redux";
import { User, ActionTypes, IFetchUserAction } from "../types";

export const userReducer = (
  state: Array<User> = [],
  action: AnyAction
): Array<User> => {
  switch (action.type) {
    case ActionTypes.FetchUser:
      let newUserAction = action as IFetchUserAction;
      let newUser: User = newUserAction.payload;

      if (state.find((user: User) => user.id === newUser.id) !== undefined) {
        return state;
      } else {
        return [...state, newUser];
      }

    default:
      return state;
  }
};
