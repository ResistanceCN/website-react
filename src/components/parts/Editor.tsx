import './Editor.scss';
import React, { ChangeEvent } from 'react';
import { Article } from '@/types';
import { Button, Popover } from 'antd';
import Measure, { BoundingRect, ContentRect } from 'react-measure';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import renderMarkdown from '@/libs/markdown';
import MarkdownWorker from 'worker-loader!@/libs/markdownWorker';

let workerInstance: MarkdownWorker;

function getWorker() {
    if (!workerInstance) {
        workerInstance = new MarkdownWorker();
    }

    return workerInstance;
}

interface EditorProps {
    className?: string;
    article: Article;
    readonly?: boolean;
    submitButtonDisabled?: boolean;
    submitText?: string;
    cancelText?: string;
    onSubmit(title: string, content: string): Promise<void>;
    onCancel(): void;
}

interface EditorState {
    title: string;
    content: string;
    renderedContent: string;
    submitting: boolean;
    editorBounds?: BoundingRect;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
    static copyrightDescription = (
        <React.Fragment>
            <p>您在本站提交文章时，即授权本站以 CC BY-NC-SA 协议发布该文章。</p>
            <p><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank">
                什么是 CC BY-NC-SA?
            </a></p>
        </React.Fragment>
    );

    state = {
        title: this.props.article.title,
        content: this.props.article.content,
        renderedContent: renderMarkdown(this.props.article.content),
        submitting: false,
        editorBounds: undefined
    };

    worker = getWorker();
    scrollbar: HTMLElement | null = null;
    preview: HTMLElement;
    scrollTogether: EventListener;

    updatePreview = (e: MessageEvent) => {
        this.setState({
            renderedContent: e.data
        });
    };

    onContentChange = (content: string) => {
        this.setState({ content });
        this.worker.postMessage(content);
    };

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

        this.worker.onmessage = this.updatePreview;
    }

    componentWillUnmount() {
        this.worker.onmessage = null;

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
                        readOnly={this.props.readonly}
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
                                    readOnly={this.props.readonly || false}
                                />
                            </div>
                        )}
                    </Measure>

                    <div
                        className="md-preview markdown-body"
                        dangerouslySetInnerHTML={{
                            __html: this.state.renderedContent
                        }}
                        ref={ref => this.preview = ref!}
                    />
                </div>

                <div className="editor-footer">
                    <Popover content={Editor.copyrightDescription} title="著作权说明" placement="topLeft">
                        <img className="cc-icon" src="/assets/img/cc/cc.svg" alt="CC" />
                        <img className="cc-icon" src="/assets/img/cc/by.svg" alt="BY" />
                        <img className="cc-icon" src="/assets/img/cc/nc.svg" alt="NC" />
                        <img className="cc-icon" src="/assets/img/cc/sa.svg" alt="SA" />
                    </Popover>

                    <div className="flex-spacer" />

                    <Button
                        style={{ display: this.state.submitting ? 'none' : 'inline-block' }}
                        onClick={this.props.onCancel}
                    >
                        {this.props.cancelText || '取消'}
                    </Button>

                    <Button
                        type="primary"
                        className="submit-button"
                        onClick={this.onSubmit}
                        loading={this.state.submitting}
                        disabled={this.props.submitButtonDisabled || false}
                    >
                        {this.props.submitText || '提交'}
                    </Button>
                </div>
            </div>
        );
    }
}
