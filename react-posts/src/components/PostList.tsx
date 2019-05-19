import React from "react";
import { connect } from "react-redux";
import { fetchPostsAndUsers } from "../actions";
import { State, Post } from "../types";
import UserHeader from "./UserHeader";

interface MappedProps {
  posts: Array<Post>;
}

interface DispatchProps {
  fetchPostsAndUsers: () => void;
}

type PostListProps = MappedProps & DispatchProps;

class PostList extends React.Component<PostListProps, {}> {
  componentDidMount() {
    this.props.fetchPostsAndUsers();
  }

  renderPosts(posts: Post[]): JSX.Element[] {
    return posts.map((post: Post) => {
      return (
        <div className="item" key={post.id}>
          <i className="large middle aligned icon user" />
          <div className="content">
            <div className="description">
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </div>
            <UserHeader userId={post.userId} />
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="ui relaxed divided list">
        {this.renderPosts(this.props.posts)}
      </div>
    );
  }
}

function mapStateToProps(state: State): MappedProps {
  return { posts: state.posts };
}

export default connect<MappedProps, DispatchProps, {}, State>(
  mapStateToProps,
  {
    fetchPostsAndUsers
  }
)(PostList);
