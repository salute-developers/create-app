import through2 from 'through2';

export const renamePlugin = (renameFunction) =>
    through2.obj((file, _, cb) => {
        renameFunction(file);
        cb(null, file);
    });
