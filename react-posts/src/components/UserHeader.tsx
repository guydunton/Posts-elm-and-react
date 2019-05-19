import React from "react";
import { connect } from "react-redux";
import { User, State } from "../types";

interface ComponentProps {
  userId: number;
}

interface MappedProps {
  user: User | null;
}

type UserHeaderProps = ComponentProps & MappedProps;

const UserHeader = (props: UserHeaderProps) => {
  const userText = (user: User | null): String | null => {
    if (user) {
      return user.name;
    }
    return null;
  };

  return <div className="header">{userText(props.user)}</div>;
};

function mapStateToProps(state: State, ownProps: ComponentProps): MappedProps {
  let user: User | null;
  let storedUser = state.users.find(
    (user: User) => user.id === ownProps.userId
  );

  if (storedUser === undefined) {
    user = null;
  } else {
    user = storedUser;
  }

  return { user };
}

export default connect(mapStateToProps)(UserHeader);
