import basicSetup from "../wallet-setup/basic.setup";
import { testWithSynpress } from "@synthetixio/synpress";
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright";

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test("has title", async ({ page }) => {
  // await page.goto("https://playwright.dev/");
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test("show airdrop form when connected to a wallet, otherwise show connect message instead", async ({
  page,
  context,
  metamaskPage,
  extensionId,
}) => {
  //check to see "please connect wallet to proceed"
  await page.goto("/");
  await expect(
    page.getByText("Please connect a wallet to continue...") // does not need to be verbatim
  ).toBeVisible();

  //connecting to metamask
  const metamask = new MetaMask(
    context,
    metamaskPage,
    basicSetup.walletPassword,
    extensionId
  );
  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({
    state: "visible",
    timeout: 300000,
  });
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();

  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    symbol: "ETH",
  };
  await metamask.addNetwork(customNetwork);

  await expect(page.getByText("Token Address")).toBeVisible();
});
