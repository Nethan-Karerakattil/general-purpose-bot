const fs = require("node:fs");

module.exports = client => {
    const { buttons } = client;

    client.handleComponents = async () => {
        const componentFolder = fs.readdirSync("./src/components");

        for(const folder of componentFolder){
            const componentFiles = fs.readdirSync(`./src/components/${folder}`)
                .filter(file => file.endsWith(".js"));

            switch(folder){
                case "buttons":
                    for(const file of componentFiles){
                        const button = require(`../../components/buttons/${file}`);
                        buttons.set(button.data.name, button);
                    }

                break;
            }
        }
    }
}