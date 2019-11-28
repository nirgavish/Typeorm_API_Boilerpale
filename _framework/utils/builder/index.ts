const fs = require('fs');
import ejs from 'ejs';

const artifactsFolder = './_artifacts/'

async function Builder(folder: string, template: string, artifactName: string) {
    return new Promise(async(resolve, reject)=>{

        const modules = fs.readdirSync(folder)
        .map((moduleName: string) => {
            const s = moduleName.split('.');
            return {
                fullName: moduleName,
                name: s[0],
                type: s[1],
                ext: s[2]
            }
        });

        fs.readFile(__dirname+`/templates/${template}.ejs`, "utf8", async (err:any, fileContent: string)=>{
            let rendered = await ejs.render(fileContent, {modules});
            rendered = rendered.replace(/^\s*$(?:\r\n?|\n)/gm, '');
            fs.writeFile(`./_artifacts/${artifactName}`, rendered, function(err:any) {
                console.log('Written', artifactName);
                resolve();
            });
        });
        // console.warn(templateBody)
/*
        const built = await ejs
        .renderFile(__dirname+`/templates/${template}.ejs`, {model: false })
        .then((output) => {console.warn(output)});    
*/


    });
}

export default Builder;