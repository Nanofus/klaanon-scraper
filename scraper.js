const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const xml2js = require('xml2js');

let json = {};
json.posts = [];

let tags = fs.readFileSync("./parsed_tags.txt").toString().split("\n");

let getFiles = (folder, cat) => {
    fs.readdirSync(folder).forEach(file => {
        scrapeFile(folder + file, file, cat);
    });
}

let escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let getTags = (content) => {
    let foundTags = "";
    tags.forEach(x => {
        var regex = new RegExp("\\b" + escapeRegExp(x) + "\\b");
        if (content.search(regex) !== -1) foundTags = foundTags + x + ",";
    });
    return foundTags;
}

let scrapeFile = (path, file, cat) => {
    const data = fs.readFileSync(path, { encoding: 'latin1' });
    const body = new JSDOM(data).window.document.body;
    let singleMessages = body.querySelectorAll("tbody");
    let index = 0;
    for (let singleMessage of singleMessages) {
        let filename = file.split(".")[0];
        if (!singleMessage.querySelector(".postdetails")) continue;
        let timestampString = singleMessage.querySelector(".postdetails").innerHTML.split("</b>")[1] + "+03:00";
        let timestamp = Date.parse(timestampString.substring(1, timestampString.length));
        let initialAuthor = singleMessage.querySelector(".normalname").querySelector("span").innerHTML;
        let content = singleMessage.querySelector(".postcolor").innerHTML;
        let date = new Date(timestamp);
        let author = initialAuthor;

        switch (initialAuthor) {
            case "Toa Kapura":
                author = "kapura";
                break;
            case "Mr.Killjoy":
                author = "killjoy";
                break;
            case "jake":
                author = "thejake";
                break;
            case "Makuta Nui":
                author = "Manfred";
                break;
            case "Nöpö":
                author = "Bio-Klaani";
                break;
            case "Domek the light one":
                author = "domekthelightone";
                break;
            case "Ämkoo":
                author = "Don";
                break;
            case "Hai":
                author = "toahai";
                break;
            case "Tawa":
                author = "tawa";
                break;
            case "The Snowman":
                author = "Snowman";
                break;
            case "Glatorianking":
                author = "BD";
                break;
            case "ÄmKoo":
                author = "Don";
                break;
            case "Don Ämkoo":
                author = "Don";
                break;
            case "Xxonn111":
                author = "Xxonn";
                break;
            case "Xxonn111":
                author = "Xxonn";
                break;
            case "Gekko":
                author = "BD";
                break;
            case "Donny":
                author = "Don";
                break;
            case "Paavo12":
                author = "paavo12";
                break;
            case "Matoro The Blacksnow":
                author = "matorotbs";
                break;
            case "Matoro TBS":
                author = "matorotbs";
                break;
            case "Summerganon":
                author = "suga";
                break;
            case "MahriKing":
                author = "mahriking";
                break;
            case "DJ Peelo":
                author = "peelo";
                break;
            case "KGBio":
                author = "KooGeeBee";
                break;
            case "Toa Hai":
                author = "toahai";
                break;
            case "Bloszar":
                author = "bloszar";
                break;
            case "Jake":
                author = "thejake";
                break;
        }

        if (json.posts.some(e => e.author == author && e.timestamp.getTime() == date.getTime())) continue;

        let found_tags = getTags(content);

        json.posts.push({
            author: author,
            title: initialAuthor,
            id: cat + "-" + filename + "-" + index,
            timestamp: date,
            tags: found_tags,
            content: content
        });

        index++;
    }
}

getFiles("./sivut/", "vanha");
getFiles("./sivut1/", "vanha1");

json.posts.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))

fs.writeFileSync("./vanhaklaanon.json", JSON.stringify(json));

//console.log(json.posts.map(x => x.author).filter((v, i, a) => a.indexOf(v) === i));

console.log("Done!");