const axios = require('axios');
const baseURL = 'https://api.artsy.net/api/';
const superagent = require('superagent'); // npm install superagent
const { search } = require('../routes/artpieces');
const apiUrl = 'https://api.artsy.net/api/tokens/xapp_token';
const xappToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2Mzc1MGQyNzNiMzlhYzAwMGQ3NzQ3ZmUiLCJleHAiOjE2NzEzNzQ1NTYsImlhdCI6MTY3MDc2OTc1NiwiYXVkIjoiNjM3NTBkMjczYjM5YWMwMDBkNzc0N2ZlIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYzOTVlYzVjZjk5MTgyMDAwZTFlNDhkOSJ9.8xfJi4AifHaqkMAmDgTyHzFTprd3x4grMGcR_WyGnj0';

const getToken = (req, res) => {
    superagent.post(apiUrl)
        .send({ client_id: process.env.Artsy_ClientID, client_secret: process.env.Artsy_ClientSecret}) 
        .end(function(res) {
            xappToken = res.body.token;
            console.log(xappToken);
        });
}

// set up xap-token and set tot default headers
const instance = axios.create({
    baseURL: baseURL,
    timeout:1000,
    headers: {
        'X-Xapp-Token': 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2Mzc1MGQyNzNiMzlhYzAwMGQ3NzQ3ZmUiLCJleHAiOjE2NzEzNzQ1NTYsImlhdCI6MTY3MDc2OTc1NiwiYXVkIjoiNjM3NTBkMjczYjM5YWMwMDBkNzc0N2ZlIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYzOTVlYzVjZjk5MTgyMDAwZTFlNDhkOSJ9.8xfJi4AifHaqkMAmDgTyHzFTprd3x4grMGcR_WyGnj0',
        'Accept': 'application/vnd.artsy-v2+json'
    }
});

// const searchFetch = async(req, res) => {
//     const searchTerm = req.query.query;
//     console.log(req.query.query);
//     await instance.get(baseURL+'search?q='+searchTerm).then(res => {
//         // Promise.resolve(res);
//         const results = res.data._embedded.results;
//         console.log(results);
//         const artworks = Object.values(results).filter(item=>item.type==='artwork');
//         console.log(artworks);
//         artworks.forEach(element=>{
//             const link = element._links.self.href;
//             console.log(link);
//             instance.get(link).then(res => {
//                 console.log(res.data);
//             }).catch(err => {
//                 console.log(err);
//              });
//         })      
//     }).catch(err => {
//         console.log(err);
//      }); 
// }

// const artworkFetch = async(req, res) => {
//     const temp = await instance.get(artwork._links.self.href);
//     if (temp.status==404) {
//         console.log('wrong');
//     }
// }

// const checkAccess = (artworks) => {
//     for (let artwork of artworks) {
//         artwork.
//     }
// }

// get input from user and execute fetch
module.exports.apiIndex = async(req, res)=> {
    const searchTerm = req.query.query;
    console.log(req.query.query);
    //`search?q={searchTerm}`
    await instance.get(baseURL+'search?q='+searchTerm).then(res => {
        // Promise.resolve(res);
        console.log(res.data);
        const results = res.data._embedded.results;
        console.log(results);
        const filtered = Object.values(results).filter(item=>item.type==='show');
        console.log('next');
        console.log(filtered);
        console.log(filtered.length);
        filtered.forEach(element=>{
            const link = element._links.self.href;
            console.log(link);
            instance.get(link).then(res => {
                console.log(res.data);
            }).catch(err => {
                console.log(err);
             });
        });
    })
    .catch(err => {
        Promise.reject(err);
    });
    res.render('artpieces/search')
}


// const axios = require('axios'); // legacy way
// console.log(axios.isCancel('something'));

// const superagent = require('superagent'); // npm install superagent
// const traverson = require('traverson'); // A Hypermedia API/HATEOAS Client for Node.js and the Browser
// const JsonHalAdapter = require('traverson-hal');
// traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);


