#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');

// const lstat = util.promisify(fs.lstat);
const {lstat} = fs.promises;
const target = process.argv[2] || process.cwd();

fs.readdir(target, async (err, files) => {
    if(err)
    {
        throw new Error(err);
    }

    const statPromises = files.map(file => {
        return lstat(path.join(target,file));
    });

    const allStats = await Promise.all(statPromises);
    for(let stats of allStats){
        const index = allStats.indexOf(stats);
        if(stats.isFile())
        {
            console.log(chalk.yellowBright(files[index]));
        }
        else{
            console.log(chalk.green(files[index]));

        }
    }
    
});
