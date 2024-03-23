
  console.log("我进来了吗")
  document.getElementById('myButton').addEventListener('click', function() {
    console.log(123132,document.getElementById('tbody'))
    chrome.storage.local.get(null, function(result) {    
            console.log(result)
                let htmlText = ''
                result.orderList.forEach(v=>{
                    htmlText += `<table class="table-style"><tbody>
                    <tr><td>${v.nick_name}</td><td>${v.real_name}</td></tr>
                    <tr><td colspan="2">${v.buyer_words || '无备注'}</td></tr>
                    <tr><td colspan="2">${v.product_name}</td></tr>
                    <tr><td colspan="2">${v.product_option}</td></tr>
                    <tr><td colspan="2">${v.order_time}</td></tr></tbody></table>`
                })
                document.getElementById('tbody').innerHTML = htmlText
                console.log(htmlText)
            });
  });
 