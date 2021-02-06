#$repo $workspace
echo "Installing require components"
npm i --save-dev @types/node
npm i
echo "Compiling require components"
tsc ./src/webhook.ts
node ./src/webhook.js -u ${username} -p "${password}" -w "${choice}";
