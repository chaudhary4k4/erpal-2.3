//v.2.6 build 100722

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/


dhtmlXMenuObject.prototype.extendedModule = "DHXMENUEXT";dhtmlXMenuObject.prototype.setItemEnabled = function(id) {this._changeItemState(id, "enabled", this._getItemLevelType(id));};dhtmlXMenuObject.prototype.setItemDisabled = function(id) {this._changeItemState(id, "disabled", this._getItemLevelType(id));};dhtmlXMenuObject.prototype.isItemEnabled = function(id) {return (this.itemPull[this.idPrefix+id]!=null?(this.itemPull[this.idPrefix+id]["state"]=="enabled"):false);};dhtmlXMenuObject.prototype._changeItemState = function(id, newState, levelType) {var t = false;var j = this.idPrefix + id;if ((this.itemPull[j] != null)&& (this.idPull[j] != null)) {if (this.itemPull[j]["state"] != newState){this.itemPull[j]["state"] = newState;if (this.itemPull[j]["parent"] == this.idPrefix+this.topId && !this.context){this.idPull[j].className = "dhtmlxMenu_"+this.skin+"_TopLevel_Item_"+(this.itemPull[j]["state"]=="enabled"?"Normal":"Disabled");}else {this.idPull[j].className = "sub_item"+(this.itemPull[j]["state"]=="enabled"?"":"_dis");};this._updateItemComplexState(this.idPrefix+id, this.itemPull[this.idPrefix+id]["complex"], false);this._updateItemImage(id, levelType);if ((this.idPrefix + this.menuLastClicked == j)&& (levelType != "TopLevel")) {this._redistribSubLevelSelection(j, this.itemPull[j]["parent"]);};if (levelType == "TopLevel" && !this.context){}}};return t;};dhtmlXMenuObject.prototype.getItemText = function(id) {return (this.itemPull[this.idPrefix+id]!=null?this.itemPull[this.idPrefix+id]["title"]:"");};dhtmlXMenuObject.prototype.setItemText = function(id, text) {id = this.idPrefix + id;if ((this.itemPull[id] != null)&& (this.idPull[id] != null)) {this._clearAndHide();this.itemPull[id]["title"] = text;if (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context){var tObj = null;for (var q=0;q<this.idPull[id].childNodes.length;q++){try {if (this.idPull[id].childNodes[q].className == "top_level_text")tObj = this.idPull[id].childNodes[q];}catch(e) {}};if (String(this.itemPull[id]["title"]).length == "" || this.itemPull[id]["title"] == null) {if (tObj != null)tObj.parentNode.removeChild(tObj);}else {if (!tObj){tObj = document.createElement("DIV");tObj.className = "top_level_text";if (this._rtl && this.idPull[id].childNodes.length > 0)this.idPull[id].insertBefore(tObj,this.idPull[id].childNodes[0]);else this.idPull[id].appendChild(tObj);};tObj.innerHTML = this.itemPull[id]["title"];}}else {var tObj = null;for (var q=0;q<this.idPull[id].childNodes[1].childNodes.length;q++){if (String(this.idPull[id].childNodes[1].childNodes[q].className||"")== "sub_item_text") tObj = this.idPull[id].childNodes[1].childNodes[q];};if (String(this.itemPull[id]["title"]).length == "" || this.itemPull[id]["title"] == null) {if (tObj){tObj.parentNode.removeChild(tObj);tObj = null;this.idPull[id].childNodes[1].innerHTML = "&nbsp;";}}else {if (!tObj){tObj = document.createElement("DIV");tObj.className = "sub_item_text";this.idPull[id].childNodes[1].innerHTML = "";this.idPull[id].childNodes[1].appendChild(tObj);};tObj.innerHTML = this.itemPull[id]["title"];}}}};dhtmlXMenuObject.prototype.loadFromHTML = function(objId, clearAfterAdd, onLoadFunction) {this.itemTagName = "DIV";if (typeof(objId)== "string") {objId = document.getElementById(objId);};this._buildMenu(objId, null);this.init();if (clearAfterAdd){objId.parentNode.removeChild(objId);};if (onLoadFunction != null){onLoadFunction();}};dhtmlXMenuObject.prototype.hideItem = function(id) {this._changeItemVisible(id, false);};dhtmlXMenuObject.prototype.showItem = function(id) {this._changeItemVisible(id, true);};dhtmlXMenuObject.prototype.isItemHidden = function(id) {var isHidden = null;if (this.idPull[this.idPrefix+id] != null){isHidden = (this.idPull[this.idPrefix+id].style.display == "none");};return isHidden;};dhtmlXMenuObject.prototype._changeItemVisible = function(id, visible) {itemId = this.idPrefix+id;if (this.itemPull[itemId] == null)return;if (this.itemPull[itemId]["type"] == "separator"){itemId = "separator_"+itemId;};if (this.idPull[itemId] == null)return;this.idPull[itemId].style.display = (visible?"":"none");this._redefineComplexState(this.itemPull[this.idPrefix+id]["parent"]);};dhtmlXMenuObject.prototype.setUserData = function(id, name, value) {this.userData[this.idPrefix+id+"_"+name] = value;};dhtmlXMenuObject.prototype.getUserData = function(id, name) {return (this.userData[this.idPrefix+id+"_"+name]!=null?this.userData[this.idPrefix+id+"_"+name]:null);};dhtmlXMenuObject.prototype.setOpenMode = function(mode) {if (mode == "win" || mode == "web")this.menuMode = mode;else this.menuMode == "web";};dhtmlXMenuObject.prototype.setWebModeTimeout = function(tm) {this.menuTimeoutMsec = (!isNaN(tm)?tm:400);};dhtmlXMenuObject.prototype.enableDynamicLoading = function(url, icon) {this.dLoad = true;this.dLoadUrl = url;this.dLoadSign = (String(this.dLoadUrl).search(/\?/)==-1?"?":"&");this.loaderIcon = icon;this.init();};dhtmlXMenuObject.prototype._updateLoaderIcon = function(id, state) {if (this.idPull[id] == null)return;if (String(this.idPull[id].className).search("TopLevel_Item") >= 0) return;var ind = (this._rtl?0:2);if (!this.idPull[id].childNodes[ind])return;if (!this.idPull[id].childNodes[ind].childNodes[0])return;var aNode = this.idPull[id].childNodes[ind].childNodes[0];if (String(aNode.className).search("complex_arrow") === 0) aNode.className = "complex_arrow"+(state?"_loading":"");};dhtmlXMenuObject.prototype.getItemImage = function(id) {var imgs = new Array(null, null);id = this.idPrefix+id;if (this.itemPull[id]["type"] == "item"){imgs[0] = this.itemPull[id]["imgen"];imgs[1] = this.itemPull[id]["imgdis"];};return imgs;};dhtmlXMenuObject.prototype.setItemImage = function(id, img, imgDis) {if (this.itemPull[this.idPrefix+id]["type"] != "item")return;this.itemPull[this.idPrefix+id]["imgen"] = img;this.itemPull[this.idPrefix+id]["imgdis"] = imgDis;this._updateItemImage(id, this._getItemLevelType(id));};dhtmlXMenuObject.prototype.clearItemImage = function(id) {this.setItemImage(id, "", "");};dhtmlXMenuObject.prototype.setAutoShowMode = function(mode) {this.contextAutoShow = (mode==true?true:false);};dhtmlXMenuObject.prototype.setAutoHideMode = function(mode) {this.contextAutoHide = (mode==true?true:false);};dhtmlXMenuObject.prototype.setContextMenuHideAllMode = function(mode) {this.contextHideAllMode = (mode==true?true:false);};dhtmlXMenuObject.prototype.getContextMenuHideAllMode = function() {return this.contextHideAllMode;};dhtmlXMenuObject.prototype.setVisibleArea = function(x1, x2, y1, y2) {this._isVisibleArea = true;this.menuX1 = x1;this.menuX2 = x2;this.menuY1 = y1;this.menuY2 = y2;};dhtmlXMenuObject.prototype.setTooltip = function(id, tip) {id = this.idPrefix+id;if (!(this.itemPull[id] != null && this.idPull[id] != null)) return;this.idPull[id].title = (tip.length > 0 ? tip : null);this.itemPull[id]["tip"] = tip;};dhtmlXMenuObject.prototype.getTooltip = function(id) {if (this.itemPull[this.idPrefix+id] == null)return null;return this.itemPull[this.idPrefix+id]["tip"];};dhtmlXMenuObject.prototype.setHotKey = function(id, hkey) {id = this.idPrefix+id;if (!(this.itemPull[id] != null && this.idPull[id] != null)) return;if (this.itemPull[id]["parent"] == this.idPrefix+this.topId && !this.context)return;if (this.itemPull[id]["complex"])return;if (this.itemPull[id]["type"] != "item")return;var hkObj = null;try {if (this.idPull[id].childNodes[this._rtl?0:2].childNodes[0].className == "sub_item_hk")hkObj = this.idPull[id].childNodes[this._rtl?0:2].childNodes[0];}catch(e){};if (hkey.length == 0){this.itemPull[id]["hotkey_backup"] = this.itemPull[id]["hotkey"];this.itemPull[id]["hotkey"] = "";if (hkObj != null)hkObj.parentNode.removeChild(hkObj);}else {this.itemPull[id]["hotkey"] = hkey;this.itemPull[id]["hotkey_backup"] = null;if (hkObj == null){hkObj = document.createElement("DIV");hkObj.className = "sub_item_hk";var item = this.idPull[id].childNodes[this._rtl?0:2];while (item.childNodes.length > 0)item.removeChild(item.childNodes[0]);item.appendChild(hkObj);};hkObj.innerHTML = hkey;}};dhtmlXMenuObject.prototype.getHotKey = function(id) {if (this.itemPull[this.idPrefix+id] == null)return null;return this.itemPull[this.idPrefix+id]["hotkey"];};dhtmlXMenuObject.prototype.setItemSelected = function(id) {if (this.itemPull[this.idPrefix+id] == null)return null;};dhtmlXMenuObject.prototype.setTopText = function(text) {if (this.context)return;if (this._topText == null){this._topText = document.createElement("DIV");this._topText.className = "dhtmlxMenu_TopLevel_Text_"+(this._rtl?"left":(this._align=="left"?"right":"left"));this.base.appendChild(this._topText);};this._topText.innerHTML = text;};dhtmlXMenuObject.prototype.setAlign = function(align) {if (this._align == align)return;if (align == "left" || align == "right"){this._align = align;if (this.cont)this.cont.className = (this._align=="right"?"align_right":"align_left");if (this._topText != null)this._topText.className = "dhtmlxMenu_TopLevel_Text_"+(this._align=="left"?"right":"left");}};dhtmlXMenuObject.prototype.setHref = function(itemId, href, target) {if (this.itemPull[this.idPrefix+itemId] == null)return;this.itemPull[this.idPrefix+itemId]["href_link"] = href;if (target != null)this.itemPull[this.idPrefix+itemId]["href_target"] = target;};dhtmlXMenuObject.prototype.clearHref = function(itemId) {if (this.itemPull[this.idPrefix+itemId] == null)return;delete this.itemPull[this.idPrefix+itemId]["href_link"];delete this.itemPull[this.idPrefix+itemId]["href_target"];};dhtmlXMenuObject.prototype.getCircuit = function(id) {var parents = new Array(id);while (this.getParentId(id)!= this.topId) {id = this.getParentId(id);parents[parents.length] = id;};return parents.reverse();};dhtmlXMenuObject.prototype._clearAllSelectedSubItemsInPolygon = function(polygon) {var subIds = this._getSubItemToDeselectByPolygon(polygon);for (var q=0;q<this._openedPolygons.length;q++){if (this._openedPolygons[q] != polygon){this._hidePolygon(this._openedPolygons[q]);}};for (var q=0;q<subIds.length;q++){if (this.idPull[subIds[q]] != null){if (this.itemPull[subIds[q]]["state"] == "enabled"){this.idPull[subIds[q]].className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_Item_Normal";}}}};dhtmlXMenuObject.prototype._checkArrowsState = function(id) {var polygon = this.idPull["polygon_"+id];var arrowUp = this.idPull["arrowup_"+id];var arrowDown = this.idPull["arrowdown_"+id];if (polygon.scrollTop == 0){arrowUp.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp_Disabled";}else {arrowUp.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp" + (arrowUp.over ? "_Over" : "");};if (polygon.scrollTop + polygon.offsetHeight < polygon.scrollHeight){arrowDown.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown" + (arrowDown.over ? "_Over" : "");}else {arrowDown.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown_Disabled";}};dhtmlXMenuObject.prototype._addUpArrow = function(id) {var main_self = this;var arrow = document.createElement("DIV");arrow.pId = this.idPrefix+id;arrow.id = "arrowup_"+this.idPrefix+id;arrow.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowUp";arrow.innerHTML = "<div class='dhtmlxMenu_"+this.skin+"_SubLevelArea_Arrow'><div class='dhtmlxMenu_SubLevelArea_Arrow_Icon'></div></div>";arrow.style.display = "none";arrow.over = false;arrow.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;};arrow.oncontextmenu = function(e) {e = e||event;e.returnValue = false;return false;};arrow.onmouseover = function() {if (main_self.menuMode == "web"){window.clearTimeout(main_self.menuTimeoutHandler);};main_self._clearAllSelectedSubItemsInPolygon(this.pId);if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Disabled")return;this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Over";this.over = true;main_self._canScrollUp = true;main_self._doScrollUp(this.pId, true);};arrow.onmouseout = function() {if (main_self.menuMode == "web"){window.clearTimeout(main_self.menuTimeoutHandler);main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");};this.over = false;main_self._canScrollUp = false;if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp_Disabled")return;this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowUp";window.clearTimeout(main_self._scrollUpTM);};arrow.onclick = function(e) {e = e||event;e.returnValue = false;e.cancelBubble = true;return false;};document.body.insertBefore(arrow, document.body.firstChild);this.idPull[arrow.id] = arrow;};dhtmlXMenuObject.prototype._addDownArrow = function(id) {var main_self = this;var arrow = document.createElement("DIV");arrow.pId = this.idPrefix+id;arrow.id = "arrowdown_"+this.idPrefix+id;arrow.className = "dhtmlxMenu_"+this.skin+"_SubLevelArea_ArrowDown";arrow.innerHTML = "<div class='dhtmlxMenu_"+this.skin+"_SubLevelArea_Arrow'><div class='dhtmlxMenu_SubLevelArea_Arrow_Icon'></div></div>";arrow.style.display = "none";arrow.over = false;arrow.onselectstart = function(e) {e = e||event;e.returnValue = false;return false;};arrow.oncontextmenu = function(e) {e = e||event;e.returnValue = false;return false;};arrow.onmouseover = function() {if (main_self.menuMode == "web"){window.clearTimeout(main_self.menuTimeoutHandler);};main_self._clearAllSelectedSubItemsInPolygon(this.pId);if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Disabled")return;this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Over";this.over = true;main_self._canScrollDown = true;main_self._doScrollDown(this.pId, true);};arrow.onmouseout = function() {if (main_self.menuMode == "web"){window.clearTimeout(main_self.menuTimeoutHandler);main_self.menuTimeoutHandler = window.setTimeout(function(){main_self._clearAndHide();}, main_self.menuTimeoutMsec, "JavaScript");};this.over = false;main_self._canScrollDown = false;if (this.className == "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown_Disabled")return;this.className = "dhtmlxMenu_"+main_self.skin+"_SubLevelArea_ArrowDown";window.clearTimeout(main_self._scrollDownTM);};arrow.onclick = function(e) {e = e||event;e.returnValue = false;e.cancelBubble = true;return false;};document.body.insertBefore(arrow, document.body.firstChild);this.idPull[arrow.id] = arrow;};dhtmlXMenuObject.prototype._removeUpArrow = function(id) {var fullId = "arrowup_"+this.idPrefix+id;this._removeArrow(fullId);};dhtmlXMenuObject.prototype._removeDownArrow = function(id) {var fullId = "arrowdown_"+this.idPrefix+id;this._removeArrow(fullId);};dhtmlXMenuObject.prototype._removeArrow = function(fullId) {var arrow = this.idPull[fullId];arrow.onselectstart = null;arrow.oncontextmenu = null;arrow.onmouseover = null;arrow.onmouseout = null;arrow.onclick = null;if (arrow.parentNode)arrow.parentNode.removeChild(arrow);arrow = null;this.idPull[fullId] = null;try {delete this.idPull[fullId];}catch(e) {}};dhtmlXMenuObject.prototype._isArrowExists = function(id) {if (this.idPull["arrowup_"+id] != null && this.idPull["arrowdown_"+id] != null)return true;return false;};dhtmlXMenuObject.prototype._doScrollUp = function(id, checkArrows) {var polygon = this.idPull["polygon_"+id];if (this._canScrollUp && polygon.scrollTop > 0){var theEnd = false;var nextScrollTop = polygon.scrollTop - this._scrollUpTMStep;if (nextScrollTop < 0){theEnd = true;nextScrollTop = 0;};polygon.scrollTop = nextScrollTop;if (!theEnd){var that = this;this._scrollUpTM = window.setTimeout(function() {that._doScrollUp(id, false);}, this._scrollUpTMTime);}}else {this._canScrollUp = false;this._checkArrowsState(id);};if (checkArrows){this._checkArrowsState(id);}};dhtmlXMenuObject.prototype._doScrollDown = function(id, checkArrows) {var polygon = this.idPull["polygon_"+id];if (this._canScrollDown && polygon.scrollTop + polygon.offsetHeight <= polygon.scrollHeight){var theEnd = false;var nextScrollTop = polygon.scrollTop + this._scrollDownTMStep;if (nextScrollTop + polygon.offsetHeight > polygon.scollHeight){theEnd = true;nextScrollTop = polygon.scollHeight - polygon.offsetHeight;};polygon.scrollTop = nextScrollTop;if (!theEnd){var that = this;this._scrollDownTM = window.setTimeout(function() {that._doScrollDown(id, false);}, this._scrollDownTMTime);}}else {this._canScrollDown
 this._checkArrowsState(id);};if (checkArrows){this._checkArrowsState(id);}};dhtmlXMenuObject.prototype._countPolygonItems = function(id) {var count = 0;for (var a in this.itemPull){var par = this.itemPull[a]["parent"];var tp = this.itemPull[a]["type"];if (par == this.idPrefix+id && (tp == "item" || tp == "radio" || tp == "checkbox")) {count++;}};return count;};dhtmlXMenuObject.prototype.setOverflowHeight = function(itemsNum) {if (this.limit == 0 && itemsNum <= 0)return;this._clearAndHide();if (this.limit >= 0 && itemsNum > 0){this.limit = itemsNum;return;};if (this.limit > 0 && itemsNum <= 0){for (var a in this.itemPull){if (this._isArrowExists(a)) {var b = String(a).replace(this.idPrefix, "");this._removeUpArrow(b);this._removeDownArrow(b);this.idPull["polygon_"+a].style.height = "";}};this.limit = 0;return;}};dhtmlXMenuObject.prototype._getRadioImgObj = function(id) {try {var imgObj = this.idPull[this.idPrefix+id].childNodes[(this._rtl?2:0)].childNodes[0] }catch(e) {var imgObj = null;};return imgObj;};dhtmlXMenuObject.prototype._setRadioState = function(id, state) {var imgObj = this._getRadioImgObj(id);if (imgObj != null){var rObj = this.itemPull[this.idPrefix+id];rObj["checked"] = state;rObj["imgen"] = "rdbt_"+(rObj["checked"]?"1":"0");rObj["imgdis"] = rObj["imgen"];imgObj.className = "sub_icon "+rObj["imgen"];}};dhtmlXMenuObject.prototype._radioOnClickHandler = function(id, type, casState) {if (type.charAt(1)=="d" || this.itemPull[this.idPrefix+id]["group"]==null) return;var group = this.itemPull[this.idPrefix+id]["group"];if (this.checkEvent("onRadioClick")) {if (this.callEvent("onRadioClick", [group, this.getRadioChecked(group), id, this.contextMenuZoneId, casState])) {this.setRadioChecked(group, id);}}else {this.setRadioChecked(group, id);};if (this.checkEvent("onClick")) this.callEvent("onClick", [id]);};dhtmlXMenuObject.prototype.getRadioChecked = function(group) {var id = null;for (var q=0;q<this.radio[group].length;q++){var itemId = this.radio[group][q].replace(this.idPrefix, "");var imgObj = this._getRadioImgObj(itemId);if (imgObj != null){var checked = (imgObj.className).match(/rdbt_1$/gi);if (checked != null)id = itemId;}};return id;};dhtmlXMenuObject.prototype.setRadioChecked = function(group, id) {if (this.radio[group] == null)return;for (var q=0;q<this.radio[group].length;q++){var itemId = this.radio[group][q].replace(this.idPrefix, "");this._setRadioState(itemId, (itemId==id));}};dhtmlXMenuObject.prototype.addRadioButton = function(mode, nextToId, pos, itemId, itemText, group, state, disabled) {if (this.context && nextToId == this.topId){}else {if (this.itemPull[this.idPrefix+nextToId] == null)return;if (mode == "child" && this.itemPull[this.idPrefix+nextToId]["type"] != "item")return;};var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));var img = "rdbt_"+(state?"1":"0");var imgDis = img;if (mode == "sibling"){var parentId = this.idPrefix+this.getParentId(nextToId);this._addItemIntoGlobalStrorage(id, parentId, itemText, "radio", disabled, img, imgDis);this._renderSublevelItem(id, this.getItemPosition(nextToId));}else {var parentId = this.idPrefix+nextToId;this._addItemIntoGlobalStrorage(id, parentId, itemText, "radio", disabled, img, imgDis);if (this.idPull["polygon_"+parentId] == null){this._renderSublevelPolygon(parentId, parentId);};this._renderSublevelItem(id, pos-1);this._redefineComplexState(parentId);};var gr = (group!=null?group:this._genStr(24));this.itemPull[id]["group"] = gr;if (this.radio[gr]==null){this.radio[gr] = new Array();};this.radio[gr][this.radio[gr].length] = id;if (state == true)this.setRadioChecked(gr, String(id).replace(this.idPrefix, ""));};dhtmlXMenuObject.prototype._getCheckboxState = function(id) {if (this.itemPull[this.idPrefix+id] == null)return null;return this.itemPull[this.idPrefix+id]["checked"];};dhtmlXMenuObject.prototype._setCheckboxState = function(id, state) {if (this.itemPull[this.idPrefix+id] == null)return;this.itemPull[this.idPrefix+id]["checked"] = state;};dhtmlXMenuObject.prototype._updateCheckboxImage = function(id) {if (this.idPull[this.idPrefix+id] == null)return;this.itemPull[this.idPrefix+id]["imgen"] = "chbx_"+(this._getCheckboxState(id)?"1":"0");this.itemPull[this.idPrefix+id]["imgdis"] = this.itemPull[this.idPrefix+id]["imgen"];try {this.idPull[this.idPrefix+id].childNodes[(this._rtl?2:0)].childNodes[0].className = "sub_icon "+this.itemPull[this.idPrefix+id]["imgen"];}catch(e){}};dhtmlXMenuObject.prototype._checkboxOnClickHandler = function(id, type, casState) {if (type.charAt(1)=="d") return;if (this.itemPull[this.idPrefix+id] == null)return;var state = this._getCheckboxState(id);if (this.checkEvent("onCheckboxClick")) {if (this.callEvent("onCheckboxClick", [id, state, this.contextMenuZoneId, casState])) {this.setCheckboxState(id, !state);}}else {this.setCheckboxState(id, !state);};if (this.checkEvent("onClick")) this.callEvent("onClick", [id]);};dhtmlXMenuObject.prototype.setCheckboxState = function(id, state) {this._setCheckboxState(id, state);this._updateCheckboxImage(id);};dhtmlXMenuObject.prototype.getCheckboxState = function(id) {return this._getCheckboxState(id);};dhtmlXMenuObject.prototype.addCheckbox = function(mode, nextToId, pos, itemId, itemText, state, disabled) {if (this.context && nextToId == this.topId){}else {if (this.itemPull[this.idPrefix+nextToId] == null)return;if (mode == "child" && this.itemPull[this.idPrefix+nextToId]["type"] != "item")return;};var img = "chbx_"+(state?"1":"0");var imgDis = img;if (mode == "sibling"){var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));var parentId = this.idPrefix+this.getParentId(nextToId);this._addItemIntoGlobalStrorage(id, parentId, itemText, "checkbox", disabled, img, imgDis);this.itemPull[id]["checked"] = state;this._renderSublevelItem(id, this.getItemPosition(nextToId));}else {var id = this.idPrefix+(itemId!=null?itemId:this._genStr(24));var parentId = this.idPrefix+nextToId;this._addItemIntoGlobalStrorage(id, parentId, itemText, "checkbox", disabled, img, imgDis);this.itemPull[id]["checked"] = state;if (this.idPull["polygon_"+parentId] == null){this._renderSublevelPolygon(parentId, parentId);};this._renderSublevelItem(id, pos-1);this._redefineComplexState(parentId);}};dhtmlXMenuObject.prototype._readLevel = function(parentId) {var xml = "";for (var a in this.itemPull){if (this.itemPull[a]["parent"] == parentId){var imgEn = "";var imgDis = "";var hotKey = "";var itemId = String(this.itemPull[a]["id"]).replace(this.idPrefix,"");var itemType = "";var itemText = (this.itemPull[a]["title"]!=""?' text="'+this.itemPull[a]["title"]+'"':"");var itemState = "";if (this.itemPull[a]["type"] == "item"){if (this.itemPull[a]["imgen"] != "")imgEn = ' img="'+this.itemPull[a]["imgen"]+'"';if (this.itemPull[a]["imgdis"] != "")imgDis = ' imgdis="'+this.itemPull[a]["imgdis"]+'"';if (this.itemPull[a]["hotkey"] != "")hotKey = '<hotkey>'+this.itemPull[a]["hotkey"]+'</hotkey>';};if (this.itemPull[a]["type"] == "separator"){itemType = ' type="separator"';}else {if (this.itemPull[a]["state"] == "disabled")itemState = ' enabled="false"';};if (this.itemPull[a]["type"] == "checkbox"){itemType = ' type="checkbox"'+(this.itemPull[a]["checked"]?' checked="true"':"");};if (this.itemPull[a]["type"] == "radio"){itemType = ' type="radio" group="'+this.itemPull[a]["group"]+'" '+(this.itemPull[a]["checked"]?' checked="true"':"");};xml += "<item id='"+itemId+"'"+itemText+itemType+imgEn+imgDis+itemState+">";xml += hotKey;if (this.itemPull[a]["complex"])xml += this._readLevel(a);xml += "</item>";}};return xml;};dhtmlXMenuObject.prototype.serialize = function() {var xml = "<menu>"+this._readLevel(this.idPrefix+this.topId)+"</menu>";return xml;};
//v.2.6 build 100722

/*
Copyright DHTMLX LTD. http://www.dhtmlx.com
You allowed to use this component or parts of it under GPL terms
To use it on other terms or get Professional edition of the component please contact us at sales@dhtmlx.com
*/