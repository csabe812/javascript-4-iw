import { ALL_DOG_API_URL, DOG_API_URL, MAGIC_NUMBER } from "./config.js";

let dogNameItems = [];
const dogImages = [];
const spinner = document.querySelector(".loader");

const getAllDogs = async function () {
  try {
    const resp = await fetch(ALL_DOG_API_URL);
    const data = await resp.json();
    for (const [key, value] of Object.entries(data.message)) {
      dogNameItems.push({
        name: key[0].toUpperCase() + key.slice(1),
        subType: value?.length > 0 ? value.join(" - ") : "No subtype",
      });
    }
    // Now we cut it to MAGIC_NUMBER items...
    dogNameItems = dogNameItems.slice(0, MAGIC_NUMBER);
    console.log(dogNameItems);
  } catch (err) {
    console.error(`!!! Error during getAllDogs(): ${err} !!!`);
  }
};

const getOneRandomDogPicture = function () {
  try {
    return fetch(DOG_API_URL);
  } catch (err) {
    console.error(`!!! Error during getRandomDogPicture(): ${err} !!!`);
  }
};

const createRandomDogs = async function () {
  try {
    const promiseArr = [];
    for (let i = 0; i < MAGIC_NUMBER; i++) {
      promiseArr.push(getOneRandomDogPicture());
    }
    return Promise.all(promiseArr);
  } catch (err) {
    console.error(`!!! Error during createRandomDogs(): ${err} !!!`);
  }
};

const createRandomDogImages = async function () {
  const resp = await createRandomDogs();
  for (let i of resp) {
    const data = await i.json();
    dogImages.push(data.message);
  }
};

const generateHtmlMarkup = async function () {
  console.log(dogImages);
  const body = document.querySelector(".container");
  for (let i = 0; i < MAGIC_NUMBER; i++) {
    const markup = `
    <div class="card">
      <img src="${dogImages[i]}" alt="Avatar" style="width:100%">
      <div class="container">
        <h4><b>${dogNameItems[i].name}</b></h4> 
        <p>${dogNameItems[i].subType}</p> 
      </div>
    </div>
    `;
    body.insertAdjacentHTML("beforeend", markup);
  }
};

const createHtml = async function () {
  try {
    spinner.classList.toggle("hidden");
    await getAllDogs();
    await createRandomDogImages();
    await generateHtmlMarkup();
  } catch (err) {
    console.error(`!!! Error during createHtml(): ${err} !!!`);
  } finally {
    spinner.classList.toggle("hidden");
  }
};

const init = async function () {
  await createHtml();
};

init();
