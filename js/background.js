let activeTabId;
const getNameUrl = "https://fxg.jinritemai.com/api/order/receiveinfo?order_id"
const getOrderList = "https://fxg.jinritemai.com/api/order/searchlist?page=0&pageSize=10" //&order_status=stock_up
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    activeTabId = tabId;
  }
});

const getOrderListFun = async()=>{
    const orderListData = []
    await fetch(getOrderList).then(response => response.json()).then(body => requestBody = body)
    .catch(error => console.error(error));
    if(requestBody.data.length){
        const urls =  requestBody.data.map(v=>`${getNameUrl}=${v.shop_order_id}`)
        const promises = urls.map(url => fetch(url));
        Promise.all(promises)
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
            data.forEach((v,i)=>{
                console.log(i,v,requestBody.data[i])
                orderListData.push({
                    nick_name:v.data?.receive_info?.post_receiver, //真实姓名
                    real_name:v.data?.nick_name, //用户昵称
                    order_time:requestBody.data[i].create_time_str, //下单时间
                    product_name:requestBody.data[i].product_item.map(n=>n.product_name).toString(), //产品名称
                    product_option:requestBody.data[i].product_item[0].sku_spec.map(n=>n.value).toString(), // 选号信息
                    product_item: requestBody.data[i].product_item, //产品名称
                    buyer_words:requestBody.data[i].buyer_words, // 下单备注
                })
                
            })
            chrome.storage.local.set({orderList:orderListData});
        }).catch();
    }           
}
getOrderListFun()


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.message === "调用函数") {
       chrome.storage.local.get(null, function(result) {    
        console.log(result)
            let htmlText = ''
            result.orderList.forEach(v=>{
                htmlText += `<tr><td>${v.nick_name}</td><td>${v.real_name}</td></tr>
                <tr><td>${v.real_name}</td><td>${v.post_receiver}</td></tr>
                <tr><td>${v.buyer_words}</td></tr>
                <tr><td>${v.product_name}</td></tr>
                <tr><td>${v.product_option}</td></tr>
                <tr><td>${v.order_time}</td></tr>`
            })
            chrome.runtime.sendMessage({message: htmlText});
        });
        sendResponse({result: "函数调用成功"});
    }
});

// chrome.webRequest.onBeforeRequest.addListener(
//   async function(details) {
//     let orderListData = []
//     if (activeTabId && details.url.includes('order/searchlist') && !details.url.includes('endChrome')) {
//         let requestBody;
//         await fetch(details.url+'&order_status=stock_up&endChrome')
//           .then(response => response.json())
//           .then(body => requestBody = body)
//           .catch(error => console.error(error));
//           if(requestBody.data.length){
//             const urls =  requestBody.data.map(v=>`${getNameUrl}=${v.shop_order_id}`)
//             const promises = urls.map(url => fetch(url));
//             Promise.all(promises)
//             .then(responses => Promise.all(responses.map(res => res.json())))
//             .then(data => {
//                 console.log(data)
//                 data.forEach((v,i)=>{
//                     orderListData.push({
//                         nick_name:v.data?.receive_info?.post_receiver, //真实姓名
//                         real_name:v.data?.nick_name, //用户昵称
//                         order_time:requestBody.data[i].create_time_str, //下单时间
//                         product_name:requestBody.data[i].product_item.map(n=>n.product_name), //产品名称
//                         product_option:requestBody.data[i].sku_spec.map(n=>n.value), // 选号信息
//                         product_item: requestBody.data[i].product_item, //产品名称
//                         buyer_words:requestBody.data[i].buyer_words, // 下单备注
//                     })
                    
//                 })
//                 chrome.storage.local.set({orderList:orderListData});
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//           }           
//         }
//     },
//     {urls: ["<all_urls>"]},
//     ["requestBody"]
//   );


