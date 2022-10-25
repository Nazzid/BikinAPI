const cheerio = require("cheerio");
const axios = require("axios");

(async ()=>{
  home = await getEpsUpdate()
  getUrl = await getUrlVid(home.data[4].link)
  getReal = await getRealVid(getUrl.data[0])
  console.log(getReal)
  
  
})()

async function getEpsUpdate(){
  try{
    let res = await axios.get("http://185.215.164.126/")
    let $ = cheerio.load(res.data)
  
    listUpdate = $('.bixbox').eq(0).find('article').map((i, v)=>{
      return {
        title : $(v).find("a").attr('title'),
        link: $(v).find("a").attr('href')
      }
    }).toArray()
    // console.log(listUpdate)
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

async function getUrlVid(url){
  try{
    let res = await axios.get(url)
    let $ = cheerio.load(res.data)
    target = $(".mirror > option")
    a = target.map((i,v)=>{
      encVal = $(v).attr('value')
      let buff = Buffer.from(encVal, 'base64').toString('utf-8');
      let myRegexp = new RegExp('src="(.+?)"', "g");
      let match = myRegexp.exec(buff);
      if(match !== null && match[1]) return match[1]
      return ''
    }).toArray()
    b = a.filter((item)=>{
      return item.includes('blog.cunek.xyz')
    })
  
    if(b.length > 0) return {
      result: true,
      data: b
    }
    return {
      result: false,
      data: []
    }
  }catch{
    return {
      result: false,
      data: []
    }
  }
}

async function getRealVid(urls){
  try{
    res = await axios.get(urls)
    let $ = cheerio.load(res.data)
    encoded = $('script[type="text/javascript"]').get()[4].children[0].data
    let b = eval(encoded.replace('eval', ''))
    let myRegexp = new RegExp('[({]sources:(.+?),cast', "g");
    let match = myRegexp.exec(b);
     
    if(match && match[1]){
      let objUrl = eval(match[1])
      return {
        result: true,
        data: objUrl
      }
    }
    return {
      result: false,
      data: []
    }
  }catch{
    return {
      result: false,
      data: []
    }
  }
}