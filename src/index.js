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
 * Portions created by the Initial Developer are Copyright (C) 2015
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

const gprefs = require("sdk/preferences/service");
const newtaburl = require('resource:///modules/NewTabURL.jsm').NewTabURL;

// access global startup prefs
var { PrefsTarget } = require("sdk/preferences/event-target");
var target = PrefsTarget({ branchName: "browser.startup."});

// set the newtab url preference on startup / install / enable / upgrade
exports.main = function (options, callbacks) {
  overrideNewTabPage();
};

// if the homepage is changed, set the new override
target.on("homepage", function () {
  overrideNewTabPage();
});

// if the add-on is unloaded, revert the override
exports.onUnload = function (reason) {
  newtaburl.reset();
};

// overrides the new tab to the (first) homepage
function overrideNewTabPage() {
  // Firefox allows multiple piped homepages, take the first if necessary
  var homepage = gprefs.getLocalized("browser.startup.homepage", "about:home").split("|")[0];
  newtaburl.override(homepage);
}