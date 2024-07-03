//let IpServerMall = '192.168.202.101'; // CHANDRA KARANG
let IpServerMall = '192.168.207.37';  
declare var require: any;
export const environment = {
  production: true,
  api: "http://"+IpServerMall+"/cso1-api/", // CHANDRA 
  apiBCA: "http://"+IpServerMall+":9400/",   
  device : true,
  developerMode : false,
  base_url: "#/",
  version : require('../../package.json').version+"-Prod",
  token: '',
  socket_url : "http://"+IpServerMall+":3000",  // CHANDRA  
};
