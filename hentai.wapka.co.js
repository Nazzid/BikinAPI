const cheerio = require("cheerio");
const axios = require("axios");

(async ()=>{
  up = await getUpdate()
  vid = await getUrlVid(up.data[2].id)
  wap = await wapkaRedirect(vid.data)
  console.log(vid)
})()

async function getUpdate(){
  try{
    let res = await axios.get("https://hentai.wapka.co/")
    let $ = cheerio.load(res.data)
  
    // listUpdate = $('.listupd').children('article').eq(0).find('a')
    listUpdate = $('.listupd > article').map((i, v)=>{
      return {
        title : $(v).find("a").attr('title'),
        id : $(v).attr('data-id') 
      }
    }).toArray()
  
    return {
      result: true,
      data: listUpdate
    }
    
  }catch{
    return {
      result: false,
      data: []
    }
  }
}

async function getUrlVid(ids){
  try{
      let res = await axios.get("https://hentai.wapka.co/lewat?id=" + ids, {
      headers: { 
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 
        'Accept-Language': 'en-US,en;q=0.9', 
        'Cache-Control': 'max-age=0', 
        'Connection': 'keep-alive', 
        'Cookie': 'PHPSESSID=7edqjguinhl354f9r4cn0gj5rb; PHPSESSID=38fa7t2pujjbh79j527s5rioqm', 
        'Sec-Fetch-Dest': 'document', 
        'Sec-Fetch-Mode': 'navigate', 
        'Sec-Fetch-Site': 'none', 
        'Sec-Fetch-User': '?1', 
        'Upgrade-Insecure-Requests': '1', 
        'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"'
      }
    })
      
    resLink = res.data
    console.log(resLink)
    get = await resLink.match(/document[.]getElementById[(]"countdown"[)].innerHTML = "<a href='(.+?)'/gm)[0].split('?s')[1].replace("'","")
    return {
      result: true,
      data: get
    }
  }catch{
    return {
      result: false,
      data: ''
    }
  }
}

async function wapkaRedirect(urls){
  try{
    // urls = "https://file.wapka.org/008bni/60932c7579ed20be7e77526f71d9271f/rajahentai-xyz-harem-camp-episode-03"
    splitUrl = urls.split('/')
    urlss = `https://file.wapka.org/${splitUrl[3]}/${splitUrl[4]}/download/${splitUrl[5]}`
  
    res = await axios.get(urlss)
    let $ = cheerio.load(res.data)
    
    return {
      result: true,
      data: $('a[id="download_link"]').attr('href')
    }
  }catch{
    return {
      result: false,
      data: ""
    }
  }
}