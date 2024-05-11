const fs = require('node:fs');
const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

/********
 * 1. Make a http request to a url and get html data.
 * 2. Save html data in a file.
 * 3. use cheerio to extract particular details.
 * 4. save details in a ds.
 * 4. save in .xlsx fle using same module.
 * ***** */

const url = 'https://www.freshersworld.com/jobs/category/it-software-job-vacancies';
// const url = 'https://www.quikr.com/jobs/jobs-in-agra+zwqxj2726005330';

async function getPageData(url) {
    try {
        const response = await axios.get(url);
        const strData = (response.data);
        fs.writeFileSync('naukriData.txt', strData);
    } catch(err) {
        console.log('ERROR OCCURED:', err);
    }
}

function readPageData() {
    const htmlData = fs.readFileSync('naukriData.txt', { encoding: 'utf-8' });
    return htmlData;
}

const htmlData = readPageData();
const $ = cheerio.load(htmlData);

function fillDataArr() {
    const dataArr = [];

    const dataContainer = $('div#sort-jobs')
    const containers = $(dataContainer).find('div#all-jobs-append');

    containers.each((idx,ele) => {
        const jobTitle = $(ele).find('span.wrap-title.seo_title').text();
        const companyName = $(ele).find('h3.latest-jobs-title.font-16.margin-none.inline-block.company-name').text();
        const location = $(ele).find('span.job-location.display-block.modal-open.job-details-span').children().text();
        const qualificationCont = $(ele).find('span.qualifications.display-block.modal-open.pull-left.job-details-span').children();
        // console.log(qualification.length);
        let qualification = '';
        qualificationCont.each((idx,ele) => {
            qualification += $(ele).text() + ',';
        })
        dataArr.push({
            JobTitle: jobTitle,
            COMPANY: companyName,
            LOCATION: location,
            QUALIFICATION: qualification
        })
    })

    return dataArr;
}

const dataArr = fillDataArr();

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(dataArr);

xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
xlsx.writeFile(workbook, "jobpostings.xlsx");

// getPageData(url);

