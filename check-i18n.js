import fs from "node:fs";
import { glob } from "glob";

(async () => {
    // Charger et parser le fichier de traductions
    let translations;
    try {
        const localesContent = fs.readFileSync('./src/translations/locales.json', 'utf8');
        translations = JSON.parse(localesContent);
    } catch (err) {
        console.error("Erreur lors de la lecture ou du parsing du fichier de traductions :", err);
        process.exit(1);
    }

    const regex = /(?:^|\s)t\(\s*(['"])(.*?)\1\s*\)|\{\s*key\s*:\s*(['"])(.*?)\3\s*\}/g;

    try {
        const files = await glob('**/*.{ts,vue}', { ignore: '**/node_modules/**' });
        files.forEach((file) => {
            const fileContent = fs.readFileSync(file, 'utf8');
            let match;
            // Parcourir toutes les occurrences dans le fichier courant
            while ((match = regex.exec(fileContent)) !== null) {
                const key = match[2] || match[4];
                // Vérifier que la clé existe dans le fichier de traductions
                if (!translations['fr-FR'].hasOwnProperty(key)) {
                    console.error(`Clé manquante : "${key}" dans le fichier ${file}`);
                }
            }
        });
    } catch (err) {
        console.error("Erreur lors de la recherche des fichiers :", err);
    }
})();
