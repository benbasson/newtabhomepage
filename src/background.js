const REDIRECT_PAGE = browser.runtime.getURL("redirect.html");

// redirect.js will close its own tab, but cannot remove the tab from the
// recently closed list. So we remove it here.
browser.sessions.onChanged.addListener(async () => {
  let [session] = await browser.sessions.getRecentlyClosed({"maxResults": 1});
  if (session && session.tab && session.tab.url === REDIRECT_PAGE) {
    await browser.sessions.forgetClosedTab(session.tab.windowId, session.tab.sessionId);
  }
});
