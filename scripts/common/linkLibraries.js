const { utils } = require('ethers');

const linkLibraries = (bytecode, linkReferences, libraries) => {
  Object.keys(linkReferences).forEach((fileName) => {
    Object.keys(linkReferences[fileName]).forEach((contractName) => {
      if (!libraries.hasOwnProperty(contractName)) {
        throw new Error(`Missing link library name ${contractName}`);
      }
      const address = utils
        .getAddress(libraries[contractName])
        .toLowerCase()
        .slice(2);
      linkReferences[fileName][contractName].forEach(
        ({ start: byteStart, length: byteLength }) => {
          const start = 2 + byteStart * 2;
          const length = byteLength * 2;
          bytecode = bytecode
            .slice(0, start)
            .concat(address)
            .concat(bytecode.slice(start + length, bytecode.length));
        }
      );
    });
  });
  return bytecode;
};

module.exports = { linkLibraries };
