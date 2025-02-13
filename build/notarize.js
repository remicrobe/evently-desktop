import {notarize} from "@electron/notarize";

export default async function notarizing(context) {
    const appName = context.packager.appInfo.productFilename;
    const {electronPlatformName, appOutDir} = context;

    if (
        electronPlatformName !== "darwin" ||
        process.env.SKIP_NOTARIZE === "true"
    ) {
        console.log(`  • Skipping notarization`);
        return;
    }

    const appId = "sementa.com.Evently";
    let appPath = `${appOutDir}/${appName}.app`;
    let {APPLE_API_KEY, APPLE_API_KEY_ISSUER, TEAM_SHORT_NAME, APPLE_ID, APPLE_PASSWORD} = process.env;

    console.log(`  • Notarizing ${appPath}`);

    const signing = {
        tool: "notarytool",
        appPath,
        appleId: APPLE_ID,
        appBundleId: appId,
        appleIdPassword: APPLE_PASSWORD,
        teamId: TEAM_SHORT_NAME,
    };

    console.log(`Sign with ${signing}`)

    return await notarize(signing);
}