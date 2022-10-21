const fs = require("node:fs");

module.exports = client => {
    client.handleComponents = async () => {
        const componentFolders = fs.readdirSync("./src/components");

        for(const folder of componentFolders){
            const buttonFolders = fs.readdirSync(`./src/components/${folder}`)

            for(const buttonFolder of buttonFolders){
                const buttonFiles = fs.readdirSync(`./src/components/${folder}/${buttonFolder}`)
                    .filter(file => file.endsWith(".js"));

                for(const file of buttonFiles){
                    const button = require(`../../components/${folder}/${buttonFolder}/${file}`);

                    client.buttons.set(button.data.name, button);
                }
            }
        }
    }
}