// // const clientID = '952b6d92cbda71f96601';
// // const clientSecret = '7e62cde1516cf83aa8539e846d05df98';
// const apiUrl = 'https://api.artsy.net/api/tokens/xapp_token';
// // 'https://api.artsy.net/api/artworks';
// const xappToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2Mzc1MGQyNzNiMzlhYzAwMGQ3NzQ3ZmUiLCJleHAiOjE2NzEzNzQ1NTYsImlhdCI6MTY3MDc2OTc1NiwiYXVkIjoiNjM3NTBkMjczYjM5YWMwMDBkNzc0N2ZlIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYzOTVlYzVjZjk5MTgyMDAwZTFlNDhkOSJ9.8xfJi4AifHaqkMAmDgTyHzFTprd3x4grMGcR_WyGnj0';
// // curl -v "https://api.artsy.net/api/images/6290b4b4243ad0000d70bfec" -H "X-XAPP-Token: eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2Mzc1MGQyNzNiMzlhYzAwMGQ3NzQ3ZmUiLCJleHAiOjE2NzEzNzQ1NTYsImlhdCI6MTY3MDc2OTc1NiwiYXVkIjoiNjM3NTBkMjczYjM5YWMwMDBkNzc0N2ZlIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYzOTVlYzVjZjk5MTgyMDAwZTFlNDhkOSJ9.8xfJi4AifHaqkMAmDgTyHzFTprd3x4grMGcR_WyGnj0"
// // curl -v "https://api.artsy.net/api/search?q=rain" -H "X-XAPP-Token: eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2Mzc1MGQyNzNiMzlhYzAwMGQ3NzQ3ZmUiLCJleHAiOjE2NzEzNzQ1NTYsImlhdCI6MTY3MDc2OTc1NiwiYXVkIjoiNjM3NTBkMjczYjM5YWMwMDBkNzc0N2ZlIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYzOTVlYzVjZjk5MTgyMDAwZTFlNDhkOSJ9.8xfJi4AifHaqkMAmDgTyHzFTprd3x4grMGcR_WyGnj0"
// // curl -v -L "https://api.artsy.net/api/artworks?&sample" -H 'X-Xapp-Token:eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiI2Mzc1MGQyNzNiMzlhYzAwMGQ3NzQ3ZmUiLCJleHAiOjE2NzEzNzQ1NTYsImlhdCI6MTY3MDc2OTc1NiwiYXVkIjoiNjM3NTBkMjczYjM5YWMwMDBkNzc0N2ZlIiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjYzOTVlYzVjZjk5MTgyMDAwZTFlNDhkOSJ9.8xfJi4AifHaqkMAmDgTyHzFTprd3x4grMGcR_WyGnj0'

// const api = traverson.from('https://api.artsy.net/api').jsonHal();

// // get xappToken
// request
// .post(apiUrl)
// .send({ client_id: process.env.Artsy_ClientID, client_secret: process.env.Artsy_ClientSecret}) 
// .end(function(res) {
//     xappToken = res.body.token;
//     console.log(xappToken);
// });

// // make requests for single id
// // api.newRequest()
// //   .follow('artwork')
// //   .withRequestOptions({
// //     headers: {
// //       'X-Xapp-Token': xappToken,
// //       'Accept': 'application/vnd.artsy-v2+json'
// //     }
// //   })
// //   .withTemplateParameters({ id: 'andy-warhol' }) // id needs to be retrieve
// //   .getResource(function(error, andyWarhol) {
// //     console.log(andyWarhol.name + 'was born in ' + andyWarhol.birthday + ' in ' + andyWarhol.hometown);
// //   });


// const searchURL = 'https://api.artsy.net/api/search?q=';
// const artworksURL = 'https://api.artsy.net/api/artworks/';
// const baseURL = 'https://api.artsy.net/api/';

