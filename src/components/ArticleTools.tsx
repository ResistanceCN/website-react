import React from 'react';
import { User } from '../types';
import { connect, Dispatch } from 'react-redux';
import { State } from '../reducers';
import { Icon } from 'antd';

interface ArticleToolsProps {
    user: User;
}

class ArticleTools extends React.Component<ArticleToolsProps> {
    render() {
        const { user } = this.props;

        if (user !== null) {
            return (
                <div className="tools">
                    <Icon type="ellipsis" />
                    <Icon type="delete" />
                    <Icon type="pushpin-o" />
                    <Icon type="edit" />
                    <Icon type="heart-o" />
                </div>
            );
        }

        return (
            <div className="tools">
                <Icon type="ellipsis" />
                <Icon type="heart-o" />
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    user: state.auth.user
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleTools);
