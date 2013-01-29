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
 * Portions created by the Initial Developer are Copyright (C) 2005
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

var newtabhomepage = {

  init: function ()
  {
    gBrowser.removeEventListener("NewTab", BrowserOpenTab, false);
    window.BrowserOpenTab = newtabhomepage.opentab;
    
    // explicitly add new listener
    gBrowser.addEventListener("NewTab", newtabhomepage.opentab, false);
    
    newtabhomepage.prefs = Components.classes['@mozilla.org/preferences-service;1']
                           .getService(Components.interfaces.nsIPrefService);
  },
  
  opentab: function (aEvent)
  {
    // Firefox allows multiple piped homepages, take the first if necessary
    var homepage = gHomeButton.getHomePage().split("|")[0];
    var newtab = gBrowser.addTab(homepage);
    if (newtabhomepage.prefs.getBoolPref("newtabhomepage.selectnewtab"))
    {
      gBrowser.selectedTab = newtab;
      if (gURLBar)
        setTimeout(function() { 
          // if page is about:blank select() works just like focus, two birds one stone
          gURLBar.select();
        }, 0);
    }
    if (aEvent)
      aEvent.stopPropagation();
      
    return newtab;
  }

}

window.addEventListener("load",newtabhomepage.init,false);