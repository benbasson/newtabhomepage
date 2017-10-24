/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is New Tab Homepage.
 *
 * The Initial Developer of the Original Code is
 *   Ben Basson <ben@basson.at>
 * Portions created by the Initial Developer are Copyright (C) 2017
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Ben Basson <ben@basson.at>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

const PERMISSIONS = {"permissions": ['browserSettings']};
const ABOUT_BLANK = "about:blank";
const ABOUT_NEWTAB = "about:newtab";
const STARTS_WITH_ABOUT = /^about:/i;

const newtabhomepage = {

  /** 
   * Redirect the user's new tab to the homepage.
   */
  async redirectUser() {
    // Get the homepage
    let homepage = await newtabhomepage.getHomepageUrl();
    
    // Bail out here if (for some reason) the user has set their homepage to be about:newtab
    // as we're overloading about:newtab already, and any further work will have no effect.
    if (homepage.toLowerCase() === ABOUT_NEWTAB) {
      return;
    }
    
    // fixUrl() here because tabs.update() treats strings relatively to the current url
    // e.g. if the homepage is set to "google.com", it will load via Home button correctly,
    // but we'd try to load it as chrome://<addon-url>/google.com unless we rewrite to prefix
    // with http
    homepage = await newtabhomepage.fixUrl(homepage);
    
    let tabId = null;
    await browser.tabs.update({"url": homepage}, (tab) => {
      if (tab != undefined) {
        tabId = tab.id;
      }
      else {
        console.error("New Tab Homepage was unable to load your homepage '" + homepage + "'");
        return;
      }
    });
    
    // Only try to focus the loaded page if it isn't set to one of the about: pages
    if (!STARTS_WITH_ABOUT.test(homepage)) {
      // Tragically this requires "<all_urls>" permissions as this isn't a user-invoked action
      // and therefore we can't use the "activeTab" permission
      await browser.tabs.executeScript(tabId, {"code": "window.focus();"});
    }
    
    // Tidy up the URL that is put in the history by the addon loading its own new tab page
    browser.history.deleteUrl({"url": browser.extension.getURL("redirect.html")});
  },
  
  /**
   * Gets the homepage URL from the browser settings.
   * 
   * @return the homepage URL as a string
   */
  async getHomepageUrl() {
    let homepage;
    // Make sure we have permission (we should as the add-on requires it at install time)
    let hasPermission = await browser.permissions.contains(PERMISSIONS);
    if (hasPermission) {
      // Get the homepage (misleading API method actually always gets homepage even if not overridden)
      let result = await browser.browserSettings.homepageOverride.get({});
      homepage = result.value.split("|")[0].trim();
      return homepage;
    }
    else {
      return ABOUT_BLANK;
    }
  },
  
  /**
   * Fixes up the URL provided so that it is absolute, i.e. fully qualified 
   * with a protocol.
   *
   * @param url the url to fix up
   * @return the url as-is or with a protocol prepended
   */
  async fixUrl (url) {
    // Don't do anything if the URL is totally blank for some reason
    if (!url) {
      return;
    }
    
    // Try to parse the URL
    let parsedURL
    try {
      parsedURL = new URL(url);
    }
    catch (ex) {} // ignore
    
    // Append HTTP if we don't have a protocol, or otherwise didn't parse the URL
    if (!parsedURL || parsedURL.protocol === null) {
      return "http://" + url;
    }
    return url;
  }
  
};

newtabhomepage.redirectUser();