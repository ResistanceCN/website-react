export default `> Markdown 是一种轻量级的标记语言，能够以一种简单高效的方式编写文档，而不需要过多的关注文档样式本身。

*详细教程可以在其他网站上查询，例如：http://xianbai.me/learn-md/index.html ，教程基本通用。*

## 撰写

常见的使用方式分为在线使用和离线使用两种，在线使用可以去找一些提供在线预览和编辑 Markdown 文件的网站:

- [作业部落](https://www.zybuluo.com/mdeditor)
- [Stackedit](https://stackedit.io/)
- [Dillinger](http://dillinger.io/)

离线使用可以选择一些自己喜欢的编辑器，以下为举例:

- [Typora](https://typora.io/)
- [Atom](https://atom.io)

## 结构

就像一本书有书名，章标题和节标题一样，Markdown 也依靠这些层级结构来构成一片文章或者是一本书。

\`\`\`markdown
# 一级标题

## 二级标题

### 三级标题

普通段落
\`\`\`

## 元素

### 段落

\`\`\`markdown
段落1

段落2
\`\`\`

段落换行需要在其后面空出一行，有些编辑器会自动做段落换行，比如 [Typora](https://typora.io/)。

### 图片

一般插图格式为：

\`\`\`markdown
![图片描述，可选](https://xxx)
\`\`\`

<!--
如果要给图片指定大小为 100x200，则在图片地址后加上 =100x200，如：

\`\`\`markdown
![](https://xxx =100x200)
\`\`\`

如果要指定图片宽度为 100，高度为自动（即让图片维持原长宽比），把高度设置为 * 即可，如：

\`\`\`markdown
![](https://xxx =100x*)
\`\`\`

注意：指定图片尺寸不是标准 Markdown 的行为，大多数平台都不支持指定图片尺寸。
-->

示例：

![Panda](http://img.blog.csdn.net/20151109165400641)

### 链接

\`\`\`markdown
[链接文字](https://xxx)
\`\`\`

效果：[链接文字](https://xxx)

### 引用

\`\`\`markdown
> 引用文字
>
> 引用文字
>
> > 嵌套引用
> >
> > 嵌套引用
>
> 引用文字
\`\`\`

注意引用的换行也要遵守段落的规则，即两段落间要空一行。

效果：

> 天祥臨刑從容。南向拜而死，年四十七。
>
> 其絶筆曰：
>
> > 孔曰成仁，孟云取義；
> >
> > 惟其義盡，所以仁至。
> >
> > 讀聖賢書，所學何事；
> >
> > 而今而後，庶幾無愧！

### 列表

\`\`\`markdown
- 列表 (不带序号)
- 列表 (不带序号)
    - 子列表 (不带序号)
    - 子列表 (不带序号)
    - 子列表 (不带序号)
- 列表 (不带序号)

1. 列表 (带序号)
    1. 子列表 (带序号)
    2. 子列表 (带序号)
    3. 子列表 (带序号)
2. 列表 (带序号)

- [ ] 待办事项
- [ ] Eat
- [x] Code
    - [x] HTML
    - [x] CSS
    - [x] JavaScript
- [ ] Sleep
\`\`\`

效果：

- 列表 (不带序号)
- 列表 (不带序号)
    - 子列表 (不带序号)
    - 子列表 (不带序号)
    - 子列表 (不带序号)
- 列表 (不带序号)

1. 列表 (带序号)
    1. 子列表 (带序号)
    2. 子列表 (带序号)
    3. 子列表 (带序号)
2. 列表 (带序号)

- [ ] 待办事项
- [ ] Eat
- [x] Code
    - [x] HTML
    - [x] CSS
    - [x] JavaScript
- [ ] Sleep

### 表格

\`\`\`markdown
name | age
---- | ---
LearnShare | 12
Mike |  32
\`\`\`

效果如下

| name       | age  |
| ---------- | ---- |
| LearnShare | 12   |
| Mike       | 32   |

还可以实现一些对齐功能

- \`:---\` 代表左对齐
- \`:--:\` 代表居中对齐
- \`---:\` 代表右对齐

\`\`\`markdown
| left | center | right |
| :--- | :----: | ----: |
| aaaa | bbbbbb | ccccc |
| a    | b      | c     |
\`\`\`

效果如下：

| left | center | right |
| :--- | :----: | ----: |
| aaaa | bbbbbb | ccccc |
| a    |   b    |     c |

### 分割线

可以用 \`---\` 或者 \`***\` 来创建。效果：

---

### 代码

行内代码： <code>\\\`yarn add showdown\\\`</code>

代码块：

<pre>
\`\`\`
fun main() {
    println("Hello World!")
}
\`\`\`
</pre>

部分编辑器会支持代码块的代码高亮，需要在第一个 <code>\\\`\\\`\\\`</code> 后面跟上代码语言，例如 <code>\\\`\\\`\\\`markdown</code>

### ASCIIMath 公式

\`\`\`asciimath
%x = (-b +- sqrt(b^2 - 4ac)) / (2a)%
\`\`\`

效果：%x = (-b +- sqrt(b^2 - 4ac)) / (2a)%

### LaTeX 公式

行内公式：\`$l = \\alpha \\cdot R$\`

效果：$l = \\alpha \\cdot R$

公式块：

\`\`\`latex
$$
f(x;\\mu,\\sigma^2) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{ -\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2 }
$$
\`\`\`

效果：

$$
f(x;\\mu,\\sigma^2) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{ -\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2 }
$$

注意：LaTeX 和 ASCIIMath 公式不是标准 Markdown 的行为。少部分平台不支持 LaTeX 公式；大多数平台都不支持 ASCIIMath 公式。
`;
