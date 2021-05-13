/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This file does one thing - removes the unnecessary script
 * tags from the header, placed there by react-snap pre-render.
 * I have not been able to find a config option to disable it.
 */
const { parse, serialize } = require('parse5');
const { promises: fs } = require('fs');
const path = require('path');

const removeHeaderScripts = async () => {
    const filePath = path.resolve(process.cwd(), 'build', 'index.html');
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const document = parse(fileContents);
    const head = document.childNodes[1].childNodes[0];
    const before = head.childNodes.length;
    head.childNodes = head.childNodes.filter((node) => node.nodeName !== 'script');
    const after = head.childNodes.length;
    console.info(`Removed ${before - after} scripts fomr the <head> element.`);
    const revisedContents = serialize(document);
    await fs.writeFile(filePath, revisedContents, 'utf-8');
    console.info(`Saved ${filePath}`);
};

removeHeaderScripts();
