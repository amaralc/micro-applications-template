/**
 * Update changelog presets to use bitbucket format
 *
 * @see https://github.com/lerna/lerna/issues/2451
 * @see https://github.com/lerna/lerna/issues/2451#issuecomment-770672107
 *
 * ATTENTION: It is necessary to point to this config file, while running lerna command.
 *
 * Example: yarn lerna version --yes --conventional-commits --changelog-preset ./changelog-preset.config.js
 */


// // Customize changelog preset to use bitbucket format if needed

// module.exports = Promise.resolve()
//   .then(() => require('conventional-changelog-conventionalcommits'))
//   .then((presetPromise) => presetPromise())
//   .then((preset) => {
//     preset.writerOpts.commitUrlFormat = '{{host}}/{{owner}}/{{repository}}/commits/{{hash}}';
//     preset.writerOpts.compareUrlFormat = '{{host}}/{{owner}}/{{repository}}/compare/{{currentTag}}%0D{{previousTag}}';
//     return preset;
//   });
