export const getPageTitle = async () => {
  const chromeTabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const currentTab = chromeTabs[0];

  return currentTab.title;
};
