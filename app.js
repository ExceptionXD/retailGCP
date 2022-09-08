
var products = []
var productsInCart = []
var YOUR_CLIENT_ID = '92755349225-vvqkfe4teu01oc252simva5gqpoo4av3.apps.googleusercontent.com';
var YOUR_REDIRECT_URI = 'https://exceptionxd.github.io/retailGCP/index.html';
var fragmentString = location.hash.substring(1);
var params = {};
let counter = 0;


function getDummy()
{
  sessionStorage.clear()
  var url = window.location.href
  var data = url.split("&")
  var token = data[1].split("=")
  var accessToken = token[1]
  var search = 'campus';
  
  var data = JSON.stringify({"branch":"projects/tgs-internal-saige-sandbox-001/locations/global/catalogs/default_catalog/branches/1","visitorId":"visitor1","query":search});
  
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.open("POST", "https://retail.googleapis.com/v2alpha/projects/tgs-internal-saige-sandbox-001/locations/global/catalogs/default_catalog/servingConfigs/sample-retail-search:search",true);
  xhr.setRequestHeader("Authorization", "Bearer "+`${accessToken}`);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      let output ='';
      var responseFromBackend = JSON.parse(this.responseText);
      console.log(responseFromBackend,"This is from backend")
      if(responseFromBackend.results != undefined){
        var response = responseFromBackend.results
        products = response;

        for(let i = 0; i<response.length; i++){
          products[i].isAddedToCart = "false"
        }
        
        console.log(products,"This is product array")
        products.forEach(function(products){
          output += `
          <br>
          <div class="col-md-4">
          <div class="card" style="width: 18rem; max-height:70vh">
            <img class="card-img-top zoom" src="${products.product.images[0].uri}" alt="Poster" style="max-height:50vh; min-height:50vh">
            </div>
            <div class = "card-body">
              <button class="btn btn-danger" id="${products.id}" onClick = addToCart("${products.id}","${products.product.images[0].uri}") >Add &#128722</button>
              <button class="btn btn-info" id="addToWishlist" style="margin-left:2%"> &#128151 Wishlist</button>
            </div>
            <br>
        </div>
          `
        })

        document.getElementById('response').innerHTML = output;
      }

    }
  });

  xhr.send(data);

}

function getResponse()
{
  sessionStorage.clear()
  var url = window.location.href
  var data = url.split("&")
  var token = data[1].split("=")
  var accessToken = token[1]
  var search = document.getElementById('inputBar').value;
  
  var data = JSON.stringify({"branch":"projects/tgs-internal-saige-sandbox-001/locations/global/catalogs/default_catalog/branches/1","visitorId":"visitor1","query":search});
  
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.open("POST", "https://retail.googleapis.com/v2alpha/projects/tgs-internal-saige-sandbox-001/locations/global/catalogs/default_catalog/servingConfigs/sample-retail-search:search",true);
  xhr.setRequestHeader("Authorization", "Bearer "+`${accessToken}`);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      let output ='';
      var responseFromBackend = JSON.parse(this.responseText);
      console.log(responseFromBackend,"This is from backend")
      if(responseFromBackend.results != undefined){
        var response = responseFromBackend.results

        products = response;

        for(let i = 0; i<response.length; i++){
          products[i].isAddedToCart = "false"
        }

        products.forEach(function(products){
          output += `
          <br>
          <div class="col-md-4">
          <div class="card" style="width: 18rem; max-height:70vh">
            <img class="card-img-top zoom" src="${products.product.images[0].uri}" alt="Poster" style="max-height:50vh; min-height:50vh">
            </div>
            <div class = "card-body">
              <button class="btn btn-danger" id="${products.id}" onClick = addToCart("${products.id},"${products.product.images[0].uri}") >Add &#128722</button>
              <button class="btn btn-info" id="addToWishlist" style="margin-left:2%"> &#128151 Wishlist</button>
            </div>
            <br>
        </div>
          `
        })

        document.getElementById('response').innerHTML = output;
      }
      else if(responseFromBackend.redirectUri != undefined){
        output ='';
        document.getElementById('response').innerHTML = output;
        var redirectLink = responseFromBackend.redirectUri.split("/")
        var link = redirectLink[0]
        // const url = new URL(link)
        // console.log(url)
        window.open(`https://${link}`, '_blank');
        getDummy();
      }else{
      output += `
      <div>
      <h2>Sorry Data Doesn't Exists</h2>
    </div> `

    document.getElementById('response').innerHTML = output;
    }

    }
  });

  xhr.send(data);

}

function oauth2SignIn() {
  var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  var form = document.createElement('form');
  form.setAttribute('method', 'GET'); // Send as a GET request.
  form.setAttribute('action', oauth2Endpoint);
  var params = {'client_id': YOUR_CLIENT_ID,
                'redirect_uri': YOUR_REDIRECT_URI,
                'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
                'state': 'try_sample_request',
                'include_granted_scopes': 'true',
                'response_type': 'token'};

  for (var p in params) {
    var input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();

}

function getURL(){
  // console.log(window.location.href,"URL");
  var url = window.location.href
  var data = url.split("&")
  // console.log(data[1]);
  var token = data[1].split("=")
  // console.log(token[1]);
  getDummy();
}

function addToCart(id,imgUrl){
    console.log(imgUrl)
    counter++;
    productsInCart.push(imgUrl)
    document.getElementById(id).style.backgroundColor= '#FFB6C1'
    document.getElementById(id).innerText = "Added"
    document.getElementById("CartCount").innerText = counter
    console.log(productsInCart,"Ele")
    sessionStorage.setItem('cartArray', JSON.stringify(productsInCart));
}



function checkout(){

  var sessionString = sessionStorage.getItem('cartArray');
  var finalItems = JSON.parse(sessionString)
  console.log(finalItems, "Current Items")
  let items = ''
  finalItems.forEach(function(finalItems){
    items += `
    <br>
    <div class="col-md-4">
    <div class="card" style="width: 18rem; max-height:70vh">
      <img class="card-img-top zoom" src="${finalItems}" alt="Poster" style="max-height:50vh; min-height:50vh">
      </div>
      <br>
  </div>
    `
  })

  document.getElementById('cartItems').innerHTML = items;

}
