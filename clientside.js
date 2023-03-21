// let jq = document.createElement("script");
// jq.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js";
// document.getElementsByTagName("head")[0].appendChild(jq);
let mush = {};
let stockData = {};
let extractData = [];
mush.core = (function() {
    let self = {
        load: function() {
            jQuery(document).ready(self.ready);
        },
        ready:  function() {
            self.fetchProducts();
        },
        fetchProducts: async function(){

            if(window.location.search.includes("?code=")){
                let url = window.location.href;
                    if(typeof url == "string"){
                        if(!url.includes("undefined")){
                            console.log("loading ... please wait");
                            let fetchedProduct = await self.fetchData(url); 
                            extractData.push(...fetchedProduct);
                        }else{
                            console.log(url);
                        }
                    }

            }else{

                let anchors = jQuery("a.v-card--flat");
    
                for(let key in anchors){
                    let url = anchors[key].href;
                    if(typeof url == "string"){
                        if(!url.includes("undefined")){
                            console.log("loading ... please wait");
                            let fetchedProduct = await self.fetchData(url); 
                            extractData.push(...fetchedProduct);
                        }else{
                            console.log(url);
                        }
                    }
                }

            }
            
            const csv = self.convertArrayToCSV(extractData);
            self.downloadCSV(csv, 'data.csv');
            console.log("done check stockData");
        },
        processData: async function(url){
            console.log("loading ... please wait");
            let fetchedProduct = await self.fetchData(url); 
            extractData.push(...fetchedProduct);
            const csv = self.convertArrayToCSV(extractData);
            self.downloadCSV(csv, 'data.csv');
            console.log("done check stockData");
        },
        fetchData: async function(url){
            let singleProduct = [];
            await fetch(url)
                    .then((data) => {
                        return data.text();
                    }).then(function(data) {
                        let dom = new DOMParser().parseFromString(data, "text/html");
                        let productTemplate = jQuery(dom).find("#app > app-main > template:nth-child(3)");
                        let productTemplateData = new DOMParser().parseFromString(productTemplate.html(), "text/html");
                        let details = jQuery(productTemplateData).find('product-page').data('details');
                        if(typeof details != "undefined"){
                            for(let variantIndex in details.variants){
                                let variant = details.variants[variantIndex];
                                console.log(variant.code);
                                singleProduct.push({
                                    title: variant.code,
                                    regular_amount: variant.defaultPrice.formatted,
                                    special_amount: variant.salePrice.formatted,
                                    image_url: window.location.origin + variant.images[0].url, 
                                    dimension: "0 x 0 x 0",
                                    availability: variant.quantity, 
                                    product_url: window.location.origin + url
                                });
                            }
                        }else{
                            console.log(details);
                        }
                        
                    });
            return singleProduct;
        },
        convertArrayToCSV: function(arr) {
          const csvRows = [];
          const headers = Object.keys(arr[0]);
          csvRows.push(headers.join(';'));
        
          for (const row of arr) {
            const values = headers.map(header => {
              const escaped = ('' + row[header]).replace(/"/g, '\\"');
              return `"${escaped}"`;
            });
            csvRows.push(values.join(';'));
          }
        
          return csvRows.join('\n');
        },
        downloadCSV: function (csvString, filename) {
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    return self;
})();
setTimeout(function() {
    mush.core.load();    
}, 500);