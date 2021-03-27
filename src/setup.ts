const shelljs = require("shelljs");
const requestPromise = require("request-promise-native");
const fs = require("fs");
const exec = require("shelljs.exec");
const cmdLineArgs = require("command-line-args");
const jsonfile = require("jsonfile");

// Importing the class from the location of the file
import { addJenkinsFiles } from "./add_jenkinsfile";

let opts: {
    service: string,
    username: string,
    password: string,
    workspace: string,
    checkout_branch: string,
    new_branch: string,
};

// Getting repo list
async function getReposList(owner: string) {

    let url = "https://api.bitbucket.org/2.0/repositories/" + owner + "/?pagelen=100&fields=next,values.name";
    let repos: any[] = [];
    try {
        while (url !== undefined) {
            console.log("getting repo list from:", url);
            const response = await requestPromise(url, {auth: {user: opts.username, pass: opts.password}});
            const parsedResponse = JSON.parse(response);
            repos = repos.concat(parsedResponse.values);
            url = parsedResponse.next;
        }
        return repos;
    } catch (err) {
        throw err;
    }

}
async function start() {
    const workspace: string = opts.workspace;
    console.log("GETTING ALL REPOS FROM WORKSPACE " + " " + workspace);

    const repoList = await getReposList(workspace);
    switch (opts.service) {
        case "addJenkinsFiles": {
            for (let index = 0; index < repoList.length; index++) {
                const repo = repoList[index];
                console.log("Repository " + repo.name);
                await addJenkinsFiles(workspace, repo.name, opts.checkout_branch, opts.checkout_branch);
            }
            break;
        }
        case "addJenkinsFiles_newbranch": {
            for (let index = 0; index < repoList.length; index++) {
                const repo = repoList[index];
                console.log("Repository " + repo.name);
                await addJenkinsFiles(workspace, repo.name, opts.checkout_branch, opts.new_branch);
            }
            break;
        }
        default: {
           console.log("No service is selected");
           break;
        }
    }
}
async function serviceCall() {
    const optionDefinitions = [
        {name: "service", alias: "s", type: String},
        {name: "username", alias: "u", type: String},
        {name: "password", alias: "p", type: String},
        {name: "workspace", alias: "w", type: String,  defaultValue: "usthaan"},
        {name: "checkout_branch", alias: "c", type: String, defaultValue: "development"},
        {name: "new_branch", alias: "n", type: String},
    ];
    opts = cmdLineArgs(optionDefinitions);
    console.log( opts.service, opts.username, opts.password, opts.workspace, opts.checkout_branch, opts.new_branch);
    await start();
}
serviceCall().
catch((err) => {
    console.log(err);
});