/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This file does one thing - removes the unnecessary script
 * tags from the header, placed there by react-snap pre-render.
 * I have not been able to find a config option to disable it.
 */
const { parse, serialize } = require('parse5');
const { promises: fs } = require('fs');
const path = require('path');

const styleLinkFilter = (node) =>
    node.nodeName === 'link' && node.attrs[0].name === 'href' && node.attrs[0].value.indexOf('.css') !== -1;

const removeHeaderScripts = async () => {
    const htmlFilePath = path.resolve(process.cwd(), 'build', 'index.html');
    const assetsFilePath = path.resolve(process.cwd(), 'build', 'crit_path_assets.json');
    const fileContents = await fs.readFile(htmlFilePath, 'utf-8');
    const document = parse(fileContents);
    const head = document.childNodes[1].childNodes[0];
    // remove the script tags placed there by react-snap.
    // we don't need these, as webpack will do it for us
    // in a lazy manner
    let before = head.childNodes.length;
    head.childNodes = head.childNodes.filter((node) => node.nodeName !== 'script');
    let after = head.childNodes.length;
    console.info(`Removed ${before - after} scripts from the <head> element.`);
    // next we'll remove the styles from the head, to be loaded later in the page loading cycle
    // to be able to do that, we'll save the meta to a file that we'll load at runtime
    // actually we're loading just the main css chunk
    before = head.childNodes.length;
    let removed = head.childNodes.filter((node) => styleLinkFilter(node) && node.attrs[0].value.indexOf('main') !== -1);
    head.childNodes = head.childNodes.filter((node) => !styleLinkFilter(node));
    after = head.childNodes.length;
    // remove circular refs
    removed = removed.map((node) => {
        delete node.parentNode;
        return node;
    });
    console.info(`Removed ${before - after} styles from the <head> element.`);
    const revisedContents = serialize(document);
    await fs.writeFile(htmlFilePath, revisedContents, 'utf-8');
    await fs.writeFile(assetsFilePath, JSON.stringify(removed), 'utf-8');
    console.info(`Saved ${htmlFilePath}`);
};

removeHeaderScripts();
