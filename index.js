process.env.NODE_NO_WARNINGS = "1";

const si = require('systeminformation');
const chalk = require('chalk');
const semver = require('semver');

const versions = {
    node: ">=16.5.0",
    kernel: ">=5.10.0",
    delta: "5.1.13 - 5.2.15",
    php: "8.1.x",
    convert: ">=6.9.0",
    nginx: ">=1.14.0",
    fpm: "8.1"
}

let distro = null;
let deltaVersion = null;

function hasCommand(command) {
    try {
        require('child_process').execFileSync("which", [ command ], { stdio: "ignore" });
        return true;
    } catch (e) {
        return false;
    }
}

function genInstallCommand() {
    let cmd = "";

    if (require('os').userInfo().username !== "root") cmd += "sudo ";

    if (distro === "ubuntu" || distro === "debian" || distro === "mint" || distro === "linuxmint" || distro === "devuan" || distro === "popos" || distro === "zorin" || distro === "zorinos" || distro === "kali" || distro === "kalilinux" || distro === "raspbian" || distro === "elementary" || distro === "elementaryos") {
        cmd += "apt install nginx php php-intl php-fpm imagemagick nodejs git";
    } else if (distro === "rhel" || distro === "redhat" || distro === "rocky" || distro === "rockylinux") {
        cmd += "yum install nginx php php-intl php-fpm imagemagick nodejs git";
    } else if (distro === "fedora" || distro === "fedoraserver" || distro === "fedoracloud") {
        cmd += "dnf install nginx php php-intl php-fpm imagemagick nodejs git";
    } else if (distro === "kdeneon") {
        cmd += "pkcon install nginx php php-intl php-fpm imagemagick nodejs git";
    } else if (distro === "manjaro") {
        cmd += "pamac install nginx ph php-intl php-fpm imagemagick nodejsp";
    } else if (distro === "arch" || distro === "archlinux" || distro === "artix" || distro === "artixlinux") {
        cmd += "pacman -S nginx php php-intl php-fpm imagemagick nodejs git";
    }

    return cmd;
}