// const instance = axios.create({
//     baseURL: baseURL + '/tokens/xapp_token',
//     params: {
//         'client_id': process.env.Artsy_ClientID,
//         'client_secret': process.env.Artsy_ClientSecret
//     }
// });

// const SetupInterceptors = http => {

//     http.interceptors.request.use(
//         config => {
//             config.headers['token'] = `${localStorage.getItem('token')}`
//             config.headers['content-type'] = 'application/json'
//             return config
//         },
//         error => {
//             const status = error?.request?.status || 0
//             const resBaseURL = error?.request?.config?.baseURL
//             if (resBaseURL === baseURL && status === 401) {
//                if (localStorage.getItem('token')) {
//                   localStorage.clear()
//                   window.location.assign('/')
//                   return Promise.reject(error)
//                } else {
//                   return Promise.reject(error)
//                }
//             }
//             return Promise.reject(error)
//         }
//     )

//     http.interceptors.response.use(function(response) {
//         return response
//     }, function (error) {
//         const status = error?.response?.status || 0
//         const resBaseURL = error?.response?.config?.baseURL
//         if (resBaseURL === baseURL && status === 401) {
//             if (localStorage.getItem('token')) {
//                 localStorage.clear()
//                 window.location.assign('/')
//                 return Promise.reject(error)
//             } else {
//                 return Promise.reject(error)
//             }
//         }
//         return Promise.reject(error)
//     })
// }


// // instance.interceptors.response.use(undefined, err => {
// //     const status = err.response ? err.reponse.status : null;
// //     console.log('auth', err.response);
// //     if (status === 401) {
// //         console.log("auth", err.response);
// //         instance.post(err.config.authURL, err.config.auth).then(res => {
// //             let token = res.data.token;
// //             err.config.headers['X-XAPP-Token'] = token;
// //             console.log('calling',err.response)
// //             return instance.request(err.config)
// //         });
// //     }
// // });

// // const getArtwork = () => {
// //     return new Promise({resolve, reject} => {
// //         instance.get(artworksURL).then(res=>{
// //             resolve(res)
// //         })
// //         .catch(err=>{
// //             reject(err);
// //         })
// //     });
// // }

// const form = document.querySelector('#searchForm');
// const container =  document.querySelector('.main');
// let searchTerm = '';

// form.addEventListener('submit', async function(e){
//     e.preventDefault();
//     if (container.firstChild) {
// 		reset();
// 	}
//     searchTerm = form.elements.query.value;
//     if(searchTerm) {
//         checkStatus(searchAPI+searchTerm);
//         getMovie(searchAPI+searchTerm);
//         form.elements.query.value = '';
//     }
// })




// const checkStatus = async(url) => {
//     try{
//         const response = await fetch(url);
//         if(response.status!=200) {
//             handleError();
//             throw new ReferenceError('Failed to fetch data');
//         }
//     } catch (e) {
//         if (e instanceof ReferenceError) {
//             alert(e + ": " + e.message);
//         }
//     }
// }

// // handle error by adding text message to the page
// const handleError = () => {
//     const erroMessage = document.createElement('div');
//     erroMessage.innerHTML = "<span>Failed to fetch data</span>";
//     container.appendChild(erroMessage);
// }

// // fetch from API
// const getArtwork = async(url) => {
//     const response = await fetch(url);
//     const data = await response.json();
//     artworkInfo(data.results)
// }

// // extract information from fetched data for display
// const artworkInfo = (artworks) => {
//     for (let artwork of artworks) {
//         if (artwork.poster_path) {
//             const { id, poster_path, original_title, vote_average, release_date, overview } = show;
//             const movieContainer = document.createElement('div');
//             movieContainer.classList.add("show");
//             const detail = getDetail(idRoot+id+api_key);
//             container.appendChild(movieContainer);
//         }
//     }
// }

// const reset = () => {
// 	container.textContent = '';
// }



// module.exports.apiIndex = async(req, res) => {
//     const artworks = '';
//     res.render('artpieces/index', { artworks }) // render to the file view
// }