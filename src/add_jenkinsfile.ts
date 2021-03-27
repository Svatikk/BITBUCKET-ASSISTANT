const exec = require("shelljs.exec");
import * as  assistance from "./helper";
const file = {
    JenkinsBuild_file: "./src/jenkinsfile/JenkinsBuild.groovy",
    JenkinsPublish_file: "./src/jenkinsfile/JenkinsPublish.groovy",
    JenkinsDeploy_ec2_file: "./src/jenkinsfile/ec2/JenkinsDeploy.groovy",
    JenkinsDeploy_serverless_file: "./src/jenkinsfile/serverless/JenkinsDeploy.groovy",
};
export async function addJenkinsFiles(workspace: string, repo: string, branch: string, new_branch: string) {
    try {
        const url = exec("git clone  --branch " + branch + " git@bitbucket.org:" + workspace + "/" + repo + ".git").stdout;
        console.log(url);
        if (await assistance.isNodeRepo(repo)) {
            await assistance.copyFileToRepo("./" + repo + "/JenkinsBuild.groovy", file.JenkinsBuild_file, "./" + repo);
            await assistance.copyFileToRepo("./" + repo + "/JenkinsPublish.groovy", file.JenkinsPublish_file, "./" + repo);
            if (await assistance.fileExistOnRepo("./" + repo + "/deploy/service-stack.json")) {
                await assistance.copyFileToRepo("./" + repo + "/deploy/service-stack.json", file.JenkinsDeploy_ec2_file, "./" + repo, true);
            }
            if (await assistance.fileExistOnRepo("./" + repo + "/serverless.yml")) {
                await assistance.copyFileToRepo("./" + repo + "/serverless.yml", file.JenkinsDeploy_ec2_file, "./" + repo, true);
            }
            if (branch === new_branch){
                await assistance.gitPush(workspace, repo, "TOOL-49 Initial commit",branch);
            }else if (branch !== new_branch){
                await assistance.gitPush(workspace, repo, "TOOL-49 Initial commit",new_branch);
            }
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}