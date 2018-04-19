import './Editor.scss';
import React, { ChangeEvent } from 'react';
import { Article } from '../types';
import { Button } from 'antd';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import throttle from 'lodash/throttle';
import renderMarkdown from '../libs/markdown';

interface EditorProps {
    article: Article;
    onSubmit(title: string, content: string): Promise<void>;
}

interface EditorState {
    title: string;
    content: string;
    submitting: boolean;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
    state = {
        title: this.props.article.title,
        content: this.props.article.content,
        submitting: false
    };

    scrollbar: HTMLElement | null = null;
    preview: HTMLElement;
    scrollTogether: EventListener;

    onContentChange = throttle(content => this.setState({ ...this.state, content }), 240);

    onTitleChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            ...this.state,
            title: e.target.value
        });
    }

    async onSubmit() {
        this.setState({
            ...this.state,
            submitting: true
        });

        await this.props.onSubmit(this.state.title, this.state.content);

        this.setState({
            ...this.state,
            submitting: false
        });
    }

    componentDidMount() {
        const scrollbar = document.querySelector('.ace_scrollbar-v');

        if (scrollbar !== null) {
            this.scrollbar = scrollbar as HTMLElement;

            this.scrollTogether = event => {
                const rate = this.scrollbar!.scrollTop / this.scrollbar!.scrollHeight;
                this.preview.scrollTo({ top: this.preview.scrollHeight * rate });
            };

            this.scrollbar.addEventListener('scroll', this.scrollTogether);
        }
    }

    componentWillUnmount() {
        if (this.scrollbar !== null) {
            this.scrollbar.removeEventListener('scroll', this.scrollTogether);
        }
    }

    render() {
        return (
            <div className="flex-spacer">
                <div className="editor-title">
                    <input
                        value={this.state.title}
                        placeholder="Title here..."
                        name="title"
                        onChange={e => this.onTitleChange(e)}
                    />
                    <Button
                        type="primary"
                        className="editor-submit"
                        onClick={e => this.onSubmit()}
                        loading={this.state.submitting}
                    >
                        提交
                    </Button>
                </div>
                <div className="editor flex-spacer">
                    <AceEditor
                        name="md-editor"
                        className="md-content"
                        wrapEnabled
                        mode="markdown"
                        theme="tomorrow"
                        width="50%"
                        height="100%"
                        fontSize={14}
                        value={this.state.content}
                        editorProps={{ $blockScrolling: true }}
                        onChange={this.onContentChange}
                    />
                    <div
                        className="md-preview markdown-body"
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(this.state.content)
                        }}
                        ref={ref => this.preview = ref!}
                    />
                </div>
            </div>
        );
    }
}
