var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var shelljs = require("shelljs");
var requestPromise = require("request-promise-native");
var fs = require("fs");
var exec = require('shelljs.exec');
var cmdLineArgs = require("command-line-args");
var opts;
//Creating webhook
function createWebHook(repo, owner, desc, events, url) {
    return __awaiter(this, void 0, void 0, function () {
        var options, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        method: "POST",
                        uri: "https://api.bitbucket.org/2.0/repositories/" + owner + "/" + repo + "/hooks",
                        auth: {
                            user: opts.username,
                            pass: opts.password
                        },
                        body: {
                            "description": desc,
                            "url": url,
                            "active": true,
                            "events": events
                        },
                        json: true
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, requestPromise(options)];
                case 2:
                    _a.sent();
                    console.log("optiions", options);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//Deleting webhook
function deleteWebHook(repo, uid, owner) {
    return __awaiter(this, void 0, void 0, function () {
        var options, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        method: "DELETE",
                        uri: "https://api.bitbucket.org/2.0/repositories/" + owner + "/" + repo + "/hooks/" + uid,
                        auth: {
                            user: opts.username,
                            pass: opts.password
                        },
                        json: true
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, requestPromise(options)];
                case 2:
                    _a.sent();
                    console.log('optiions', options);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    throw err_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
//Getting repo list
function getReposList(owner, num) {
    return __awaiter(this, void 0, void 0, function () {
        var url, repos, response, parsedResponse, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://api.bitbucket.org/2.0/repositories/" + owner + "/?pagelen=100&page=" + num + "&fields=next,values.name";
                    repos = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    _a.label = 2;
                case 2:
                    if (!(url !== undefined)) return [3 /*break*/, 4];
                    console.log("getting repo list from:", url);
                    return [4 /*yield*/, requestPromise(url, { auth: { user: opts.username, pass: opts.password } })];
                case 3:
                    response = _a.sent();
                    parsedResponse = JSON.parse(response);
                    repos = repos.concat(parsedResponse.values);
                    url = parsedResponse.next;
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, repos];
                case 5:
                    err_3 = _a.sent();
                    throw err_3;
                case 6: return [2 /*return*/];
            }
        });
    });
}
//Getting hook list
function getHookList(owner, repo) {
    return __awaiter(this, void 0, void 0, function () {
        var url, hooks, response, parsedResponse, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://api.bitbucket.org/2.0/repositories/" + owner + "/" + repo + "/hooks?fields=values.uuid,values.description";
                    hooks = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    _a.label = 2;
                case 2:
                    if (!(url !== undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, requestPromise(url, { auth: { user: opts.username, pass: opts.password } })];
                case 3:
                    response = _a.sent();
                    parsedResponse = JSON.parse(response);
                    hooks = hooks.concat(parsedResponse.values);
                    url = parsedResponse.next;
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, hooks];
                case 5:
                    err_4 = _a.sent();
                    throw err_4;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var workspace, _a, _b, _i, repo_index, page_index, repo_data, index, repo, hook_data, webhookName1, webhookName2, webhookName3, hookIndex, hook, events1, url1, events2, url2, events3, url3, err_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    workspace = ['usthaan-devops'];
                    _a = [];
                    for (_b in workspace)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 17];
                    repo_index = _a[_i];
                    console.log("GETTING ALL REPOS FROM WORKSPACE " + " " + workspace[repo_index]);
                    page_index = 1;
                    _c.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 16];
                    return [4 /*yield*/, getReposList(workspace[repo_index], page_index)
                        // Geeting all repos
                    ];
                case 3:
                    repo_data = _c.sent();
                    // Geeting all repos
                    if (repo_data.length == 0) {
                        console.log("Fetched all repository");
                        return [3 /*break*/, 16];
                    }
                    index = 0;
                    _c.label = 4;
                case 4:
                    if (!(index < repo_data.length)) return [3 /*break*/, 15];
                    repo = repo_data[index];
                    console.log("Repository " + repo.name);
                    return [4 /*yield*/, getHookList(workspace[repo_index], repo.name)];
                case 5:
                    hook_data = _c.sent();
                    webhookName1 = "Multibranch Scan Approval Trigger";
                    webhookName2 = "Multibranch Scan PR Trigger";
                    webhookName3 = "Multibranch Scan  Deploy Trigger";
                    hookIndex = 0;
                    _c.label = 6;
                case 6:
                    if (!(hookIndex < hook_data.length)) return [3 /*break*/, 9];
                    hook = hook_data[hookIndex];
                    console.log("Hooks " + hook.description, hook.uuid);
                    console.log(hook_data.length);
                    if (!(hook.description === webhookName1 || hook.description === webhookName2 || hook.description === webhookName3)) return [3 /*break*/, 8];
                    console.log("Hooks ----------------------> " + hook.description, hook.uuid);
                    return [4 /*yield*/, deleteWebHook(repo.name, hook.uuid, workspace[repo_index])];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    hookIndex++;
                    return [3 /*break*/, 6];
                case 9:
                    _c.trys.push([9, 13, , 14]);
                    events1 = ["repo:push", "pullrequest:fulfilled", "pullrequest:updated", "pullrequest:created"];
                    url1 = "https://automation.beta.usthaan.in/generic-webhook-trigger/invoke?token=trigger&name=" + repo.name + "&type=pr-trigger";
                    return [4 /*yield*/, createWebHook(repo.name, workspace[repo_index], "Multibranch Scan PR Trigger", events1, url1)];
                case 10:
                    _c.sent();
                    events2 = ["pullrequest:approved"];
                    url2 = "https://automation.beta.usthaan.in/generic-webhook-trigger/invoke?token=trigger&name=" + repo.name + "&type=pr-approved";
                    return [4 /*yield*/, createWebHook(repo.name, workspace[repo_index], "Multibranch Scan Approval Trigger", events2, url2)];
                case 11:
                    _c.sent();
                    events3 = ["pullrequest:fulfilled"];
                    url3 = "https://automation.beta.usthaan.in/generic-webhook-trigger/invoke?token=trigger&name=" + repo.name + "&type=webhookDeploy";
                    return [4 /*yield*/, createWebHook(repo.name, workspace[repo_index], "Multibranch Scan  Deploy Trigger", events3, url3)];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 14];
                case 13:
                    err_5 = _c.sent();
                    throw err_5;
                case 14:
                    index++;
                    return [3 /*break*/, 4];
                case 15:
                    console.log(page_index);
                    page_index++;
                    return [3 /*break*/, 2];
                case 16:
                    _i++;
                    return [3 /*break*/, 1];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function testDependencies() {
    return __awaiter(this, void 0, void 0, function () {
        var optionDefinitions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    optionDefinitions = [
                        { name: "username", alias: "u", type: String },
                        { name: "password", alias: "w", type: String }
                    ];
                    opts = cmdLineArgs(optionDefinitions);
                    console.log(opts.username, opts.password);
                    return [4 /*yield*/, start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
testDependencies()["catch"](function (err) {
    console.log(err);
});
