import { Header } from '@sberdevices/plasma-ui';

import { useBasePath } from '../utils';
/* <|#characterPrerender|> */
import { useCharacter } from '../utils/character';
/* <|/characterPrerender|> */

import { LinkList } from './LinkList';
/* <|#graphql|> */
import { dataCy } from './dataCy';
/* <|/graphql|> */

export const PageIndex = ({ component }: { component: React.ReactNode }) => {
    const basePath = useBasePath();
    /* <|#characterPrerender|> */
    const character = useCharacter();
    const characterElement = `Персонаж: ${character}`;
    /* <|/characterPrerender|> */

    return (
        <>
            <Header title="Добро пожаловать в SberDevices!" />
            {component}
            {/* <|#characterPrerender|> */ characterElement /* <|/characterPrerender|> */}
            {/* <|LinkList|> */}
            <LinkList
                links={[
                    /* <|#ssrDemo|> */
                    { href: '/SSR', content: 'Server-side rendering' },
                    /* <|/ssrDemo|> */
                    /* <|#ssgDemo|> */
                    { href: `${basePath}/SSG`, content: 'Static Generation / Incremental Static Regeneration' },
                    /* <|/ssgDemo|> */
                    /* <|#prefetchDemo|> */
                    { href: `${basePath}/prefetch`, content: 'Префетч следующей страницы' },
                    /* <|/prefetchDemo|> */
                    /* <|#imageOptimization|> */
                    { href: `${basePath}/image-optimization`, content: 'Оптимизация изображений' },
                    /* <|/imageOptimization|> */
                    /* <|#graphql|> */
                    {
                        href: `${basePath}/graphql-demo`,
                        content: 'Graphql',
                        dataCy: String(dataCy.index.graphqlDemoLink),
                    },
                    /* <|/graphql|> */
                ]}
            />
        </>
    );
};
