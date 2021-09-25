//HTML elements to be updated
const inputValue = document.querySelector("#search");
const searchButton = document.querySelector(".searchButton");
const nameContainer = document.querySelector(".main__profile-name");
const photoContainer = document.querySelector(".main__profile-avt");
const unContainer = document.querySelector(".main__profile-username");
const reposContainer = document.querySelector(".main__profile-repos");
const urlContainer = document.querySelector(".main__profile-url");
const langContainer = document.querySelector(".main__profile-lang");
const langName = document.querySelector(".languages_name");

//Getting the user data
const fetchUser = async (user) => {
    const api_call = await fetch(`https://api.github.com/users/${user}`);
    const data = await api_call.json();
    return {data: data}
}

//Getting the repos data such programming langues and data size
const fetchData = async (user) => {
    const api_call = await fetch(`https://api.github.com/users/${user}/repos`);
    const data = await api_call.json();
    return {data: data}
}

//Getting the used languages in each repo to calculate the percentages
const fetchLang = async (user, repo) => {
    const api_call = await fetch(`https://api.github.com/repos/${user}/${repo}/languages`);
    const data = await api_call.json();
    return {data: data}
}

//The function to be called when the button is pressed to start analyzing the data
const showData = () => {
    var size = 0;
    fetchUser(inputValue.value).then((response) => {
        console.log(response.data);
        if(response.data.name === undefined){
            nameContainer.innerHTML = `<strong>No Data Found!</strong>`;
        }
        else{
            photoContainer.innerHTML = `<img src="${response.data.avatar_url}" width="60" height="60">`
            nameContainer.innerHTML = `<span class="main__profile-value">${response.data.name}</span>`;
            unContainer.innerHTML = `@<span class="main__profile-value">${response.data.login}</span>`;
            reposContainer.innerHTML = `<span class="main__profile-value"><strong>${response.data.public_repos}</strong> Repo(s)</span>`;
        }
        
    });

    fetchData(inputValue.value).then(async (response) =>{
        let langMap = new Map();
        const count = 0;
        let leng = response.data.length;
        var languageArray = new Array();

        //Going through the repos one by one to count the languages used
        await Promise.all(response.data.map(async (element, index)=> {
            size += element.size;
            res = await fetchLang(inputValue.value, element.name); 
            for (const key in res.data) {
                languageArray.push(key);   
            }
        }));

        //initializing the language hash map
        for(const key of languageArray){
            langMap.set(key, 0);
        }

        //setting the count of each language
        for(const key of languageArray){
            let count = langMap.get(key);
            langMap.set(key, count + 1);
        }

        //Adding the languages with the percentages in the HTML part
        var num = 0;
        var tr = document.createElement('tr');
        langName.appendChild(tr);

        for (const [key, value] of langMap) {
            if(num > 4){
                tr =  document.createElement('tr');
                langName.appendChild(tr);
                num = 0;
            }
            console.log(key, value);
            let td = document.createElement('td');
            var val = ((value/8) * 100);
            td.innerHTML = `<p>${key} <br> <strong>%${val}</strong></p>`;
            tr.appendChild(td);
            num++;
        }
        
        //Calculating the total size of code and adding it to the HTML part
        urlContainer.innerHTML = `<span class="main__profile-value"><strong> ${Math.round((size/1024) * 100)/100} </strong> MB code </span>`;
    });
}

//The button listener to call the function as soon as clicked
searchButton.addEventListener("click", () => {
    langName.innerHTML = "";
    nameContainer.innerHTML = "";
    photoContainer.innerHTML = "";
    unContainer.innerHTML = "";
    reposContainer.innerHTML = "";
    urlContainer.innerHTML = "";
    langContainer.innerHTML = "";
    showData();
})