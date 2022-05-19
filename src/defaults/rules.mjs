const JS_COMMENT_EXTENSIONS = ['.ts', '.tsx', '.json', '.js', '.jsx', '.mustache', '.css'];
const HTML_COMMENT_EXTENSIONS = ['.md', '.html'];

export const defaultRules = [
    {
        test: (path) => JS_COMMENT_EXTENSIONS.includes(path.extname),
        tags: ['/* <|', '|> */'],
    },
    {
        test: (path) => HTML_COMMENT_EXTENSIONS.includes(path.extname),
        tags: ['<!-- <|', '|> -->'],
    },
];
