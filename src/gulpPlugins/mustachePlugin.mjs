import Mustache from 'mustache';
import through2 from 'through2';

export const mustachePlugin = (featureToggles, tags) =>
    through2.obj((file, _, cb) => {
        const template = file.contents.toString();
        const rendered = Mustache.render(template, featureToggles, {}, tags);
        file.contents = Buffer.from(rendered);

        cb(null, file);
    });
