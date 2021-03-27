const fs = require("fs");
const exec = require("shelljs.exec");


export async function isNodeRepo(repo: string) {
    if (fs.existsSync("./" + repo + "/package.json")) {
        return true;
    }
    return false;
}
export async function fileExistOnRepo (filePath: string) {
    if ((fs.existsSync(filePath))) {
        return true;
    }
    return false;
}
export async function copyFileToRepo (path: string, sourceFilePath: string, destination: string, replace = false) {
    if (replace || ! await fileExistOnRepo(path)) {
        exec("cp  " + sourceFilePath + "  " + destination + "").stdout;
    }
}

export async function gitPush (workspace: string, repo: string, commit: string, branch: string) {
    exec("cd " + repo + " && git add .").stdout;
    exec("cd " + repo + " && git commit -m  '" + commit + "'").stdout;
    const push = exec("cd " + repo + "  && git push  git@bitbucket.org:" + workspace + "/" + repo + ".git " + branch).stdout;
    console.log(push);
    exec("rm ./" + repo, {silent: true}).stdout;
}