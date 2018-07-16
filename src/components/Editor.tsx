import './Editor.scss';
import React, { ChangeEvent } from 'react';
import { Article } from '../types';
import { Button } from 'antd';
import Measure, { BoundingRect, ContentRect } from 'react-measure';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import throttle from 'lodash/throttle';
import renderMarkdown from '../libs/markdown';

interface EditorProps {
    className?: string;
    article: Article;
    onSubmit(title: string, content: string): Promise<void>;
    onCancel(): void;
}

interface EditorState {
    title: string;
    content: string;
    submitting: boolean;
    editorBounds?: BoundingRect;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
    state = {
        title: this.props.article.title,
        content: this.props.article.content,
        submitting: false,
        editorBounds: undefined
    };

    scrollbar: HTMLElement | null = null;
    preview: HTMLElement;
    scrollTogether: EventListener;

    onContentChange = throttle(content => this.setState({ content }), 240);

    onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            title: e.target.value
        });
    };

    onSubmit = async () => {
        this.setState({
            submitting: true
        });

        await this.props.onSubmit(this.state.title, this.state.content);

        // @TODO: Generates a warning if there's a redirection in this.props.onSubmit()
        this.setState({
            submitting: false
        });
    };

    onEditorMeasure = (rect: ContentRect) => {
        this.setState({
            editorBounds: rect.bounds
        });
    };

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
        const editorBounds = this.state.editorBounds || { height: 0 };
        const editorHeight = editorBounds.height + 'px';

        return (
            <div className={(this.props.className || '') + ' editor-container'}>
                <div className="editor-title">
                    <input
                        value={this.state.title}
                        placeholder="Title here..."
                        name="title"
                        onChange={this.onTitleChange}
                    />
                </div>

                <div className="editor flex-spacer">
                    <Measure
                        bounds
                        onResize={this.onEditorMeasure}
                    >
                        {({ measureRef }) => (
                            <div className="md-editor-measurer" ref={measureRef}>
                                <AceEditor
                                    name="md-editor"
                                    className="md-content"
                                    wrapEnabled
                                    mode="markdown"
                                    theme="tomorrow"
                                    width="100%"
                                    height={editorHeight}
                                    fontSize={14}
                                    value={this.state.content}
                                    editorProps={{ $blockScrolling: true }}
                                    onChange={this.onContentChange}
                                />
                            </div>
                        )}
                    </Measure>

                    <div
                        className="md-preview markdown-body"
                        dangerouslySetInnerHTML={{
                            __html: renderMarkdown(this.state.content)
                        }}
                        ref={ref => this.preview = ref!}
                    />
                </div>

                <div className="editor-footer">
                    <div className="flex-spacer" />

                    <Button
                        style={{ display: this.state.submitting ? 'none' : 'inline-block' }}
                        onClick={this.props.onCancel}
                    >
                        取消
                    </Button>

                    <Button
                        type="primary"
                        className="submit-button"
                        onClick={this.onSubmit}
                        loading={this.state.submitting}
                    >
                        提交
                    </Button>
                </div>
            </div>
        );
    }
}
