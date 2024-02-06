import { Create_backend } from "../../declarations/Create_backend";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

const loginButton = document.getElementById("login");
const formButtons = document.querySelectorAll('input[type="submit"]');

const enableForms = () => {
  formButtons.forEach((button) => button.removeAttribute("disabled"));
};

const disableForms = () => {
  formButtons.forEach((button) => button.setAttribute("disabled", "true"));
};

const authClient = await AuthClient.create();
const isLocalNetwork = process.env.DFX_NETWORK === "local";
const identityProviderUrl = isLocalNetwork
  ? `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`
  : "https://identity.ic0.app/";

const login = async () => {
  authClient.login({
    identityProvider: identityProviderUrl,
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
    onSuccess: async () => {
      enableForms();
      loginButton.innerText = "Logout";
      loginButton.removeEventListener("click", login);
      loginButton.addEventListener("click", logout);
    },
    onError: (err) => {
      console.error(err);
    },
  });
};

const logout = async () => {
  await authClient.logout();
  disableForms();
  loginButton.innerText = "Login";
  loginButton.removeEventListener("click", logout);
  loginButton.addEventListener("click", login);
};

// Check if user is already logged in
authClient.isAuthenticated().then((isAuthenticated) => {
  if (isAuthenticated) {
    enableForms();
    loginButton.innerText = "Logout";
    loginButton.removeEventListener("click", login);
    loginButton.addEventListener("click", logout);
  }
});

loginButton.addEventListener("click", login);

document
  .getElementById("nameForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    await Create_backend.setName(name);
  });

document
  .getElementById("ageForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const age = parseInt(document.getElementById("age").value, 10);
    if (!isNaN(age)) {
      await Create_backend.setAge(age);
    } else {
      console.error("Age is not a valid number");
    }
  });

document
  .getElementById("schoolForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const school = document.getElementById("school").value;
    await Create_backend.setSchool(school);
  });

async function updateInfo() {
  const info = await Create_backend.getInfo();
  document.getElementById("info").innerText = info;
}

setInterval(updateInfo, 1000);
