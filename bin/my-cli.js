#!/usr/bin/env node
var shell = require("shelljs");
const yargs = require("yargs");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const dir = process.cwd().toString().replace(/\\/g, "/").split("/");

let targetDir = dir[dir.length - 1];
function dateFormat() {
  const date = new Date();
  let fmt = "YYYY-mm-dd HH:MM:SS";
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
function todo(gits, types = "server") {
  inquirer
    .prompt([
      {
        type: "input",
        message: "项目名称:",
        name: "name",
        default: ".",
      },
      {
        type: "input",
        message: "项目介绍:",
        name: "desc",
        default: "",
      },
      {
        type: "input",
        message: "版本号:",
        name: "version",
        default: "1.0.0",
      },
      {
        type: "input",
        message: "作者:",
        name: "author",
        default: "",
      },
    ])
    .then(function (res) {
      const inser = res;
      shell.exec("git clone " + gits + " " + inser.name, function (res) {
        shell.ls(inser.name + "/package.json").forEach(function (file) {
          shell.sed(
            "-i",
            /.*NAME.*/,
            inser.name == "."
              ? ' "name": "' + targetDir + '",'
              : ' "name": "' + inser.name + '",',
            file
          );
          shell.sed(
            "-i",
            /.*VERSION.*/,
            '  "version": "' + inser.version + '",',
            file
          );
          shell.sed(
            "-i",
            /.*DESCRIPTION.*/,
            '  "description": "' + inser.desc + '",',
            file
          );
          shell.sed(
            "-i",
            /.*AUTHOR.*/,
            '  "author":" ' + inser.author + '",',
            file
          );
        });
        shell.rm("-rf", inser.name + "/.git");
        shell.rm("-rf", inser.name + "/.vscode");
        shell.rm("-f", inser.name + "/.gitignore");
        console.log(" usage:\n");
        if (inser.name != ".") {
          console.log(" cd " + inser.name + "[进入目录]\n");
        }
        console.log("#[1] npm i | cnpm i | pnpm i  [安装依赖]\n");
        if (types === "server") {
          console.log("#[2] 打开 config/config.default.js [配置mysql数据库]\n");
          console.log("#[3] npm run dev [开发调试]\n");
          console.log("#[4] npm start [正式部署]\n");
        } else if (types === "web") {
          console.log("#[2] npm run serve [开发调试]\n");
          console.log("#[3] npm build [打包部署]\n");
        }
      });
    });
}
function finds(path, next) {
  return fs.existsSync(shell.pwd().replace(/\\/g, "/") +
    "/app/" +
    path +
    next + ".js")
};
function createApp(params = {
  preTxt: '',
  nextTxt: '',
  thatDir: '',
  sourceDir: '',
}) {
  if (params.preTxt && params.preTxt !== "") {
    shell.echo("[创建模块] " + params.preTxt);
  }
  const allDir = params.thatDir.split('/')
  const inser = allDir.slice(0, allDir.length - 1)
  if (inser.length > 0) {
    shell.mkdir("-p", ["app", "controller", ...inser].join("/"));
    shell.mkdir("-p", ["app", "service", ...inser].join("/"));
    shell.mkdir("-p", ["app", "router", ...inser].join("/"));
    shell.mkdir("-p", ["app", "model", ...inser].join("/"));
  }
  const findController =
    finds("controller", params.thatDir)
  const findRouter =
    finds("router", params.thatDir)
  const findModels =
    finds("model", params.thatDir)
  const findService =
    finds("service", params.thatDir)
  if (findController || findRouter || findService || findModels) {
    shell.echo("\n");
    if (findController) {
      shell.echo("\tController相同路径下已经有同名文件\n");
    }
    if (findModels) {
      shell.echo("\tModels相同路径下已经有同名文件\n");
    }
    if (findRouter) {
      shell.echo("\tRouter相同路径下已经有同名文件\n");
    }
    if (findService) {
      shell.echo("\tService相同路径下已经有同名文件\n");
    }
  } else {
    // controller
    shell.cp(
      "-r",
      __dirname + "/" + params.sourceDir + "/controller.js",
      shell.pwd() + "/app/controller/" + params.thatDir + ".js"
    );
    // service
    shell.cp(
      "-r",
      __dirname + "/" + params.sourceDir + "/service.js",
      shell.pwd() + "/app/service/" + params.thatDir + ".js"
    );
    // router
    shell.cp(
      "-r",
      __dirname + "/" + params.sourceDir + "/router.js",
      shell.pwd() + "/app/router/" + params.thatDir + ".js"
    );
    shell
      .ls(shell.pwd() + "/app/router.js")
      .forEach((file) => {
        const baseRouter = shell.grep("};", file);
        if (
          shell
            .grep("-l", params.thatDir, file)
            .indexOf(
              shell.pwd().replace(/\\/g, "/") + "/app/router.js"
            ) === -1
        ) {
          shell.sed(
            "-i",
            "};",
            "  require('./router/" + params.thatDir + "')(app);\n" +
            baseRouter,
            file
          );
        }
      });
    // models
    shell.cp(
      "-r",
      __dirname + "/" + params.sourceDir + "/models.js",
      shell.pwd() + "/app/model/" + params.thatDir + ".js"
    );
    if (params.nextTxt && params.nextTxt !== "") {
      shell.echo(params.nextTxt);
    }

  }
};
function run(argv) {
  if (argv[0] === "-v" || argv[0] === "--version" || argv[0] === ["-V"]) {
    console.log("版本号 1.0.3");
  } else if (
    argv[0] === "-h" ||
    argv[0] === "--version" ||
    argv[0] === ["-H"]
  ) {
    console.log(" usage:\n");
    console.log("-v --version -V [显示版本]\n");
    console.log("init service [初始化egg空项目]\n");
    // console.log("init service base [初始化egg 基础项目模板]\n");
    // console.log("init service shop [初始化egg 商城项目模板]\n");
    console.log("init web [初始化移动端空项目Vant框架]\n");
    // console.log("init web base [初始化移动端基础项目Vant框架]\n");
    // console.log("init web shop [初始化移动端商城项目Vant框架]\n");
    console.log("init admin [初始化后台管理系统空项目element框架]\n");
    // console.log("init admin base [初始化后台管理系统基础项目element框架]\n");
    // console.log("init admin shop [初始化后台管理系统商城项目elment框架]\n");
    console.log("create app init [创建模块]\n");
    console.log("create app swiper [创建轮播图模块]\n");
    console.log("create app area [创建省市区模块]\n");
    console.log("git push [git 一键提交代码]\n");
  } else if (argv[0] === "init") {
    if (!shell.which("git")) {
      shell.echo("需要安装git工具\n");
      shell.exit(1);
    } else {
      if (!argv[1]) {
        shell.echo("执行 -v 查看命令");
        shell.echo();
      } else {
        if (argv[1] === "service") {
          if (!argv[2]) {
            shell.echo("[服务器项目egg.js] 初始化空项目");
            todo("https://git.vsakura.com/zboy/vbinit.git", "server");
          } else {
            if (argv[2] === "shop") {
              shell.echo("[服务器项目egg.js] 初始化商场项目");
              todo("https://git.vsakura.com/zboy/vbshop.git", "server");
            } else if (argv[2] === "base") {
              shell.echo("[服务器项目egg.js] 初始化基础模板");
              todo("https://git.vsakura.com/zboy/vbbase.git", "server");
            } else {
              shell.echo("执行 -v 查看命令");
              shell.echo();
            }
          }
        } else if (argv[1] === "web") {
          if (!argv[2]) {
            shell.echo("[前端项目/移动端] 初始化空项目Vant版本");
            todo("https://git.vsakura.com/zboy/vfinit.git", "web");
          } else {
            if (argv[2] === "shop") {
              shell.echo("[前端项目/移动端] 初始化商场项目Vant版本");
              todo("https://git.vsakura.com/zboy/vfshop.git", "web");
            } else if (argv[2] === "base") {
              shell.echo("[前端项目/移动端] 初始化基础模板");
              todo("https://git.vsakura.com/zboy/vfbase.git", "web");
            } else {
              shell.echo("执行 -v 查看命令");
              shell.echo();
            }
          }
        } else if (argv[1] === "admin") {
          if (!argv[2]) {
            shell.echo("[管理后台/PC] 初始化空项目element版本");
            todo("https://git.vsakura.com/zboy/vainit.git", "web");
          } else {
            if (argv[2] === "shop") {
              shell.echo("[管理后台/PC] 初始化商场项目element版本", "web");
              todo("https://git.vsakura.com/zboy/vashop.git");
            } else if (argv[2] === "base") {
              shell.echo("[管理后台/PC] 初始化基础模板element版本");
              todo("https://git.vsakura.com/zboy/vabase.git", "web");
            } else {
              shell.echo("执行 -v 查看命令");
              shell.echo();
            }
          }
        } else {
          shell.echo("执行 -v 查看命令");
          shell.echo();
        }
      }
    }
  } else if (argv[0] === "create") {
    if (argv[1] === "app") {
      if (argv[2] === "init") {
        shell.echo(
          "[创建模块] 请确定在项目根目录下执行 创建 controller,service,router,model模块"
        );
        inquirer
          .prompt([
            {
              type: "input",
              message:
                "模块路径(如想创建 app/controller/order/order.js): 填写 order/order",
              name: "paths",
              default: "test",
            },
          ])
          .then((res) => {
            const inser = res.paths.split("/");
            const names = inser.pop();
            const name = names.slice(0, 1).toUpperCase() + names.slice(1);
            if (inser.length > 0) {
              shell.mkdir("-p", ["app", "controller", ...inser].join("/"));
              shell.mkdir("-p", ["app", "service", ...inser].join("/"));
              shell.mkdir("-p", ["app", "router", ...inser].join("/"));
              shell.mkdir("-p", ["app", "model", ...inser].join("/"));
            }
            const findController = finds("controller", res.paths)
            const findRouter = finds("router", res.paths)
            const findModels = finds("model", res.paths)
            const findService = finds("service", res.paths)
            if (findController || findRouter || findService || findModels) {
              shell.echo("\n");
              if (findController) {
                shell.echo("\tController相同路径下已经有同名文件\n");
              }
              if (findModels) {
                shell.echo("\tModels相同路径下已经有同名文件\n");
              }
              if (findRouter) {
                shell.echo("\tRouter相同路径下已经有同名文件\n");
              }
              if (findService) {
                shell.echo("\tService相同路径下已经有同名文件\n");
              }
            } else {
              // controller
              shell.cp(
                "-r",
                __dirname + "/base/controller.js",
                shell.pwd() + "/app/controller/" + res.paths + ".js"
              );
              shell
                .ls(shell.pwd() + "/app/controller/" + res.paths + ".js")
                .forEach((file) => {
                  shell.sed("-i", "Test", name, file);
                  shell.sed("-i", "ROOT", res.paths.replace("/", "."), file);
                });
              // service
              const patharr = res.paths.split("/");
              const newPaths = patharr.map((item) => {
                let items = item.slice(0, 1).toUpperCase() + item.slice(1);
                return items;
              });
              shell.cp(
                "-r",
                __dirname + "/base/service.js",
                shell.pwd() + "/app/service/" + res.paths + ".js"
              );
              shell.echo(newPaths.join("."));
              shell
                .ls(shell.pwd() + "/app/service/" + res.paths + ".js")
                .forEach((file) => {
                  shell.sed("-i", "Test", name, file);
                  shell.sed("-i", "ROOT", newPaths.join("."), file);
                });
              // router
              shell.cp(
                "-r",
                __dirname + "/base/router.js",
                shell.pwd() + "/app/router/" + res.paths + ".js"
              );
              shell
                .ls(shell.pwd() + "/app/router/" + res.paths + ".js")
                .forEach((file) => {
                  shell.sed("-i", "ROOT", res.paths.replace("/", "."), file);
                  shell.sed("-i", "PATHS", res.paths, file);
                });
              shell.ls(shell.pwd() + "/base/app/router.js").forEach((file) => {
                const baseRouter = shell.grep("};", file);
                if (
                  shell
                    .grep("-l", res.paths, file)
                    .indexOf(
                      shell.pwd().replace(/\\/g, "/") + "/app/router.js"
                    ) === -1
                ) {
                  shell.sed(
                    "-i",
                    "};",
                    "  require('./router/" +
                    res.paths +
                    "')(app);\n" +
                    baseRouter,
                    file
                  );
                }
              });
              // models
              shell.cp(
                "-r",
                __dirname + "/base/models.js",
                shell.pwd() + "/app/model/" + res.paths + ".js"
              );
              shell
                .ls(shell.pwd() + "/app/model/" + res.paths + ".js")
                .forEach((file) => {
                  shell.sed("-i", "Test", name, file);
                });
            }
          });
      } else if (argv[2] === "swiper") {
        createApp({
          preTxt: '正在创建swiper轮播图中',
          nextTxt: '创建swiper轮播图完成',
          thatDir: 'publicity/swiper',
          sourceDir: 'swiper',
        })
      } else if (argv[2] === "area") {
        createApp({
          preTxt: '正在创建省市区系统中',
          nextTxt: '创建创建省市区系统完成',
          thatDir: 'tools/area',
          sourceDir: 'area',
        })
      }
    }
  } else if (argv[0] === "git") {
    if (argv[1] === "push") {
      shell.echo("[提交代码] 一键提交代码");
      inquirer
        .prompt([
          {
            type: "input",
            message: "填写提交备注信息",
            name: "remarks",
            default: dateFormat() + "完成既定工作",
          },
        ])
        .then((resa) => {
          shell.echo(resa.remarks);
          shell.exec("git add .", (resb) => {
            shell.exec('git commit -m "' + resa.remarks + '"', () => {
              shell.exec("git push", () => {
                shell.echo("代码提交完成\n");
              });
            });
          });
        });
    }
  }
}
run(process.argv.slice(2));
