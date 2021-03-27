#$repo $workspace
echo "Installing require components"
npm i --save-dev @types/node
npm i
echo "Compiling require components"
tsc ./src/setup.ts
node ./src/setup.js -s ${service} -u ${username} -p "${password}" -w "${work_space}" -c "${CheckoutBranch}" -n "${NewBranch}" ;
