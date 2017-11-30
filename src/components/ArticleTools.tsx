import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { State } from '../reducers';
import { Icon } from 'antd';

interface ArticleToolsProps {
    manageMode: boolean;
}

class ArticleTools extends React.Component<ArticleToolsProps> {
    render() {
        if (this.props.manageMode) {
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

const mapStateToProps = (state: State) => ({});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleTools);
