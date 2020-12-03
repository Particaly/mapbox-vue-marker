const fs = require( "fs" );
const chalk = require("chalk");
const argv = process.argv;
const path = require('path');

/**
 *  copy main function
 *
 * @param  {String} from which file or directory you wanna copy
 * @param  {String} to   the target file or dir you copyed
 */
async function fuzhi(from, to) {
	from = path.resolve(from);
	to = path.resolve(to);
	if(!from){
		console.log(error("pleace input the file or directory you wanna copy"));
		return ;
	}
	try{
		if(from === "--help"){
			help();
			return;
		}
		if(!to){
			console.log(error("pleace  the target file or directory you wanna copy"));
			return;
		}
		const type = await pathType(from);
		if(type === "file"){
			await copyFile(from ,to); // file copy
		}else{
			await copyDir(from,to); // directory copy
		}
	}catch(err){
		console.log(error(err));
	}
}

/**
 * copy file
 *
 * @param  {String} from copied file
 * @param  {String} to   target file
 */
async function copyFile(from, to) {
	let result = isExist(to);
	if(result !== true){
		mkdirsSync(path.dirname(to));
	}
	fs.writeFileSync(to, fs.readFileSync(from));
	console.log(success(from,to));
}

/**
 * copy directory
 *
 * @param  {String} from
 * @param  {String} to
 */
async function copyDir(from, to) {
	let result = isExist(to);
	if(result !== true){
		mkdirsSync(to);
	}
	const paths = fs.readdirSync(from);
	for(let eachPath of paths){
		let src = path.resolve(`${from}/${eachPath}`);
		let dist = path.resolve(`${to}/${eachPath}`);
		const stat = fs.statSync(src);
		if(stat.isFile()) {
			fs.writeFileSync(dist, fs.readFileSync(src));
			console.log(`[${getTime()}]`,chalk.green(`ok: ${src} copy to ${dist} success`));
		} else if(stat.isDirectory()) {
			await copyDir(src, dist);
		}
	}
}
// 递归创建目录 同步方法
function mkdirsSync(dirname) {
	if (fs.existsSync(dirname)) {
		return true;
	} else {
		if (mkdirsSync(path.dirname(dirname))) {
			console.log(`[${getTime()}]`,chalk.green(`ok: create new directory ${dirname}`));
			fs.mkdirSync(dirname);
			return true;
		}
	}
}

/**
 * is exists
 *
 * @return {Promise}
 * @param path
 */
function isExist(path){
	return fs.existsSync(path)?true: `${path} is not exist`;
}

/**
 * file or a folder
 *
 * @param  {String} path
 * @return {Promise}
 */
function pathType(path){
	return new Promise((resolve,reject)=>{
		fs.stat(path,(err,stats)=>{
			if(err === null){
				if(stats.isDirectory()){
					resolve("dir"); // it's directory
				}else if(stats.isFile()){
					resolve("file"); // it's file
				}
			}else{
				reject(error(path)); // files or directory don't exist
			}
		});
	});
}

/**
 * help output
 *
 * @return {String}  help description
 */
function help(){
	console.log(chalk.blueBright(`
fuzhi: 0.08
Usage: https://github.com/leinov/fuzhi
options:
[from] [to]       copy [from] file or directory to [to]
example:
fuzhi a.js b.js   copy a.js to b.js
fuzhi dirA dirB   copy directory dirA to dirB
		`));
}

/**
 * error output
 *
 * @return {String}
 * @param msg
 */
function error(msg){
	return chalk.red(`
⛑ ⛑ ⛑
error: ${msg}
Use --help to display the cli options.
  `);
}

/**
 * success output
 *
 * @return {String}
 * @param from
 * @param to
 */
function success(from,to){
	return `[${getTime()}] ` + chalk.green(`ok: ${from} copy to ${to} success`);
}

function getTime(){
	return /\d\d:\d\d:\d\d/.exec(new Date())[0];
}

module.exports = {fuzhi};
