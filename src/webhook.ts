const shelljs = require("shelljs");
const requestPromise = require("request-promise-native");
var fs = require("fs");
var exec = require('shelljs.exec')
const cmdLineArgs = require("command-line-args");


let opts: {
    username: string,
    password: string,
    choice: string
};

//Creating webhook
async function createWebHook(repo: string, owner:string, desc: string, events: string[], url: string) {

}

//Deleting webhook
async function deleteWebHook(repo: string, uid: string,owner: string) {

}

//Getting repo list
async function getReposList(owner: string, num: number) {

    let url = "https://api.bitbucket.org/2.0/repositories/" + owner + "/?pagelen=100&page=" + num + "&fields=next,values.name";
    let repos: any[] = [];
    try {
        while (url !== undefined) {
            console.log("getting repo list from:", url)
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

//Getting hook list
async function getHookList(owner: string,repo: string) {

    let url  = "https://api.bitbucket.org/2.0/repositories/"+owner+"/"+repo+"/hooks?fields=values.uuid,values.description" ;
    let hooks: any[] = [];
    try {
        while (url !== undefined) {
            const response = await requestPromise(url, {auth: {user:  opts.username, pass: opts.password}});
            const parsedResponse = JSON.parse(response);
            hooks = hooks.concat(parsedResponse.values);
            url = parsedResponse.next;
        }
        return hooks;
    } catch (err) {
        throw err;
    }
}

//Deploy criteria
async function deploy_criteria(workspace: string, repo: string, file: string){
    try{
        //step1 check git availability 
        var git = exec('git --version', {silent:true}).stdout;
        console.log(git);
        //step2 clone repo
        var url = exec('git clone git@bitbucket.org:'+workspace+'/'+repo+'.git').stdout;
        console.log(url);
        //step3 check deploy folder exit or not
        if (fs.existsSync("./"+repo+"/deploy")) {
            // Do something
            console.log("exist");
            //step4 delete repo
            var del = exec('rm -rf '+repo).stdout;
            console.log(del);
            return true;
        }else{
            console.log("not exist");
            //step4 delete repo
            var del = exec('rm -rf '+repo).stdout;
            console.log(del);     
            return false;       
        }


    } catch (err) {
        throw err;
    }
} 

async function start(){

    let workspace: Array<string> = [opts.choice];
    // loop for workspace
    for (var repo_index in workspace){
        console.log("GETTING ALL REPOS FROM WORKSPACE "+" "+workspace[repo_index]);
        var page_index:number = 1;
        // loop for  pages
        while (true){
            const repo_data = await getReposList(workspace[repo_index],page_index)
            // Geeting all repos
            if (repo_data.length == 0){
                console.log("Fetched all repository");
                break;
            }
            //loop for repos
            for (let index = 0; index < repo_data.length; index++) {
                const repo = repo_data[index];
                console.log("Repository "+repo.name);
                const hook_data = await getHookList(workspace[repo_index],repo.name);
                
                const webhookName1: string = "Multibranch Scan Approval Trigger";
                const webhookName2: string = "Multibranch Scan PR Trigger";
                const webhookName3: string = "Multibranch Scan  Deploy Trigger" 
                const webhookName4: string = "Automation Webhook" 

                //loop for hooks
                for (let hookIndex = 0; hookIndex < hook_data.length; hookIndex++) {
                    const hook = hook_data[hookIndex];
                    console.log("Hooks "+hook.description, hook.uuid);

                    console.log(hook_data.length)


                    if (hook.description === webhookName1 || hook.description === webhookName2 || hook.description === webhookName3 || hook.description === webhookName4){
                        console.log("Hooks ----------------------> "+hook.description, hook.uuid);
                        await deleteWebHook(repo.name,hook.uuid, workspace[repo_index]);
                    }
                        
                }
                try {
                        let events1: string[] = ["repo:push", "pullrequest:fulfilled", "pullrequest:updated", "pullrequest:created"];
                        let url1: string="https://[ORG_URL]/generic-webhook-trigger/invoke?token=trigger&name="+repo.name+"&type=pr-trigger"
                        
                        await createWebHook(repo.name, workspace[repo_index], "Multibranch Scan PR Trigger", events1, url1);

                        let events2: string[] = ["pullrequest:approved"];
                        let url2: string="https://[ORG_URL]/generic-webhook-trigger/invoke?token=trigger&name="+repo.name+"&type=pr-approved"
                        
                        await createWebHook(repo.name, workspace[repo_index], "Multibranch Scan Approval Trigger", events2, url2);
                    
                        if (await deploy_criteria(workspace[repo_index],repo.name,"deploy")==true){
                            let events3: string[] = ["pullrequest:fulfilled"];
                            let url3: string="https://[ORG_URL]/generic-webhook-trigger/invoke?token=trigger&name="+repo.name+"&type=mergeDeploy"
                        
                            await createWebHook(repo.name, workspace[repo_index], "Multibranch Scan  Deploy Trigger", events3, url3);
                        }

                    }catch (err) {
                        throw err;
                    }
                

            }
            console.log(page_index);
            page_index++;
        }
    }
}

async function testDependencies() {
    const optionDefinitions = [
        {name: "username", alias: "u", type: String},
        {name: "password", alias: "p", type: String},
        {name: "choice", alias: "w", type: String}

    ];
    opts = cmdLineArgs(optionDefinitions);
    
    console.log(opts.username,opts.password);

    await start();
}

testDependencies().
catch((err) => {
    console.log(err);
});