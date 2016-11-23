import * as Dom from './dom.js';
import assign from 'object.assign';

export function embed(swf, flashVars, params, attributes) {
  const code = getEmbedCode(swf, flashVars, params, attributes);

  console.log(code);
  // Get element by embedding code and retrieving created element
  const obj = Dom.createEl('div', { innerHTML: code }).childNodes[0];

  return obj;
}

export function getEmbedCode(swf, flashVars, params, attributes) {
  const objTag = '<object type="application/x-shockwave-flash" ';
  let flashVarsString = '';
  let paramsString = '';
  let attrsString = '';

  // Convert flash vars to string
  if (flashVars) {
    Object.getOwnPropertyNames(flashVars).forEach(function(key) {
      flashVarsString += `${key}=${flashVars[key]}&amp;`;
    });
  }

  // Add swf, flashVars, and other default params
  params = assign({
    movie: swf,
    flashvars: flashVarsString,
    // Required to talk to swf
    allowScriptAccess: 'always',
    // All should be default, but having security issues.
    allowNetworking: 'all'
  }, params);

  // Create param tags string
  Object.getOwnPropertyNames(params).forEach(function(key) {
    paramsString += `<param name="${key}" value="${params[key]}" />`;
  });

  attributes = assign({
    // Add swf to attributes (need both for IE and Others to work)
    data: swf,

    // Default to 0 width/height
    width: '0',
    height: '0'

  }, attributes);

  // Create Attributes string
  Object.getOwnPropertyNames(attributes).forEach(function(key) {
    attrsString += `${key}="${attributes[key]}" `;
  });

  return `${objTag}${attrsString}>${paramsString}</object>`;
}