function start() {
    console.log("Delta installer");
    console.log("(c) Equestria.dev");
    console.log("");
    console.log(chalk.bold("Performing initial checks..."));

    if (require('os').platform() === "linux" && semver.satisfies(semver.clean(require('os').release().split("-")[0]), versions['kernel'])) {
        console.log("  * Using supported kernel: " + chalk.green("Yes"));
    } else {
        console.log("  * Using supported kernel: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "You need to be using the linux version " + semver.minVersion(versions['kernel']).version + " or later, you are running " + require('os').platform() + " version " + require('os').release().split("-")[0]);
        process.exit(1);
    }

    let supported = [ "fedora", "fedoraserver", "fedoracloud", "ubuntu", "debian", "rhel", "redhat", "mint", "linuxmint", "kdeneon", "devuan", "arch", "archlinux", "artix", "artixlinux", "popos", "zorin", "zorinos", "kali", "kalilinux", "raspbian", "manjaro", "rocky", "rockylinux", "elementary", "elementaryos" ];

    if (supported.includes(distro)) {
        console.log("  * Using supported distribution: " + chalk.green("Yes"));
    } else {
        console.log("  * Using supported distribution: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "You are not using a supported Linux distribution (" + distro + "). The supported distributions are: " + supported.join(", "));
        process.exit(1);
    }

    let missingDeps = false;

    if (hasCommand("nginx")) {
        console.log("  * Command 'nginx' is available: " + chalk.green("Yes"));
    } else {
        console.log("  * Command 'nginx' is available: " + chalk.red("No"));
        missingDeps = true;
    }

    if (hasCommand("git")) {
        console.log("  * Command 'git' is available: " + chalk.green("Yes"));
    } else {
        console.log("  * Command 'git' is available: " + chalk.red("No"));
        missingDeps = true;
    }

    if (hasCommand("php")) {
        console.log("  * Command 'php' is available: " + chalk.green("Yes"));
    } else {
        console.log("  * Command 'php' is available: " + chalk.red("No"));
        missingDeps = true;
    }

    if (hasCommand("convert")) {
        console.log("  * Command 'convert' is available: " + chalk.green("Yes"));
    } else {
        console.log("  * Command 'convert' is available: " + chalk.red("No"));
        missingDeps = true;
    }

    if (hasCommand("node")) {
        console.log("  * Command 'node' is available: " + chalk.green("Yes"));
    } else {
        console.log("  * Command 'node' is available: " + chalk.red("No"));
        missingDeps = true;
    }

    if (missingDeps) {
        console.log(chalk.red("Error: ") + "Some dependencies could not be found, please install them using your distribution's package manager. The following command should help you: " + genInstallCommand());
        process.exit(1);
    }

    if (semver.satisfies(semver.clean(require('child_process').execSync("sh -c 'node -v'").toString().trim()), versions['node'])) {
        console.log("  * Node.js version is " + semver.minVersion(versions['node']).version + " or higher: " + chalk.green("Yes"));
    } else {
        console.log("  * Node.js version is " + semver.minVersion(versions['node']).version + " or higher: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "Your version of Node.js (" + semver.clean(require('child_process').execSync("sh -c 'node -v'").toString().trim()) + ") is too old. You need at least version " + semver.minVersion(versions['node']).version + ". You can get a recent version from NodeSource: https://github.com/nodesource/distributions/blob/master/README.md.");
        process.exit(1);
    }

    if (semver.satisfies(semver.clean(require('child_process').execSync('php -r "echo(PHP_VERSION);"').toString().trim().split("-")[0]), versions['php'])) {
        console.log("  * PHP version is " + versions['php'] + ": " + chalk.green("Yes"));
    } else {
        console.log("  * PHP version is " + versions['php'] + ": " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "Your version of PHP (" + semver.clean(require('child_process').execSync('php -r "echo(PHP_VERSION);"').toString().trim().split("-")[0]) + ") is too old or too new. You need version " + versions['php'] + ".");
        process.exit(1);
    }

    if (require('child_process').execSync('php -r "echo(extension_loaded(\'intl\'));"').toString().trim() === "1") {
        console.log("  * PHP has extension 'intl': " + chalk.green("Yes"));
    } else {
        console.log("  * PHP has extension 'intl': " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "Your PHP install does not contain the 'intl' extension, please install it.");
        process.exit(1);
    }

    if (hasCommand("php-fpm" + versions['fpm'])) {
        console.log("  * Command 'php-fpm" + versions['fpm'] + "' is available: " + chalk.green("Yes"));
    } else {
        console.log("  * Command 'php-fpm" + versions['fpm'] + "' is available: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "Some dependencies could not be found, please install them using your distribution's package manager. The following command should help you: " + genInstallCommand());
        process.exit(1);
    }

    if (semver.satisfies(semver.clean(require('child_process').execSync("convert -v").toString().trim().split(" ")[2].split("-")[0]), versions['convert'])) {
        console.log("  * ImageMagick version is " + semver.minVersion(versions['convert']).version + " or higher: " + chalk.green("Yes"));
    } else {
        console.log("  * ImageMagick version is " + semver.minVersion(versions['convert']).version + " or higher: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "Your version of ImageMagick (" + semver.clean(require('child_process').execSync("convert -v").toString().trim().split(" ")[2].split("-")[0]) + ") is too old. You need at least version " + semver.minVersion(versions['convert']).version + ".");
        process.exit(1);
    }

    if (semver.satisfies(semver.clean(require('child_process').execSync("nginx -v 2>&1").toString().split(" ")[2].split("/")[1]), versions['nginx'])) {
        console.log("  * Nginx version is " + semver.minVersion(versions['nginx']).version + " or higher: " + chalk.green("Yes"));
    } else {
        console.log("  * Nginx version is " + semver.minVersion(versions['nginx']).version + " or higher: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "Your version of Nginx (" + semver.clean(require('child_process').execSync("nginx -v 2>&1").toString().split(" ")[2].split("/")[1]) + ") is too old. You need at least version " + semver.minVersion(versions['nginx']).version + ".");
        process.exit(1);
    }

    if (semver.satisfies(deltaVersion, versions['delta'])) {
        console.log("  * Latest version of Delta (" + deltaVersion + ") is supported: " + chalk.green("Yes"));
    } else {
        console.log("  * Latest version of Delta (" + deltaVersion + ") is supported: " + chalk.red("No"));
        console.log(chalk.yellow("Warning: ") + "This installer only supports Delta versions between " + versions['delta'].split("-")[0].trim() + " and " + versions['delta'].split("-")[1].trim() + ". While you can continue, you may run into some issues. Please report them.");
    }

    if (semver.satisfies(deltaVersion, versions['delta'])) {
        console.log("  * Installer is running as root: " + chalk.green("Yes"));
    } else {
        console.log("  * Installer is running as root: " + chalk.red("No"));
        console.log(chalk.red("Error: ") + "This installer needs to run as the superuser (\"root\"). Please start it again under that user to complete the installation.");
        process.exit(1);
    }

    console.log("");
    console.log("All checks have completed successfully.");
    console.log(chalk.bold.red("WARNING: ") + chalk.red("Any existing Nginx configuration will be deleted. If a Delta installation already exists under /app, it will be upgraded."));
}

si.osInfo().then((info) => {
    distro = info.logofile;

    fetch("https://git.equestria.dev/api/v1/repos/equestria.dev/delta/contents/version").then((res) => {
        res.text().then((text) => {
            let data = JSON.parse(text);
            deltaVersion = Buffer.from(data.content, "base64").toString().trim();
            console.log("-----------------------------");

            start();
        });
    });
})